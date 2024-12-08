export interface AuthResult {
  error?: string;
  success?: boolean;
  redirectTo?: string;
  requiresTwoFactor?: boolean;
  requiresSmsVerification?: boolean;
  message?: string;
  adminId?: string;
}

export interface AdminSession {
  adminId: string;
  token: string;
  expiresAt: Date;
  callbackUrl?: string;
}