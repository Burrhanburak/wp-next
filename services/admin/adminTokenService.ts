import { auth } from "@/auth";
import { generateTOTP, verifyTOTP } from "@/utils/admin/totp";
import { prisma } from "@/lib/db"
import { redis } from "@/lib/rate-limit"
import { generateOTP } from "@/services/token/tokenService"
import { getClientIp } from "@/lib/utils";
import { randomBytes, createHash } from "crypto"
import { encrypt, decrypt } from "@/utils/admin/crypto"

const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET!

export class AdminTokenService {
  private readonly TOKEN_LENGTH = 32
  private readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours
  private readonly ENCRYPTION_KEY = ADMIN_TOKEN_SECRET

  /**
   * Get the current admin session
   */
  static async getAdminSession() {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return null;
    }

    return session;
  }

  /**
   * Validate admin session
   */
  static async validateSession() {
    const session = await this.getAdminSession();
    return !!session;
  }

  /**
   * Create a new admin session record
   */
  static async createSessionRecord(userId: string, userAgent?: string, ip?: string) {
    return await prisma.adminSession.create({
      data: {
        userId,
        userAgent: userAgent || "Unknown",
        ip: ip || "Unknown",
        revoked: false,
      }
    });
  }

  /**
   * Invalidate all sessions for an admin
   */
  static async invalidateAllSessions(userId: string) {
    await prisma.adminSession.updateMany({
      where: {
        userId,
        revoked: false,
      },
      data: {
        revoked: true,
      }
    });
  }

  /**
   * Get all active sessions for an admin
   */
  static async getActiveSessions(userId: string) {
    return await prisma.adminSession.findMany({
      where: {
        userId,
        revoked: false,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async generateVerificationToken(userId: string, code: string) {
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
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    })

    return verification
  }

  async validateVerificationToken(userId: string, code: string) {
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
      return false
    }

    if (verification.attempts >= 3) {
      return false
    }

    // Update verification status
    await prisma.adminVerification.update({
      where: {
        id: verification.id
      },
      data: {
        verified: true,
        attempts: { increment: 1 }
      }
    })

    return true
  }

  async generateSessionToken(userId: string) {
    const token = randomBytes(this.TOKEN_LENGTH).toString("hex")
    const timestamp = Date.now()
    const signature = this.generateSignature(token, timestamp)

    const tokenData = {
      token,
      timestamp,
      signature,
      userId
    }

    return this.encryptToken(tokenData)
  }

  async validateSessionToken(encryptedToken: string) {
    try {
      const tokenData = await this.decryptToken(encryptedToken)
      
      if (!tokenData || !tokenData.token || !tokenData.timestamp || !tokenData.signature || !tokenData.userId) {
        return false
      }

      // Check if token is expired
      if (Date.now() - tokenData.timestamp > this.TOKEN_EXPIRY) {
        return false
      }

      // Verify signature
      const expectedSignature = this.generateSignature(tokenData.token, tokenData.timestamp)
      return tokenData.signature === expectedSignature

    } catch (error) {
      console.error("[TOKEN_VALIDATION_ERROR]", error)
      return false
    }
  }

  async generateResetToken(userId: string) {
    const token = randomBytes(32).toString("hex")
    const timestamp = Date.now()
    
    const tokenData = {
      token,
      timestamp,
      type: "reset",
      userId,
      signature: this.generateSignature(token, timestamp)
    }

    return this.encryptToken(tokenData)
  }

  async generateInviteToken(userId: string, expiresIn: number = 24 * 60 * 60 * 1000) {
    const token = randomBytes(32).toString("hex")
    const timestamp = Date.now()
    
    const tokenData = {
      token,
      timestamp,
      type: "invite",
      userId,
      expiresAt: timestamp + expiresIn,
      signature: this.generateSignature(token, timestamp)
    }

    return this.encryptToken(tokenData)
  }

  async validateToken(encryptedToken: string, type: "reset" | "invite") {
    try {
      const tokenData = await this.decryptToken(encryptedToken)
      
      if (!tokenData || tokenData.type !== type) {
        return { valid: false, error: "Invalid token" }
      }

      // Check expiration
      const expiresAt = tokenData.expiresAt || (tokenData.timestamp + this.TOKEN_EXPIRY)
      if (Date.now() > expiresAt) {
        return { valid: false, error: "Token expired" }
      }

      // Verify signature
      const expectedSignature = this.generateSignature(tokenData.token, tokenData.timestamp)
      if (tokenData.signature !== expectedSignature) {
        return { valid: false, error: "Invalid signature" }
      }

      return { valid: true, data: tokenData }

    } catch (error) {
      console.error("[TOKEN_VALIDATION_ERROR]", error)
      return { valid: false, error: "Token validation failed" }
    }
  }

  private generateSignature(token: string, timestamp: number): string {
    const data = `${token}:${timestamp}:${this.ENCRYPTION_KEY}`
    return createHash("sha256").update(data).digest("hex")
  }

  private async encryptToken(data: any): Promise<string> {
    return encrypt(JSON.stringify(data))
  }

  private async decryptToken(encryptedToken: string): Promise<any> {
    const decrypted = decrypt(encryptedToken)
    return JSON.parse(decrypted)
  }

  // Generate new 2FA secret for admin
  async setupAdmin2FA(userId: string) {
    const admin = await prisma.user.findUnique({
      where: { 
        id: userId,
        role: "ADMIN"
      }
    })

    if (!admin) {
      throw new Error("Admin not found")
    }

    const secret = randomBytes(20).toString("hex")
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorEnabled: true
      }
    })

    await prisma.twoFactorConfirmation.create({
      data: {
        userId
      }
    })

    return secret
  }

  // Verify 2FA code
  async verify2FACode(code: string, userId: string): Promise<boolean> {
    const admin = await prisma.user.findUnique({
      where: { 
        id: userId,
        role: "ADMIN"
      }
    })

    if (!admin?.isTwoFactorEnabled) {
      return false
    }

    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
      where: { userId }
    })

    if (!twoFactorConfirmation) {
      return false
    }

    return verifyTOTP(code, userId)
  }
}