"use server"

import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export interface GuestSession {
  session_id: string
  created_at: string
  last_active: string
}

// Get or create guest session
export async function getGuestSession(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get("guest_session_id")?.value

  if (!sessionId) {
    sessionId = uuidv4()
    cookieStore.set("guest_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }

  // Update last active (in a real app, you'd update the database)
  cookieStore.set("last_active", new Date().toISOString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  })

  return sessionId
}
