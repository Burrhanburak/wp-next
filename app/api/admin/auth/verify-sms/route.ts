import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { sendSMSWithFormatting as sendSMS, generateVerificationCode, formatPhoneNumber } from "@/lib/sms"
import { cacheVerificationCode, checkRateLimit } from "@/lib/cache"

// Rate limiting configuration
const RATE_LIMIT = {
  attempts: 3,    // Maximum attempts
  window: 300     // Time window in seconds (5 minutes)
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get admin's phone number
    const admin = await prisma.user.findUnique({
      where: {
        id: session.user.id,
        role: "ADMIN"
      },
      select: {
        phone: true,
        name: true
      }
    })

    if (!admin?.phone) {
      return new NextResponse("Admin phone not found", { status: 404 })
    }

    // Check rate limit
    const rateLimitKey = `sms:${session.user.id}`
    const withinLimit = await checkRateLimit(
      rateLimitKey,
      RATE_LIMIT.attempts,
      RATE_LIMIT.window
    )

    if (!withinLimit) {
      return new NextResponse(
        "Too many attempts. Please try again later.",
        { status: 429 }
      )
    }

    // Generate and cache verification code
    const code = generateVerificationCode()
    await cacheVerificationCode(session.user.id, code)

    // Format phone number and send SMS
    const formattedPhone = formatPhoneNumber(admin.phone)
    const success = await sendSMS({
      to: formattedPhone,
      message: `Merhaba ${admin.name}, WhatsApp Bulk yönetici doğrulama kodunuz: ${code}`
    })

    if (!success) {
      return new NextResponse(
        "Failed to send verification code",
        { status: 500 }
      )
    }

    // Log verification attempt
    await prisma.adminLog.create({
      data: {
        userId: session.user.id,
        action: "VERIFY_ATTEMPT",
        details: `Verification code sent to ${admin.phone}`
      }
    })

    // Return masked phone number
    const maskedPhone = admin.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
    return NextResponse.json({ 
      message: "Verification code sent",
      phone: maskedPhone
    })

  } catch (error) {
    console.error("[SEND_CODE_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
