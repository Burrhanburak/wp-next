import crypto from 'crypto';

export class RandomGenerator {
    static generateBytes(length: number = 32): string {
      const buffer = new Uint8Array(length);
      crypto.getRandomValues(buffer);
      return Array.from(buffer)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    }
  
    static generateNumber(min: number, max: number): number {
      return crypto.randomInt(min, max);
    }
  }