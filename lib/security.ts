import { prisma } from './db';
import { rateLimit } from './rate-limit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Güvenlik sabitleri
const SECURITY_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  BLOCK_DURATION: 30 * 60, // 30 dakika
  SUSPICIOUS_IP_THRESHOLD: 10,
  IP_BLOCK_DURATION: 24 * 60 * 60, // 24 saat
  SESSION_DURATION: 7 * 24 * 60 * 60, // 7 gün
};

export async function isBlockedIP(ip: string) {
  const blockedIP = await prisma.blockedIP.findUnique({
    where: { ip }
  });

  if (blockedIP && blockedIP.expiresAt > new Date()) {
    return true;
  }

  // Şüpheli aktivite kontrolü
  const recentAttempts = await prisma.loginAttempt.count({
    where: {
      ip,
      createdAt: {
        gte: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      success: false
    }
  });

  if (recentAttempts >= SECURITY_CONSTANTS.SUSPICIOUS_IP_THRESHOLD) {
    await blockIP(ip, "Too many failed login attempts");
    return true;
  }

  return false;
}

export async function blockIP(ip: string, reason: string) {
  await prisma.blockedIP.create({
    data: {
      ip,
      reason,
      expiresAt: new Date(Date.now() + SECURITY_CONSTANTS.IP_BLOCK_DURATION * 1000)
    }
  });
}

export async function recordLoginAttempt(data: {
  ip: string;
  userId?: string;
  success: boolean;
  details?: string;
}) {
  await prisma.loginAttempt.create({
    data: {
      ...data,
      createdAt: new Date()
    }
  });

  if (!data.success && data.userId) {
    const failedAttempts = await getFailedLoginAttempts(data.userId);
    if (failedAttempts >= SECURITY_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
      await lockUserAccount(data.userId);
    }
  }
}

export async function getFailedLoginAttempts(userId: string): Promise<number> {
  const attempts = await prisma.loginAttempt.count({
    where: {
      userId,
      success: false,
      createdAt: {
        gte: new Date(Date.now() - SECURITY_CONSTANTS.BLOCK_DURATION * 1000)
      }
    }
  });
  return attempts;
}

export async function lockUserAccount(userId: string) {
  await prisma.admin.update({
    where: { id: userId },
    data: {
      isLocked: true,
      lockedUntil: new Date(Date.now() + SECURITY_CONSTANTS.BLOCK_DURATION * 1000)
    }
  });
}

export async function validateSession(sessionId: string): Promise<boolean> {
  const session = await redis.get(`session:${sessionId}`);
  return !!session;
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  await redis.set(
    `session:${sessionId}`,
    userId,
    { ex: SECURITY_CONSTANTS.SESSION_DURATION }
  );
  return sessionId;
}

export async function invalidateSession(sessionId: string) {
  await redis.del(`session:${sessionId}`);
}