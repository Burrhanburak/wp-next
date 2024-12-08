import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export interface AdminCreateInput {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export async function addAdmin(data: AdminCreateInput) {
  const hashedPassword = await hash(data.password, 12);

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });
}

export async function fetchAdmins(options?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { page = 1, limit = 10, search = "" } = options || {};
  const skip = (page - 1) * limit;

  const where = {
    role: UserRole.ADMIN,
    OR: search
      ? [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ]
      : undefined,
  };

  const [admins, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        adminSessions: {
          where: {
            revoked: false,
            expiresAt: { gt: new Date() },
          },
          select: {
            id: true,
            deviceInfo: true,
            createdAt: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    admins,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}