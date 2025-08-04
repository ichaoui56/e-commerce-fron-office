"use server"

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { getGuestSession } from "./session"
import { getProductsWithDetails, getAllColors, getAllSizes } from "./products"
import { v4 as uuidv4 } from "uuid"
import type { CartItem, CartItemWithDetails, ProductVariant, ProductImage } from "@/lib/types"

// Helper to read/write cart file
function getCartFilePath() {
  return join(process.cwd(), "data", "cart.json")
}

function readCart(): CartItem[] {
  try {
    const content = readFileSync(getCartFilePath(), "utf-8")
    return JSON.parse(content)
  } catch {
    return []
  }
}

function writeCart(cartItems: CartItem[]) {
  writeFileSync(getCartFilePath(), JSON.stringify(cartItems, null, 2))
}

function readJsonFile<T>(filename: string): T[] {
  try {
    const filePath = join(process.cwd(), "data", filename)
    const content = readFileSync(filePath, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    return []
  }
}

// Add item to cart
export async function addToCart(
  productId: string,
  colorId: string,
  sizeId: string,
  quantity = 1,
): Promise<{ success: boolean; message: string }> {
  try {
    const sessionId = await getGuestSession()
    const cartItems = readCart()

    // Find the variant
    const variants = readJsonFile<ProductVariant>("product-variants.json")
    const variant = variants.find((v) => v.product_id === productId && v.color_id === colorId && v.size_id === sizeId)

    if (!variant) {
      return { success: false, message: "Product variant not found" }
    }

    if (variant.stock_quantity < quantity) {
      return { success: false, message: "Not enough stock available" }
    }

    // Check if item already exists in cart
    const existingItem = cartItems.find(
      (item) => item.guest_session_id === sessionId && item.product_variant_id === variant.id,
    )

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      if (variant.stock_quantity < newQuantity) {
        return { success: false, message: "Not enough stock available" }
      }
      existingItem.quantity = newQuantity
    } else {
      // Add new item
      const newItem: CartItem = {
        id: uuidv4(),
        guest_session_id: sessionId,
        product_variant_id: variant.id,
        quantity,
        added_at: new Date().toISOString(),
      }
      cartItems.push(newItem)
    }

    writeCart(cartItems)
    return { success: true, message: "Added to cart successfully!" }
  } catch (error) {
    return { success: false, message: "Failed to add to cart" }
  }
}

// Update cart item quantity
export async function updateCartQuantity(
  itemId: string,
  quantity: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const sessionId = await getGuestSession()
    const cartItems = readCart()

    const item = cartItems.find((item) => item.id === itemId && item.guest_session_id === sessionId)

    if (!item) {
      return { success: false, message: "Item not found in cart" }
    }

    if (quantity <= 0) {
      // Remove item
      const filteredItems = cartItems.filter((cartItem) => cartItem.id !== itemId)
      writeCart(filteredItems)
      return { success: true, message: "Item removed from cart" }
    } else {
      // Check stock
      const variants = readJsonFile<ProductVariant>("product-variants.json")
      const variant = variants.find((v) => v.id === item.product_variant_id)

      if (variant && variant.stock_quantity < quantity) {
        return { success: false, message: "Not enough stock available" }
      }

      // Update quantity
      item.quantity = quantity
      writeCart(cartItems)
      return { success: true, message: "Cart updated successfully!" }
    }
  } catch (error) {
    return { success: false, message: "Failed to update cart" }
  }
}

// Remove item from cart
export async function removeFromCart(itemId: string): Promise<{ success: boolean; message: string }> {
  try {
    const sessionId = await getGuestSession()
    const cartItems = readCart()

    const filteredItems = cartItems.filter((item) => !(item.id === itemId && item.guest_session_id === sessionId))

    if (filteredItems.length === cartItems.length) {
      return { success: false, message: "Item not found in cart" }
    }

    writeCart(filteredItems)
    return { success: true, message: "Item removed from cart successfully!" }
  } catch (error) {
    return { success: false, message: "Failed to remove from cart" }
  }
}

// Get user's cart with details
export async function getCartWithDetails(): Promise<CartItemWithDetails[]> {
  try {
    const sessionId = await getGuestSession()
    const cartItems = readCart()
    const allProducts = await getProductsWithDetails()
    const colors = await getAllColors()
    const sizes = await getAllSizes()
    const variants = readJsonFile<ProductVariant>("product-variants.json")
    const images = readJsonFile<ProductImage>("product-images.json")

    const userCartItems = cartItems.filter((item) => item.guest_session_id === sessionId)

    return userCartItems.map((cartItem) => {
      const variant = variants.find((v) => v.id === cartItem.product_variant_id)!
      const product = allProducts.find((p) => p.id === variant.product_id)!
      const color = colors.find((c) => c.id === variant.color_id)!
      const size = sizes.find((s) => s.id === variant.size_id)!
      const image = images.find(
        (img) => img.product_id === variant.product_id && img.color_id === variant.color_id && img.is_primary,
      )!

      return {
        ...cartItem,
        product,
        variant,
        color,
        size,
        image,
      }
    })
  } catch {
    return []
  }
}

// Get user's cart
export async function getCart(): Promise<CartItem[]> {
  try {
    const sessionId = await getGuestSession()
    const cartItems = readCart()

    return cartItems.filter((item) => item.guest_session_id === sessionId)
  } catch {
    return []
  }
}

// Get cart count
export async function getCartCount(): Promise<number> {
  const cart = await getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

// Get cart total price
export async function getCartTotal(): Promise<number> {
  const cartWithDetails = await getCartWithDetails()
  return cartWithDetails.reduce((total, item) => {
    return total + item.product.current_price * item.quantity
  }, 0)
}

// Clear cart
export async function clearCart(): Promise<{ success: boolean; message: string }> {
  try {
    const sessionId = await getGuestSession()
    const cartItems = readCart()

    const filteredItems = cartItems.filter((item) => item.guest_session_id !== sessionId)
    writeCart(filteredItems)

    return { success: true, message: "Cart cleared successfully!" }
  } catch (error) {
    return { success: false, message: "Failed to clear cart" }
  }
}
