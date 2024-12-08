import bcrypt from "bcryptjs";
import { generateRandomString, generateExpiresTimestamp } from "@/lib/crypto";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const generateTwoFactorToken = () => {
  return {
    token: generateRandomString(6),
    expires: generateExpiresTimestamp(1) // Expires in 1 hour
  };
};

export const generatePasswordResetToken = () => {
  return {
    token: generateRandomString(),
    expires: generateExpiresTimestamp(1) // Expires in 1 hour
  };
};

export const generateVerificationToken = () => {
  return {
    token: generateRandomString(),
    expires: generateExpiresTimestamp(24) // Expires in 24 hours
  };
};
