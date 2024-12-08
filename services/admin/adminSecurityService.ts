import { prisma } from "@/lib/db"

interface SecurityLogData {
  userId: string
  action: string
  ip: string
  userAgent?: string
  details?: string
}

export class AdminSecurityService {
  async logSecurityEvent(data: SecurityLogData) {
    return prisma.adminLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        ip: data.ip,
        userAgent: data.userAgent,
        details: data.details
      }
    })
  }

  async isIPBlocked(ip: string): Promise<boolean> {
    const blockedIP = await prisma.blockedIP.findUnique({
      where: { ip }
    })

    if (!blockedIP) return false

    // If IP is blocked but has an unblock date
    if (blockedIP.unblockedAt) {
      return blockedIP.unblockedAt > new Date()
    }

    return true
  }

  async blockIP(ip: string, reason?: string, duration?: number) {
    const unblockedAt = duration ? new Date(Date.now() + duration) : null

    return prisma.blockedIP.upsert({
      where: { ip },
      update: {
        reason,
        unblockedAt,
        updatedAt: new Date()
      },
      create: {
        ip,
        reason,
        unblockedAt
      }
    })
  }

  async unblockIP(ip: string) {
    return prisma.blockedIP.update({
      where: { ip },
      data: {
        unblockedAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  async getAdminSecurityLogs(userId: string, limit = 50) {
    return prisma.adminLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit
    })
  }

  async getAdminSessions(userId: string) {
    return prisma.adminSession.findMany({
      where: { 
        userId,
        revoked: false 
      },
      orderBy: { createdAt: "desc" }
    })
  }

  async validateSession(token: string) {
    const session = await prisma.adminSession.findFirst({
      where: { 
        token,
        revoked: false,
        expiresAt: {
          gt: new Date()
        }
      },
      include: { 
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isTwoFactorEnabled: true
          }
        } 
      }
    })

    if (!session || session.user.role !== "ADMIN") return null

    // Update last active timestamp
    await prisma.adminSession.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() }
    })

    return session
  }

  async revokeSession(token: string) {
    return prisma.adminSession.update({
      where: { token },
      data: { revoked: true }
    })
  }

  async revokeAllSessions(userId: string, exceptToken?: string) {
    return prisma.adminSession.updateMany({
      where: {
        userId,
        token: exceptToken ? { not: exceptToken } : undefined,
        revoked: false
      },
      data: {
        revoked: true
      }
    })
  }

  async updateTwoFactorStatus(userId: string, enable: boolean) {
    if (enable) {
      await prisma.twoFactorConfirmation.create({
        data: {
          userId
        }
      })
    } else {
      await prisma.twoFactorConfirmation.delete({
        where: { userId }
      })
    }

    return prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: enable }
    })
  }

  async generateBackupCodes(userId: string) {
    const codes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substr(2, 8).toUpperCase()
    )

    await prisma.user.update({
      where: { id: userId },
      data: { backupCodes: codes }
    })

    return codes
  }
}
