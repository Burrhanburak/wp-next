import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY = process.env.ADMIN_ENCRYPTION_KEY || randomBytes(32);

if (!process.env.ADMIN_ENCRYPTION_KEY) {
  console.warn("ADMIN_ENCRYPTION_KEY not set, using random key - sessions will be invalidated on restart");
}

export function encrypt(text: string): string {
  const { encrypted, iv, tag } = encryptData(text);
  return `${encrypted}:${iv}:${tag}`;
}

export function decrypt(encryptedData: string): string {
  const [encrypted, iv, tag] = encryptedData.split(":");
  return decryptData(encrypted, iv, tag);
}

export function encryptData(data: string): { encrypted: string; iv: string; tag: string } {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  return {
    encrypted,
    iv: iv.toString("hex"),
    tag: (cipher as any).getAuthTag().toString("hex")
  };
}

export function decryptData(encrypted: string, iv: string, tag: string): string {
  try {
    const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "hex"));
    (decipher as any).setAuthTag(Buffer.from(tag, "hex"));
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Invalid or tampered data");
  }
}

export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

export function hashData(data: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createCipheriv(ALGORITHM, KEY, Buffer.from(salt, "hex"))
    .update(data, "utf8", "hex");
  return `${salt}:${hash}`;
}

export function verifyHash(data: string, hashedData: string): boolean {
  try {
    const [salt, hash] = hashedData.split(":");
    const newHash = createCipheriv(ALGORITHM, KEY, Buffer.from(salt, "hex"))
      .update(data, "utf8", "hex");
    return hash === newHash;
  } catch (error) {
    return false;
  }
}