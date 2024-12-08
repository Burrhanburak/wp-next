import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { RegisterSchema } from '@/utils/validations';
import { generateVerificationToken } from '@/services/token/tokenService';
import { sendVerificationEmail } from '@/services/email/emailService';
import { getClientIp } from '@/lib/utils';
import { userLoginLimiter, isUserRateLimited } from '@/lib/user-rate-limit';

export async function POST(req: Request) {
  try {
    // Check rate limit
    const ip = getClientIp(req.headers);
    const isLimited = await isUserRateLimited(userLoginLimiter, ip);
    if (isLimited) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    console.log('Request body:', body);
    const validatedFields = RegisterSchema.safeParse(body);

    console.log('RegisterSchema:', RegisterSchema);
    console.log('Body:', body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validatedFields.data;

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);
    // Generate verification code and expiry
    const verificationToken = generateVerificationToken();
    console.log('[DEBUG] Generated Token:', verificationToken);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        emailVerified: false,
        image: '/images/default-user.jpg', // Varsayılan resim yolu
        role: 'USER', // Default role
      },
    });

    // Send verification email
    console.log('[REGISTER] Sending verification email to:', {
      email,
      name: user.name,
      token: verificationToken,
    });

    const emailResult = await sendVerificationEmail(
      email,
      verificationToken,
      user.name.split(' ')[0]
    );

    if ('error' in emailResult) {
      console.error('[REGISTER] Failed to send verification email:', emailResult.error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to send verification email' }),
        { status: 500 }
      );
    }

    console.log('[REGISTER] Verification email sent successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Verification email sent!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong!' },
      { status: 500 }
    );
  }
}
