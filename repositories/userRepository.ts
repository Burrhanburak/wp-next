import { prisma } from "@/lib/db";

export class UserRepository {
  async findByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }

  async findByEmailAndToken(email: string, token: string) {
    return await prisma.user.findFirst({
      where: {
        email,
        emailVerificationToken: token,
        emailVerificationTokenExpiry: {
          gt: new Date()
        }
      }
    });
  }

  async updateVerificationStatus(userId: string, verified: boolean) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: verified,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null
      }
    });
  }

  async updateVerificationToken(userId: string, token: string, expiry: Date) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: token,
        emailVerificationTokenExpiry: expiry
      }
    });
  }
}