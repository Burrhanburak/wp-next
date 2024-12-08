import { getFirestore, type Firestore } from 'firebase/firestore';
import { loginRateLimit } from '@/lib/rate-limit';
import { app, auth } from './firebase-client';

// Initialize client-side Firebase instances
const db = getFirestore(app);

// SMS verification helper functions
export async function sendSMSCode(phoneNumber: string, recaptchaToken: string) {
  try {
    // Rate limiting check
    const rateLimitResult = await loginRateLimit.check(`sms:${phoneNumber}`);
    if (!rateLimitResult.success) {
      throw new Error('Too many SMS requests. Please try again later.');
    }
    
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(
      phoneNumber,
      recaptchaToken as unknown as ApplicationVerifier
    );
    
    return { success: true, verificationId };
  } catch (error: any) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send SMS'
    };
  }
}

export async function verifySMSCode(verificationId: string, code: string) {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    const result = await signInWithCredential(auth, credential);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('SMS verification error:', error);
    return {
      success: false,
      error: error.message || 'Invalid verification code'
    };
  }
}

export { app as firebaseApp, auth, db };