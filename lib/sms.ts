import { auth } from './firebase';
import { PhoneAuthProvider } from 'firebase/auth';
import { prisma } from '@/lib/db';
import { loginRateLimit, smsRateLimit } from './rate-limit';

// Generate random 6-digit code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export class SMSService {
  static async sendVerificationCode(phoneNumber: string, recaptchaToken: string) {
    try {
      console.log('Starting SMS verification for:', phoneNumber);
      
      // Rate limiting kontrolü
      const { success, blocked, resetAt } = await smsRateLimit.check(`sms:${phoneNumber}`);
      if (blocked) {
        console.log('SMS blocked due to rate limit');
        throw new Error(`Too many SMS requests. Please try again after ${resetAt?.toLocaleTimeString()}`);
      }
      if (!success) {
        console.log('SMS rate limit exceeded');
        throw new Error('Too many SMS requests. Please try again later.');
      }

      console.log('Initializing Firebase Phone Auth Provider');
      const provider = new PhoneAuthProvider(auth);
      
      console.log('Sending verification code via Firebase');
      const verificationId = await provider.verifyPhoneNumber(
        phoneNumber,
        recaptchaToken as any
      );

      console.log('Verification ID received:', verificationId);

      // SMS doğrulama kaydını oluştur
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 dakika geçerli

      await prisma.smsVerification.create({
        data: {
          phoneNumber,
          verificationId,
          expiresAt,
          adminId: auth.currentUser?.uid || '',
        },
      });

      console.log('SMS verification record created');
      return { success: true, verificationId };
    } catch (error: any) {
      console.error('SMS sending error:', error);
      return { 
        success: false, 
        error: error.message || 'SMS sending failed',
        details: error 
      };
    }
  }

  static async verifyCode(verificationId: string, code: string) {
    try {
      console.log('Verifying SMS code');
      const verification = await prisma.smsVerification.findFirst({
        where: {
          verificationId,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!verification) {
        console.log('Verification record not found or expired');
        throw new Error('Verification code expired or invalid');
      }

      // Firebase ile kodu doğrula
      console.log('Verifying code with Firebase');
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const result = await auth.signInWithCredential(credential);

      if (!result.user) {
        console.log('Firebase verification failed');
        throw new Error('Invalid verification code');
      }

      console.log('SMS code verified successfully');
      return { success: true };
    } catch (error: any) {
      console.error('SMS verification error:', error);
      return { 
        success: false, 
        error: error.message || 'Verification failed',
        details: error 
      };
    }
  }
}
