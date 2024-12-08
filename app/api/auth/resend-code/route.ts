import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateVerificationToken } from '@/services/token/tokenService';
import { sendVerificationEmail } from '@/services/email/emailService';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log("[RESEND] User verification status:", {
      email: user.email,
      isVerified: user.emailVerified,
      verifiedAt: user.emailVerifiedAt
    });

    // Generate new verification token
    const verificationToken = await generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log("[RESEND] Current user data:", {
      userId: user.id,
      email: user.email,
    });
    console.log("[RESEND] Generating new token:", {
      newToken: verificationToken,
      expiry: tokenExpiry
    });

    // Update user with new token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: tokenExpiry,
        emailVerified: false, // Reset verification status
        emailVerifiedAt: null
      },
    });

    console.log("[RESEND] Updated user data:", {
      userId: updatedUser.id,
      email: updatedUser.email,
      newToken: updatedUser.emailVerificationToken,
      tokenExpiry: updatedUser.emailVerificationTokenExpiry
    });

    // Send verification email
    await sendVerificationEmail(
      email,
      verificationToken,
      user.name.split(' ')[0]
    );
    return NextResponse.json({
      message: 'Verification code sent successfully',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
