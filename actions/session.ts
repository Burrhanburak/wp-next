"use server"

import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase-admin"
import { prisma } from "@/lib/db"
import { DecodedIdToken } from "firebase-admin/auth"

// Define return type for better type safety
type SessionCheckResult = {
  isValid: boolean
  email?: string
  role?: string
  adminId?: string
  error?: string
}

export async function checkSession(): Promise<SessionCheckResult> {
  try {
    const cookiesList = cookies()
    const adminSession = cookiesList.get("admin-session")
    
    // Log session check attempt
    console.log({
      type: "SESSION_CHECK_ATTEMPT",
      hasSession: !!adminSession?.value,
      timestamp: new Date().toISOString()
    })

    if (!adminSession?.value) {
      console.log("Check Session - No session cookie found")
      return { 
        isValid: false,
        error: "No session cookie found"
      }
    }

    let decodedClaims: DecodedIdToken
    try {
      // Verify the session cookie with Firebase
      decodedClaims = await adminAuth.verifySessionCookie(
        adminSession.value,
        true // Check if cookie is revoked
      )
    } catch (error) {
      console.error("Firebase session verification failed:", {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      })
      return { 
        isValid: false,
        error: "Invalid session token"
      }
    }

    if (!decodedClaims.uid) {
      console.error("Missing UID in decoded claims")
      return { 
        isValid: false,
        error: "Invalid session data"
      }
    }

    // Get the admin from database
    const admin = await prisma.admin.findUnique({
      where: { firebaseUid: decodedClaims.uid },
      select: {
        id: true,
        email: true,
        role: true,
        active: true
      }
    })

    if (!admin) {
      console.error("No admin found for Firebase UID:", {
        uid: decodedClaims.uid,
        timestamp: new Date().toISOString()
      })
      return { 
        isValid: false,
        error: "Admin not found"
      }
    }

    // Check if admin is active
    if (!admin.active) {
      console.log("Admin account is inactive:", admin.email)
      return { 
        isValid: false,
        error: "Admin account is inactive"
      }
    }

    // Log successful session verification
    console.log({
      type: "SESSION_VERIFIED",
      email: admin.email,
      role: admin.role,
      timestamp: new Date().toISOString()
    })

    return {
      isValid: true,
      email: admin.email,
      role: admin.role,
      adminId: admin.id
    }
    
  } catch (error) {
    // Log any unexpected errors
    console.error("Unexpected error in checkSession:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })

    return { 
      isValid: false,
      error: "Internal server error"
    }
  }
}