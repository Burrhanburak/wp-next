import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { LoginSchema } from "@/utils/validations";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        try {
          const validatedFields = LoginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user || !user.password || !user.emailVerified) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          );

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
}
