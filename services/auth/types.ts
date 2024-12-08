export type UserRole = "ADMIN" | "USER";

declare module "next-auth" {
  interface User {
    role: UserRole;
    emailVerified: boolean | null;
  }

  interface Session {
    user: User & {
      role: UserRole;
      emailVerified: boolean | null;
    }
  }
}