import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { TOTP_WINDOW, BACKUP_CODES_COUNT, TOTP_ISSUER } from './constants';

export interface TOTPSecretResult {
  secret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
}

export async function generateTOTPSecret(email: string): Promise<TOTPSecretResult> {
  const secret = speakeasy.generateSecret({
    name: `${TOTP_ISSUER} (${email})`,
    length: 20
  });
  
  if (!secret.otpauth_url) {
    throw new Error('Failed to generate TOTP secret');
  }

  try {
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    return {
      secret: secret.base32,
      qrCodeUrl,
      otpauthUrl: secret.otpauth_url
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function verifyTOTP(secret: string, token: string): boolean {
  if (!secret || !token) {
    console.error('Missing secret or token');
    return false;
  }

  try {
    // Clean the token
    const cleanToken = token.replace(/\s+/g, '');
    
    console.log('Verifying TOTP:', {
      secretLength: secret.length,
      tokenLength: cleanToken.length,
      token: cleanToken,
    });

    // Generate valid tokens for the current time window
    const currentTime = Math.floor(Date.now() / 1000);
    const timeWindow = TOTP_WINDOW;
    
    // Log all valid tokens in the time window
    for (let i = -timeWindow; i <= timeWindow; i++) {
      const token = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        time: currentTime + (i * 30) // 30 seconds per step
      });
      console.log(`Valid token for time offset ${i * 30} seconds:`, token);
    }

    const verified = speakeasy.totp.verify({
      secret: secret,
      token: cleanToken,
      window: TOTP_WINDOW,
      encoding: 'base32'
    });
    
    console.log('TOTP verification result:', {
      providedToken: cleanToken,
      verified,
      currentTime,
      window: TOTP_WINDOW
    });
    
    return verified;
  } catch (error) {
    console.error('TOTP verification error:', error);
    return false;
  }
}

export function verifyBackupCode(storedCodes: string[], providedCode: string): boolean {
  if (!storedCodes || !providedCode) {
    console.error('Missing stored codes or provided code');
    return false;
  }

  const normalizedProvidedCode = providedCode.toUpperCase().replace(/\s/g, '');
  
  console.log('Verifying backup code:', {
    normalizedProvidedCode,
    storedCodesCount: storedCodes.length,
    storedCodes: storedCodes.map(code => code.slice(0, 4) + '****') // Log partial codes for security
  });

  const isValid = storedCodes.includes(normalizedProvidedCode);
  console.log('Backup code verification result:', { isValid });
  
  return isValid;
}

export function generateBackupCodes(count: number = BACKUP_CODES_COUNT): string[] {
  return Array.from({ length: count }, () => 
    speakeasy.generateSecret({ length: 10 }).base32.slice(0, 16)
  );
}

export function generateTOTPUri(secret: string, accountName: string): string {
  if (!secret || !accountName) {
    throw new Error('Secret and account name are required');
  }
  return speakeasy.otpauthURL({
    secret: secret,
    label: accountName,
    issuer: TOTP_ISSUER,
    encoding: 'base32'
  });
}
