"use server"

import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

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
export async function updateLastActive(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.set("last_active", new Date().toISOString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    })
  } catch (error) {
    // During build time, do nothing
    console.warn("Cannot update last active during build time:", error)
  }
}

// Get or create guest session (only for Server Actions)
export async function getOrCreateGuestSession(): Promise<string> {
  try {
    const existingSessionId = await getGuestSessionId()

    if (existingSessionId) {
      // Update last active for existing session
      await updateLastActive()
      return existingSessionId
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