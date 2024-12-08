'use server';

import { getSession, createSessionCookie, verifySession } from '@/lib/session';
import { SESSION_COOKIE_NAME, TEMP_EMAIL_COOKIE_NAME } from "@/lib/constants";
import { DEFAULT_ADMIN_REDIRECT } from "@/routes";
import { prisma } from "@/lib/db";
import { loginRateLimit } from "@/lib/rate-limit";
import { cookies } from "next/headers";
import { verifyTOTP, verifyBackupCode } from "@/lib/totp";
import { adminAuth } from "@/lib/firebase-admin";
import { compare } from "bcryptjs";

// Types
export interface AuthResult {
  success?: boolean;
  error?: string;
  redirectTo?: string;
  twoFactor?: boolean;
}

interface LoginFormData {
  email: string;
  password: string;
  callbackUrl?: string;
  twoFactorCode?: string;
}

interface VerifyCodeParams {
  code: string;
  type: 'totp' | 'backup';
}

// Helper Functions
const setSessionCookie = async (uid: string, email: string) => {
  const cookieStore = await cookies();
  const sessionCookie = await createSessionCookie(uid, email);
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 5 // 5 days
  });
  
  return sessionCookie;
};

const validateLoginInput = (formData: LoginFormData): AuthResult | null => {
  if (!formData || typeof formData !== 'object') {
    return { success: false, error: "Invalid request format" };
  }

  if (!formData.email || !formData.password) {
    return { success: false, error: "Email and password are required" };
  }

  return null;
};

async function getOrCreateFirebaseUser(email: string) {
  try {
    return await adminAuth.getUserByEmail(email);
  } catch (error) {
    return await adminAuth.createUser({
      email,
      emailVerified: true,
    });
  }
}

// Main Functions
export async function adminLogin(formData: LoginFormData): Promise<AuthResult> {
  try {
    const { email, password, callbackUrl, twoFactorCode } = formData;

    // Validate input
    const validationError = validateLoginInput(formData);
    if (validationError) return validationError;

    // Check rate limit
    const { success: rateCheckSuccess } = await loginRateLimit.check(email);
    if (!rateCheckSuccess) {
      return { error: "Too many attempts. Please try again later." };
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
      },
    });

    if (!admin?.password) {
      console.log('Admin not found:', email);
      return { error: "Invalid credentials" };
    }

    // Verify password
    const isValid = await compare(password, admin.password);
    if (!isValid) {
      console.log('Invalid password for:', email);
      return { error: "Invalid credentials" };
    }

    // Handle 2FA
    if (admin.twoFactorEnabled) {
      if (!twoFactorCode) {
        const cookieStore = cookies();
        cookieStore.set(TEMP_EMAIL_COOKIE_NAME, email, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 10, // 10 minutes
        });

        return {
          success: true,
          twoFactor: true,
          redirectTo: "/admin/auth/verify"
        };
      }

      const verified = await verifyTOTP(admin.twoFactorSecret, twoFactorCode);
      if (!verified) {
        console.log('Invalid TOTP code');
        return { error: "Invalid verification code" };
      }
    }

    // Create session
    const firebaseUser = await getOrCreateFirebaseUser(email);
    await setSessionCookie(firebaseUser.uid, email);

    return {
      success: true,
      redirectTo: callbackUrl || DEFAULT_ADMIN_REDIRECT,
    };

  } catch (error) {
    console.error('Login error:', error);
    return { error: "An unexpected error occurred" };
  }
}

export async function verifyAdminCode(params: VerifyCodeParams): Promise<AuthResult> {
  try {
    const { code, type } = params;
    const cookieStore = cookies();
    const tempEmailCookie = cookieStore.get(TEMP_EMAIL_COOKIE_NAME);

    if (!tempEmailCookie?.value) {
      console.error('No temporary email cookie found');
      return { error: 'Invalid session. Please try logging in again.' };
    }

    const email = tempEmailCookie.value;
    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        twoFactorSecret: true,
        backupCodes: true,
      },
    });

    if (!admin) {
      console.error('Admin not found:', email);
      return { error: 'Invalid credentials' };
    }

    let verified = false;

    if (type === 'totp') {
      verified = await verifyTOTPCode(code, admin.twoFactorSecret);
    } else if (type === 'backup') {
      verified = await verifyBackupCodeAndUpdate(code, admin);
    }

    if (verified) {
      try {
        const firebaseUser = await getOrCreateFirebaseUser(email);
        await setSessionCookie(firebaseUser.uid, email);
        cookieStore.delete(TEMP_EMAIL_COOKIE_NAME);

        return {
          success: true,
          redirectTo: DEFAULT_ADMIN_REDIRECT,
        };
      } catch (error) {
        console.error('Error creating session:', error);
        return { error: 'Failed to create session' };
      }
    }

    return { error: 'Verification failed' };
  } catch (error) {
    console.error('Error during verification:', error);
    return { error: 'An error occurred during verification' };
  }
}

async function verifyTOTPCode(code: string, secret: string | null): Promise<boolean> {
  if (!secret) {
    console.error('No TOTP secret found');
    return false;
  }

  const cleanCode = code.replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleanCode)) {
    console.error('Invalid TOTP code format:', cleanCode);
    return false;
  }

  return await verifyTOTP(secret, cleanCode);
}

async function verifyBackupCodeAndUpdate(code: string, admin: any): Promise<boolean> {
  if (!admin.backupCodes?.length) {
    console.error('No backup codes available');
    return false;
  }

  const isValid = verifyBackupCode(admin.backupCodes, code);
  if (!isValid) return false;

  const updatedBackupCodes = admin.backupCodes.filter(
    (storedCode: string) => storedCode.toUpperCase() !== code.toUpperCase()
  );

  await prisma.admin.update({
    where: { id: admin.id },
    data: { backupCodes: updatedBackupCodes },
  });

  return true;
}