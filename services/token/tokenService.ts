import { v4 as uuidv4 } from "uuid";
import { RandomGenerator } from '@/utils/crypto/randomGenerator';
import { Token } from '@/services/token/tokenTypes';

export class TokenService {
  static generateVerificationCode(): string {
    const token = RandomGenerator.generateNumber(100000, 999999).toString();
    console.log("Generated verification token:", token);
    return token;
  }

  static generateResetToken(): string {
    return uuidv4();
  }

  static generateSecureToken(length: number = 32): Token {
    return {
      token: RandomGenerator.generateBytes(length),
      expires: this.generateExpiresTimestamp()
    };
  }

  static generateExpiresTimestamp(minutes: number = 10): Date {
    return new Date(Date.now() + minutes * 60 * 1000); // Varsayılan 10 dakika
  }

  static validateVerificationCode(token: string): boolean {
    return /^\d{6}$/.test(token);
  }
}


export const generateVerificationToken = TokenService.generateVerificationCode;

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


export const generateVerificationCode = TokenService.generateVerificationCode;