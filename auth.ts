import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";
import { getUserById } from "@/data/user";

// Define custom user type
type UserRole = "ADMIN" | "USER";

interface UserType {
  id: string;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  role: UserRole;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  permissions?: string[];
}

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user: UserType & {
      isOAuth: boolean;
    };
  }
  
  interface User extends UserType {}
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    isOAuth: boolean;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    permissions?: string[];
  }
}

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true }
      });
    }
  },
  callbacks: {
    async signIn({ user, account, credentials }) {
      // Always allow OAuth
      if (account?.provider !== "credentials") {
        return true;
      }

      if (!user?.id) {
        return false;
      }

      // Check if this is an admin login attempt
      if (credentials?.role === "ADMIN") {
        const admin = await prisma.user.findUnique({
          where: { 
            id: user.id,
            role: "ADMIN"
          }
        });

        // Allow only if user exists and is an admin
        return !!admin;
      }

      const existingUser = await getUserById(user.id);

      // Allow sign in if:
      // 1. User is in verification process (has token)
      // 2. User is already verified
      if (existingUser?.emailVerificationToken || existingUser?.emailVerified) {
        return true;
      }

      return false;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.isSuperAdmin = token.isSuperAdmin as boolean;
        session.user.permissions = token.permissions as string[];
      }

      return session;
    },
    async jwt({ token, user, account, trigger }) {
      if (account) {
        token.isOAuth = true;
      }

      if (user) {
        token.role = user.role;
        token.isAdmin = user.role === "ADMIN";
        token.isSuperAdmin = user.isSuperAdmin;
        token.permissions = user.permissions;
      }

      // Force session update on admin verification
      if (trigger === "update" && token.role === "ADMIN") {
        const admin = await prisma.user.findUnique({
          where: { 
            id: token.sub!,
            role: "ADMIN"
          }
        });

        if (admin) {
          token.isAdmin = true;
          token.isSuperAdmin = admin.isSuperAdmin;
          token.permissions = admin.permissions;
        }
      }

      return token;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const isAdminLogin = credentials.role === "ADMIN";

        // Check User table with appropriate role
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
            role: isAdminLogin ? "ADMIN" : "USER"
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValidPassword = await compare(credentials.password, user.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.role === "ADMIN",
          isSuperAdmin: user.isSuperAdmin,
          permissions: user.permissions
        };
      }
    })
  ],
} satisfies NextAuthConfig;

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authConfig);

export async function getSession() {
  return await auth();
}