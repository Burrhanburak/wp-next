// api/admin/auth/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: "Email and password are required" 
      }, { status: 400 });
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        twoFactorEnabled: true
      }
    });

    if (!admin?.password) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid credentials" 
      }, { status: 401 });
    }

    // Verify password
    const isValid = await compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid credentials" 
      }, { status: 401 });
    }

    // Create Firebase user if doesn't exist
    let firebaseUser;
    try {
      firebaseUser = await adminAuth.getUserByEmail(email);
    } catch {
      firebaseUser = await adminAuth.createUser({
        email,
        emailVerified: true
      });
    }

    // Create session
    const customToken = await adminAuth.createCustomToken(firebaseUser.uid, {
      email,
      role: 'admin'
    });

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(customToken, {
      expiresIn
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000 // Convert to seconds
    });

    return NextResponse.json({
      success: true,
      twoFactorEnabled: admin.twoFactorEnabled
    });

  } catch (error) {
    console.error("[ADMIN_AUTH]", error);
    return NextResponse.json({ 
      success: false, 
      error: "Authentication failed" 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return NextResponse.json({ 
        success: false, 
        error: "No session found" 
      }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      true
    );

    return NextResponse.json({
      success: true,
      user: {
        email: decodedClaims.email,
        uid: decodedClaims.uid
      }
    });

  } catch (error) {
    console.error("[ADMIN_SESSION]", error);
    return NextResponse.json({ 
      success: false, 
      error: "Invalid session" 
    }, { status: 401 });
  }
}