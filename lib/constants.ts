// Cookie names
export const SESSION_COOKIE_NAME = 'admin-session';
export const TEMP_EMAIL_COOKIE_NAME = 'temp_email';

// Session configuration
// Session expiry (5 days in milliseconds)
export const SESSION_EXPIRY_MS = 60 * 60 * 24 * 5 * 1000;

// TOTP configuration
export const TOTP_WINDOW = 2; // Allow 2 time steps before/after for clock drift
export const BACKUP_CODES_COUNT = 10;
export const TOTP_ISSUER = 'WhatsApp Admin';

// Firebase configuration
export const FIREBASE_CUSTOM_CLAIMS = {
  admin: true,
};
