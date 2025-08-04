"use server"

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { getGuestSession } from "./session"
import { getProductsWithDetails } from "./products"
import { v4 as uuidv4 } from "uuid"
import type { Like, ProductWithDetails } from "@/lib/types"

// Helper to read/write likes file
function getLikesFilePath() {
  return join(process.cwd(), "data", "likes.json")
}

function readLikes(): Like[] {
  try {
    const content = readFileSync(getLikesFilePath(), "utf-8")
    return JSON.parse(content)
  } catch {
    return []
  }
}

function writeLikes(likes: Like[]) {
  writeFileSync(getLikesFilePath(), JSON.stringify(likes, null, 2))
}

// Add product to wishlist
export async function addToWishlist(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    const sessionId = await getGuestSession()
    const likes = readLikes()

    // Check if already liked
    const existingLike = likes.find((like) => like.guest_session_id === sessionId && like.product_id === productId)

    if (existingLike) {
      return { success: false, message: "Product already in wishlist" }
    }

    // Add new like
    const newLike: Like = {
      id: uuidv4(),
      guest_session_id: sessionId,
      product_id: productId,
      liked_at: new Date().toISOString(),
    }

    likes.push(newLike)
    writeLikes(likes)

    return { success: true, message: "Added to wishlist successfully!" }
  } catch (error) {
    return { success: false, message: "Failed to add to wishlist" }
  }
}

// Remove product from wishlist
export async function removeFromWishlist(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    const sessionId = await getGuestSession()
    const likes = readLikes()

    const filteredLikes = likes.filter(
      (like) => !(like.guest_session_id === sessionId && like.product_id === productId),
    )

    if (filteredLikes.length === likes.length) {
      return { success: false, message: "Product not in wishlist" }
    }

    writeLikes(filteredLikes)
    return { success: true, message: "Removed from wishlist successfully!" }
  } catch (error) {
    return { success: false, message: "Failed to remove from wishlist" }
  }
}

// Get user's wishlist with product details
export async function getWishlistWithDetails(): Promise<ProductWithDetails[]> {
  try {
    const sessionId = await getGuestSession()
    const likes = readLikes()
    const allProducts = await getProductsWithDetails()

    const userLikes = likes.filter((like) => like.guest_session_id === sessionId)
    const likedProductIds = userLikes.map((like) => like.product_id)

    return allProducts.filter((product) => likedProductIds.includes(product.id))
  } catch {
    return []
  }
}

// Get user's wishlist product IDs
export async function getWishlist(): Promise<string[]> {
  try {
    const sessionId = await getGuestSession()
    const likes = readLikes()

    return likes.filter((like) => like.guest_session_id === sessionId).map((like) => like.product_id)
  } catch {
    return []
  }
}

// Check if product is in wishlist
export async function isInWishlist(productId: string): Promise<boolean> {
  const wishlist = await getWishlist()
  return wishlist.includes(productId)
}

// Get wishlist count
export async function getWishlistCount(): Promise<number> {
  const wishlist = await getWishlist()
  return wishlist.length
}
