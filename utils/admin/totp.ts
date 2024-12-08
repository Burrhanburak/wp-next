import { createHmac } from "crypto";

export function generateTOTP(secret: string, window: number = 30): string {
  const counter = Math.floor(Date.now() / 1000 / window);
  return generateHOTP(secret, counter);
}

export function verifyTOTP(token: string, secret: string, window: number = 30): boolean {
  const counter = Math.floor(Date.now() / 1000 / window);
  
  // Check current and previous window to account for slight time differences
  for (let i = -1; i <= 1; i++) {
    if (generateHOTP(secret, counter + i) === token) {
      return true;
    }
  }
  
  return false;
}

function generateHOTP(secret: string, counter: number): string {
  const hmac = createHmac("sha1", secret);
  const counterBytes = Buffer.alloc(8);
  counterBytes.writeBigInt64BE(BigInt(counter));
  hmac.update(counterBytes);
  
  const hmacResult = hmac.digest();
  const offset = hmacResult[hmacResult.length - 1] & 0xf;
  
  const code = ((hmacResult[offset] & 0x7f) << 24) |
               ((hmacResult[offset + 1] & 0xff) << 16) |
               ((hmacResult[offset + 2] & 0xff) << 8) |
               (hmacResult[offset + 3] & 0xff);
               
  return (code % 1000000).toString().padStart(6, "0");
}