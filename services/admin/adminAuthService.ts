import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"
import { generateTOTP, verifyTOTP } from "@/utils/admin/totp"
import { AdminTokenService } from "./adminTokenService"
import { AdminSecurityService } from "./adminSecurityService"
import { generateOTP } from "@/services/token/tokenService"

export class AdminAuthService {
  private tokenService: AdminTokenService
  private securityService: AdminSecurityService

  constructor() {
    this.tokenService = new AdminTokenService()
    this.securityService = new AdminSecurityService()
  }

  async validateCredentials(email: string, password: string, ip: string, userAgent?: string) {
    const admin = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase(),
        role: "ADMIN"
      }
    })

    if (!admin) {
      return { success: false, error: "Invalid credentials" }
    }

    // Check if account is locked
    if (admin.isLocked && admin.lockedUntil && admin.lockedUntil > new Date()) {
      return { 
        success: false, 
        error: "Account is locked. Please try again later.",
        lockedUntil: admin.lockedUntil 
      }
    }

    const isValidPassword = await compare(password, admin.password)

    // Log admin activity
    await prisma.userActivity.create({
      data: {
        userId: admin.id,
        action: isValidPassword ? "LOGIN_SUCCESS" : "LOGIN_FAILED",
        details: JSON.stringify({ ip, userAgent }),
      }
    })

    if (!isValidPassword) {
      // Increment failed attempts
      const updatedAdmin = await prisma.user.update({
        where: { id: admin.id },
        data: {
          failedLoginAttempts: { increment: 1 }
        }
      })

      // Lock account if too many failed attempts
      if (updatedAdmin.failedLoginAttempts >= 5) {
        const lockedUntil = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        await prisma.user.update({
          where: { id: admin.id },
          data: {
            isLocked: true,
            lockedUntil
          }
        })

        await prisma.adminLog.create({
          data: {
            userId: admin.id,
            action: "ACCOUNT_LOCKED",
            details: "Account locked due to too many failed login attempts",
            ip,
            userAgent
          }
        })

        return { 
          success: false, 
          error: "Account locked due to too many failed attempts",
          lockedUntil
        }
      }

      return { success: false, error: "Invalid credentials" }
    }

    // Reset failed attempts on successful login
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        failedLoginAttempts: 0,
        isLocked: false,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip
      }
    })

    return { 
      success: true, 
      admin,
      requiresTwoFactor: admin.isTwoFactorEnabled 
    }
  }

  async createVerification(userId: string, phone: string) {
    const code = generateOTP()
    
    // Delete any existing verification tokens
    await prisma.adminVerification.deleteMany({
      where: {
        userId,
        verified: false
      }
    })

    // Create new verification token
    const verification = await prisma.adminVerification.create({
      data: {
        userId,
        phone,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    })

    return verification
  }

  async verifyCode(userId: string, code: string) {
    const verification = await prisma.adminVerification.findFirst({
      where: {
        userId,
        code,
        verified: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!verification) {
      return {
        success: false,
        error: "Invalid or expired verification code"
      }
    }

    if (verification.attempts >= 3) {
      return {
        success: false,
        error: "Too many verification attempts"
      }
    }

    // Update verification status
    await prisma.adminVerification.update({
      where: { id: verification.id },
      data: {
        verified: true,
        attempts: { increment: 1 }
      }
    })

    return {
      success: true
    }
  }

  async createSession(userId: string, ip: string, userAgent?: string) {
    const token = await this.tokenService.generateSessionToken(userId)
    
    const session = await prisma.adminSession.create({
      data: {
        userId,
        token,
        ip,
        userAgent,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    return session
  }
}
