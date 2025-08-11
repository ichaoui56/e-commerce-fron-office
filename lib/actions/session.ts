"use server"

import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get existing guest session (read-only) - Safe for build time
export async function getGuestSessionId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get("guest_session_id")?.value || null
  } catch (error) {
    // During build time or when cookies aren't available, return null
    // This prevents the dynamic server usage error
    return null
  }
}

// Create a new guest session (only for Server Actions)
export async function createGuestSession(): Promise<string> {
  try {
    const cookieStore = await cookies()
    const sessionId = uuidv4()

    // Create guest user in database first
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    
    await prisma.guestUser.create({
      data: {
        session_id: sessionId,
        created_at: new Date(),
        expires_at: expiresAt,
      }
    })

    // Then set cookies
    cookieStore.set("guest_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    // Update last active
    cookieStore.set("last_active", new Date().toISOString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    })

    return sessionId
  } catch (error) {
    // During build time, return a temporary session ID
    console.warn("Cannot create session during build time:", error)
    return uuidv4()
  }
}

// Update last active timestamp (only for Server Actions)
export async function updateLastActive(sessionId?: string): Promise<void> {
  try {
    const cookieStore = await cookies()
    const currentTime = new Date()
    
    // Update cookie
    cookieStore.set("last_active", currentTime.toISOString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    })

    // Update database if session ID provided
    if (sessionId) {
      try {
        // Note: Your schema doesn't have last_active, so we'll skip database update
        // If you want to track last activity, add a last_active field to GuestUser
        console.log("Last active updated for session:", sessionId)
      } catch (dbError) {
        console.warn("Failed to update last_active in database:", dbError)
      }
    }
  } catch (error) {
    // During build time, do nothing
    console.warn("Cannot update last active during build time:", error)
  }
}

// Ensure guest user exists in both cookie and database
export async function ensureGuestUserInDatabase(sessionId: string): Promise<boolean> {
  try {
    const existingGuestUser = await prisma.guestUser.findUnique({
      where: { session_id: sessionId }
    })

    if (!existingGuestUser) {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      
      await prisma.guestUser.create({
        data: {
          session_id: sessionId,
          created_at: new Date(),
          expires_at: expiresAt,
        }
      })
      return true
    } else {
      // Guest user exists, no need to update since there's no last_active field
      return true
    }
  } catch (error) {
    console.error("Error ensuring guest user in database:", error)
    return false
  }
}

// Get or create guest session (only for Server Actions)
export async function getOrCreateGuestSession(): Promise<string> {
  try {
    const existingSessionId = await getGuestSessionId()

    if (existingSessionId) {
      // Ensure the guest user exists in the database
      const guestUserExists = await ensureGuestUserInDatabase(existingSessionId)
      
      if (guestUserExists) {
        return existingSessionId
      } else {
        // If database operation failed, create a new session
        return await createGuestSession()
      }
    }

    // Create new session
    return await createGuestSession()
  } catch (error) {
    // Fallback for build time
    console.warn("Cannot get or create session during build time:", error)
    return uuidv4()
  }
}

// Safe wrapper for functions that need session but should work during build
export async function getSafeGuestSessionId(): Promise<string | null> {
  // Check if we're in a build context
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !process.env.PORT) {
    return null
  }
  
  return await getGuestSessionId()
}

// Get or create session for read-only operations (components, pages)
export async function getOrCreateGuestSessionReadOnly(): Promise<string | null> {
  try {
    const existingSessionId = await getGuestSessionId()
    
    if (existingSessionId) {
      // For read operations, just verify the guest user exists in DB
      // but don't create it if it doesn't exist
      try {
        const guestUserExists = await prisma.guestUser.findUnique({
          where: { session_id: existingSessionId }
        })
        
        if (guestUserExists) {
          return existingSessionId
        } else {
          // Session cookie exists but not in DB - return null
          // This will be handled by the calling function
          return null
        }
      } catch (dbError) {
        console.warn("Database check failed in read-only mode:", dbError)
        return existingSessionId // Return the session ID anyway
      }
    }
    
    return null
  } catch (error) {
    console.warn("Cannot get session during build time:", error)
    return null
  }
}

// Clean up expired guest users (can be called periodically)
export async function cleanupExpiredGuestUsers(): Promise<void> {
  try {
    const now = new Date()
    
    // Delete expired guest users and their associated cart items (cascade delete handles this)
    await prisma.guestUser.deleteMany({
      where: {
        expires_at: {
          lt: now
        }
      }
    })
  } catch (error) {
    console.error("Failed to cleanup expired guest users:", error)
  }
}