// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { prisma } from "@/lib/db";
// import { signIn } from "@/auth";
// import { cookies } from "next/headers";

// const verifySchema = z.object({
//   email: z.string().email(),
//   token: z.string().min(6).max(6),
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const validatedFields = verifySchema.safeParse(body);

//     if (!validatedFields.success) {
//       console.error("[VERIFY] Validation error:", validatedFields.error);
//       return new NextResponse(
//         JSON.stringify({ error: "Invalid verification data" }),
//         { status: 400 }
//       );
//     }

//     const { email, token } = validatedFields.data;

//     console.log("[VERIFY] Attempting verification:", {
//       email,
//       token,
//       currentTime: new Date(Date.now())
//     });

//     // First find user without token check
//     const userCheck = await prisma.user.findFirst({
//       where: { email }
//     });

//     if (!userCheck) {
//       return new NextResponse(
//         JSON.stringify({ error: "User not found" }),
//         { status: 404 }
//       );
//     }

//     console.log("[VERIFY] Found user data:", {
//       userId: userCheck.id,
//       email: userCheck.email,
//       storedToken: userCheck.emailVerificationToken,
//       tokenExpiry: userCheck.emailVerificationTokenExpiry,
//       tokenMatches: userCheck.emailVerificationToken === token,
//       isExpired: userCheck.emailVerificationTokenExpiry ? new Date(userCheck.emailVerificationTokenExpiry) <= new Date(Date.now()) : true
//     });

//     // Kullanıcıyı ve doğrulama token'ını bul
//     const user = await prisma.user.findFirst({
//       where: {
//         email,
//         emailVerificationToken: token,
//         emailVerificationTokenExpiry: {
//           gt: new Date(Date.now()),
//         },
//       },
//     });
//      // Create session by signing in the user
//      const signInResult = await signIn("credentials", {
//       email,
//       password: user.password, // We need this for the credentials provider
//       redirect: false,
//     });


//     if (signInResult?.error) {
//       console.error("[VERIFY] Sign in failed after verification:", signInResult.error);
//       return NextResponse.json(
//         { 
//           success: true,
//           message: "Email verified but automatic login failed. Please login manually.",
//           redirectUrl: "/auth/login"
//         },
//         { status: 200 }
//       );
//     }


//     if (!user) {
//       console.error("[VERIFY] User or token not found");
//       return new NextResponse(
//         JSON.stringify({ error: "Invalid or expired verification code" }),
//         { status: 400 }
//       );
//     }

//     // Kullanıcıyı doğrula
//     const updatedUser = await prisma.user.update({
//       where: { id: user.id , emailVerificationToken: token, emailVerificationTokenExpiry: { gt: new Date(Date.now()) } },
//       data: {
//         emailVerified: true,
//         emailVerifiedAt: new Date(),
//         emailVerificationToken: null,
//         emailVerificationTokenExpiry: null,
//       },
//     });

//     console.log("[VERIFY] User verified:", updatedUser);

//     return new NextResponse(
//       JSON.stringify({
//         success: true,
//         message: "Email verified successfully. Please login to continue.",
//         redirectUrl: "/dashboard"
//       }),
//       { status: 200, headers: signInResult.headers }
//     );

//   } catch (error) {
//     console.error("[VERIFY] Internal error:", error);
//     return new NextResponse(
//       JSON.stringify({
//         error: "Internal server error during verification",
//       }),
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { signIn } from "@/auth";
import { cookies } from "next/headers";

const verifySchema = z.object({
  email: z.string().email(),
  token: z.string().min(6).max(6),
});

export async function POST(req: Request) {
  try {
    // Validate request body
    const body = await req.json();
    const validatedFields = verifySchema.safeParse(body);

    if (!validatedFields.success) {
      console.error("[VERIFY] Validation error:", validatedFields.error);
      return NextResponse.json(
        { error: "Invalid verification data" },
        { status: 400 }
      );
    }

    const { email, token } = validatedFields.data;

    console.log("[VERIFY] Attempting verification:", {
      email,
      token,
      currentTime: new Date()
    });

    // Find user without token check first
    const userCheck = await prisma.user.findFirst({
      where: { email }
    });

    if (!userCheck) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Log verification attempt details
    console.log("[VERIFY] Found user data:", {
      userId: userCheck.id,
      email: userCheck.email,
      storedToken: userCheck.emailVerificationToken,
      tokenExpiry: userCheck.emailVerificationTokenExpiry,
      tokenMatches: userCheck.emailVerificationToken === token,
      isExpired: userCheck.emailVerificationTokenExpiry 
        ? new Date(userCheck.emailVerificationTokenExpiry) <= new Date() 
        : true
    });

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        email,
        emailVerificationToken: token,
        emailVerificationTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      console.error("[VERIFY] User or token not found/expired");
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
        emailVerificationToken: token,
        emailVerificationTokenExpiry: {
          gt: new Date()
        }
      },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        image: user.image || "/default-avatar.png", // Eğer `null` ise varsayılan değer atanır

        emailVerificationTokenExpiry: null,
      },
    });

    console.log("[VERIFY] User verified:", updatedUser);

    // Attempt to sign in the user
    const signInResult = await signIn("credentials", {
      email,
      isVerification: true, // Add flag to skip password check
      redirect: false,
    });

    if (signInResult?.error) {
      console.error("[VERIFY] Sign in failed after verification:", signInResult.error);
      return NextResponse.json({ 
        success: true,
        message: "Email verified but automatic login failed. Please login manually.",
        redirectUrl: "/auth/login"
      });
    }

    // Success response with sign-in headers
    return NextResponse.json({
      success: true,
      message: "Email verified and logged in successfully.",
      redirectUrl: "/dashboard"
    }, { 
      status: 200,
      headers: signInResult.headers 
    });

  } catch (error) {
    console.error("[VERIFY] Internal error:", error);
    return NextResponse.json({
      error: "Internal server error during verification",
    }, { 
      status: 500 
    });
  }
}