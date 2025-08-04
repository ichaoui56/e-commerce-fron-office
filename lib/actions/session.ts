"use server"

import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Get existing guest session (read-only)
export async function getGuestSessionId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("guest_session_id")?.value || null
}

// Create a new guest session (only for Server Actions)
export async function createGuestSession(): Promise<string> {
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
}

// Update last active timestamp (only for Server Actions)
export async function updateLastActive(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("last_active", new Date().toISOString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  })
}

// Get or create guest session (only for Server Actions)
export async function getOrCreateGuestSession(): Promise<string> {
  const existingSessionId = await getGuestSessionId()

  if (existingSessionId) {
    // Update last active for existing session
    await updateLastActive()
    return existingSessionId
  }

  // Create new session
  return await createGuestSession()
}
