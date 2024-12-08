import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Check required environment variables
// checkRequiredEnvVars();

// Validate Firebase config
const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
];

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check for missing required config
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
if (missingKeys.length > 0) {
  throw new Error(`Missing required Firebase config keys: ${missingKeys.join(', ')}`);
}

// Log Firebase configuration (without sensitive data)
console.log('Firebase Client Configuration:', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  storageBucket: firebaseConfig.storageBucket,
  hasApiKey: !!firebaseConfig.apiKey
});

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

if (app) {
  console.log('Firebase client initialized successfully');
} else {
  console.error('Error initializing Firebase client');
}

export { app, auth };
