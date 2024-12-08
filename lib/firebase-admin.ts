import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Ensure private key is properly formatted
const formatPrivateKey = (key: string) => {
  if (!key || !key.includes('PRIVATE KEY')) {
    throw new Error('Invalid private key format');
  }
  // Remove any extra quotes and properly format newlines
  return key.replace(/\\n/g, '\n').replace(/"/g, '');
};

// Environment configuration with validation
const getConfig = () => {
  // Required configuration values
  const config = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  };

  // Validate all required fields
  Object.entries(config).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing required Firebase configuration: ${key}`);
    }
  });

  return {
    ...config,
    privateKey: formatPrivateKey(config.privateKey),
  };
};

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  try {
    const config = getConfig();
    
    if (getApps().length === 0) {
      return initializeApp({
        credential: cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey,
        }),
        projectId: config.projectId,
      });
    }
    
    return getApps()[0];
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin');
  }
}

// Initialize the admin app
const firebaseAdmin = initializeFirebaseAdmin();
export const adminAuth = getAuth(firebaseAdmin);

// Helper function to verify session cookies
export async function verifySessionCookie(sessionCookie: string) {
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      valid: true,
      uid: decodedClaims.uid,
      email: decodedClaims.email,
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return { valid: false, error };
  }
}

// Helper function to create custom tokens
export async function createCustomToken(uid: string) {
  try {
    const token = await adminAuth.createCustomToken(uid);
    return { success: true, token };
  } catch (error) {
    console.error('Custom token creation failed:', error);
    return { success: false, error };
  }
}

export default firebaseAdmin;
