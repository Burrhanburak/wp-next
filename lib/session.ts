// import { cookies } from 'next/headers';
// import { adminAuth } from './firebase-admin';
// import { prisma } from './db';
// import type { DecodedIdToken } from 'firebase-admin/auth';

// // Types for better type safety
// type SessionUser = {
//   uid: string;
//   email: string;
//   role: string;
//   admin: any; // Replace 'any' with your Admin type from Prisma
// }

// type SessionResult = {
//   success: boolean;
//   data?: SessionUser;
//   error?: string;
// }

// // Constants
// const SESSION_COOKIE_NAME = 'admin-session';
// const SESSION_EXPIRY_MS = 60 * 60 * 24 * 5 * 1000; // 5 days
// const FIREBASE_CUSTOM_CLAIMS = {
//   admin: true,
// };

// export async function getSession(): Promise<SessionResult> {
//   try {
//     const cookieStore = await cookies();
//     const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

//     if (!sessionCookie?.value) {
//       return { 
//         success: false, 
//         error: 'No session cookie found' 
//       };
//     }

//     // Verify the session cookie
//     let decodedClaims: DecodedIdToken;
//     try {
//       decodedClaims = await adminAuth.verifySessionCookie(
//         sessionCookie.value,
//         true
//       );
//     } catch (error) {
//       console.error('Session verification failed:', error);
//       return { 
//         success: false, 
//         error: 'Invalid session' 
//       };
//     }

//     if (!decodedClaims.email) {
//       return { 
//         success: false, 
//         error: 'No email in session claims' 
//       };
//     }

//     // Get admin from database
//     const admin = await prisma.admin.findUnique({
//       where: { email: decodedClaims.email }
//     });

//     if (!admin) {
//       console.warn('No admin found for email:', decodedClaims.email);
//       return { 
//         success: false, 
//         error: 'Admin not found' 
//       };
//     }

//     return {
//       success: true,
//       data: {
//         uid: decodedClaims.uid,
//         email: decodedClaims.email,
//         role: decodedClaims.role || 'user',
//         admin
//       }
//     };
//   } catch (error) {
//     console.error('Session retrieval error:', error);
//     return { 
//       success: false, 
//       error: 'Internal server error' 
//     };
//   }
// }

// export async function createSessionCookie(firebaseUid: string, email: string): Promise<string> {
//   try {
//     // 1. Verify user exists
//     const userRecord = await adminAuth.getUser(firebaseUid);
//     console.log('Found user record:', userRecord.uid);

//     // 2. Create custom token with claims
//     const customToken = await adminAuth.createCustomToken(firebaseUid, {
//       ...FIREBASE_CUSTOM_CLAIMS,
//       email
//     });

//     // 3. Exchange custom token for ID token
//     const idTokenResult = await exchangeCustomToken(customToken);

//     if (!idTokenResult.idToken) {
//       throw new Error('Failed to get ID token');
//     }

//     // 4. Create session cookie
//     const sessionCookie = await adminAuth.createSessionCookie(idTokenResult.idToken, {
//       expiresIn: SESSION_EXPIRY_MS
//     });

//     if (!sessionCookie) {
//       throw new Error('Session cookie creation failed');
//     }

//     // 5. Verify the created cookie
//     await adminAuth.verifySessionCookie(sessionCookie);
//     return sessionCookie;

//   } catch (error) {
//     console.error('Session creation failed:', error);
//     throw new Error('Failed to create session');
//   }
// }

// async function exchangeCustomToken(customToken: string) {
//   const response = await fetch(
//     `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         token: customToken,
//         returnSecureToken: true,
//       }),
//     }
//   );

//   if (!response.ok) {
//     throw new Error('Failed to exchange custom token');
//   }

//   return response.json();
// }

// export async function verifySession(): Promise<{ uid: string; email: string } | null> {
//   try {
//     const cookieStore = await cookies();
//     const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

//     if (!sessionCookie?.value) {
//       return null;
//     }

//     const decodedClaims = await adminAuth.verifySessionCookie(
//       sessionCookie.value,
//       true
//     );

//     return {
//       uid: decodedClaims.uid,
//       email: decodedClaims.email || ''
//     };
//   } catch (error) {
//     console.error('Session verification failed:', error);
//     return null;
//   }
// }

// export async function clearSession() {
//   const cookieStore = await cookies();
//   cookieStore.delete(SESSION_COOKIE_NAME);
// }

// export async function revokeAllSessions(uid: string): Promise<boolean> {
//   try {
//     await adminAuth.revokeRefreshTokens(uid);
//     console.log('Revoked all sessions for user:', uid);
//     return true;
//   } catch (error) {
//     console.error('Failed to revoke sessions:', error);
//     return false;
//   }
// }

// // Export constants for use in other files
// export const constants = {
//   SESSION_COOKIE_NAME,
//   SESSION_EXPIRY_MS,
//   FIREBASE_CUSTOM_CLAIMS,
// };

import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";
import { SESSION_COOKIE_NAME } from "./constants";
import type { DecodedIdToken } from "firebase-admin/auth";

interface SessionResult {
  success: boolean;
  error?: string;
  user?: {
    email?: string;
    uid?: string;
  };
}

export async function getSession(): Promise<SessionResult> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return { success: false, error: "No session cookie found" };
    }

    try {
      const decodedClaims = await adminAuth.verifySessionCookie(
        sessionCookie.value,
        true // Check if cookie is revoked
      );

      if (!decodedClaims.uid || !decodedClaims.email) {
        throw new Error("Missing required session data");
      }

      return {
        success: true,
        user: {
          email: decodedClaims.email,
          uid: decodedClaims.uid
        }
      };

    } catch (error: any) {
      console.error("Session verification failed:", error);
      return { success: false, error: "Invalid session" };
    }
  } catch (error: any) {
    console.error("Session retrieval error:", error);
    return { success: false, error: "Session error" };
  }
}

export async function createSessionCookie(uid: string, email: string): Promise<string> {
  try {
    // Generate custom token
    const customToken = await adminAuth.createCustomToken(uid, {
      email,
      role: 'admin'
    });

    // Exchange custom token for ID token
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(customToken, {
      expiresIn
    });

    return sessionCookie;

  } catch (error) {
    console.error("Error creating session cookie:", error);
    throw new Error("Failed to create session");
  }
}

export async function verifySession(): Promise<boolean> {
  const session = await getSession();
  return session.success;
}