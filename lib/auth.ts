import { authenticator } from 'otplib';
import { auth, db, sendSMSCode, verifySMSCode } from './firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Resend } from 'resend';
import { loginRateLimit } from './rate-limit';
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

const resend = new Resend(process.env.RESEND_API_KEY);

interface CriticalAction {
  type: 'DELETE_ACCOUNT' | 'CHANGE_PASSWORD' | 'UPDATE_PHONE' | 'BULK_ACTION';
  metadata?: Record<string, any>;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/auth/login",
    error: "/admin/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email.toLowerCase() },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
            twoFactorEnabled: true,
          },
        });

        if (!admin || !admin.password) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          twoFactorEnabled: admin.twoFactorEnabled,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          twoFactorEnabled: token.twoFactorEnabled,
        },
      };
    },
  },
};

export class AuthService {
  // 2FA Setup
  static async setupTwoFactor(userId: string) {
    const secret = authenticator.generateSecret();
    const backupCodes = this.generateBackupCodes();

    await prisma.admin.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        backupCodes,
      },
    });

    return {
      secret,
      backupCodes,
      otpauthUrl: authenticator.keyuri('admin@next-whatsapp.com', 'NextWhatsApp', secret)
    };
  }

  // Verify 2FA Token
  static verifyTwoFactorToken(token: string, secret: string): boolean {
    try {
      return authenticator.verify({ token, secret });
    } catch {
      return false;
    }
  }

  // Verify Backup Code
  static async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const admin = await prisma.admin.findUnique({
      where: { id: userId },
      select: { backupCodes: true },
    });
    
    if (!admin?.backupCodes?.includes(code)) return false;
    
    await prisma.admin.update({
      where: { id: userId },
      data: {
        backupCodes: {
          set: admin.backupCodes.filter(c => c !== code),
        },
      },
    });
    
    return true;
  }

  // Request SMS Verification for Critical Actions
  static async requestSMSVerification(userId: string, action: CriticalAction, recaptchaToken: string) {
    // Rate limit check
    const rateLimitResult = await loginRateLimit.check(`critical:${userId}`);
    if (!rateLimitResult.success) {
      throw new Error('Too many verification attempts. Please try again later.');
    }

    const admin = await prisma.admin.findUnique({
      where: { id: userId },
      select: { phone: true },
    });
    
    if (!admin?.phone) {
      throw new Error('Phone number not found');
    }

    // Send SMS
    const result = await sendSMSCode(admin.phone, recaptchaToken);
    if (!result.success) {
      throw new Error(result.error);
    }

    // Create verification record
    await prisma.verification.create({
      data: {
        adminId: userId,
        type: action.type,
        metadata: action.metadata,
        verificationId: result.verificationId,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        status: 'PENDING',
      },
    });

    return result.verificationId;
  }

  // Verify SMS Code
  static async verifySMSForCriticalAction(
    userId: string, 
    verificationId: string, 
    code: string
  ): Promise<boolean> {
    const result = await verifySMSCode(verificationId, code);
    if (!result.success) return false;

    const verification = await prisma.verification.findFirst({
      where: {
        adminId: userId,
        verificationId,
        status: 'PENDING',
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) return false;

    await prisma.verification.update({
      where: { id: verification.id },
      data: { status: 'COMPLETED' },
    });

    return true;
  }

  // Generate Backup Codes
  private static generateBackupCodes(count = 10): string[] {
    return Array.from({ length: count }, () =>
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );
  }
}
