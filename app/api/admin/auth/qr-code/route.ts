import { NextRequest, NextResponse } from "next/server";
import { generateTOTPSecret, generateTOTPUri } from "@/lib/totp";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import QRCode from "qrcode";
import { auth } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const cookiesList = cookies();
    const adminSession = cookiesList.get("admin-session");

    if (!adminSession?.value) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(adminSession.value);
    if (!decodedToken.email) {
      return new NextResponse("Invalid session", { status: 401 });
    }

    // Get admin from database
    const admin = await prisma.admin.findUnique({
      where: {
        email: decodedToken.email
      },
      select: {
        id: true,
        email: true,
        twoFactorSecret: true
      }
    });

    if (!admin) {
      return new NextResponse("Admin not found", { status: 404 });
    }

    // Generate new TOTP secret if not exists
    const secret = admin.twoFactorSecret || generateTOTPSecret();

    // Save secret if it's new
    if (!admin.twoFactorSecret) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: { twoFactorSecret: secret }
      });
    }

    // Generate QR code URI
    const uri = generateTOTPUri(secret, admin.email, "NextWhatsApp Admin");
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(uri);

    return NextResponse.json({ 
      qrCode: qrCodeDataUrl,
      secret 
    });

  } catch (error) {
    console.error("QR code generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
