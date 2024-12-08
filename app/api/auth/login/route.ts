'use server';

import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { getClientIp } from "@/lib/utils";
import { userLoginLimiter, isUserRateLimited } from "@/lib/user-rate-limit";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(req: Request) {
  try {
    // Check rate limit
    const ip = getClientIp(req.headers)
    const isLimited = await isUserRateLimited(userLoginLimiter, ip)
    if (isLimited) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { email, password } = loginSchema.parse(body)

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Email doğrulaması kontrolü
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email address' },
        { status: 403 }
      );
    }

    // Yeni session oluştur
    const sessionToken = uuidv4();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 gün

    await prisma.session.create({
      data: {
        id: sessionToken,
        userId: user.id,
        expires,
      },
    });

    // Yeni bir NextResponse nesnesi oluştur ve çerez ekle
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set-Cookie başlığı ekle
    response.cookies.set('session', sessionToken, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
