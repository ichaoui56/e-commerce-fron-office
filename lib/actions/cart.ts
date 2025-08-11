"use server"

import { PrismaClient } from "@prisma/client"
import { getOrCreateGuestSession, getOrCreateGuestSessionReadOnly } from "@/lib/actions/session"
import type { CartItemForCheckout, CartItemsResponse, CartItemWithDetails } from "@/lib/types"

const prisma = new PrismaClient()

// Helper function to ensure guest user exists in database
async function ensureGuestUserExists(sessionId: string) {
  try {
    // Check if guest user exists in database
    const existingGuestUser = await prisma.guestUser.findUnique({
      where: { session_id: sessionId }
    })

    if (!existingGuestUser) {
      // Create the guest user in database if it doesn't exist
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      
      await prisma.guestUser.create({
        data: {
          session_id: sessionId,
          created_at: new Date(),
          expires_at: expiresAt,
        }
      })
    }
  } catch (error) {
    console.error("Error ensuring guest user exists:", error)
    throw error
  }
}

// Add item to cart (WRITE operation - can create session)
export async function addToCart(productSizeStockId: string, quantity = 1) {
  try {
    const sessionId = await getOrCreateGuestSession()

    // Ensure the guest user exists in the database
    await ensureGuestUserExists(sessionId)

    // Check if product size stock exists and has enough stock
    const productSizeStock = await prisma.productSizeStock.findUnique({
      where: { id: productSizeStockId },
      include: {
        productColor: {
          include: {
            product: true,
            color: true,
          },
        },
        size: true,
      },
    })

    if (!productSizeStock) {
      return { success: false, message: "Product variant not found" }
    }

    if (productSizeStock.stock < quantity) {
      return { success: false, message: "Insufficient stock" }
    }

    // Check if item already exists in cart
    const existingItem = await prisma.panelItem.findUnique({
      where: {
        guest_session_id_product_size_stock_id: {
          guest_session_id: sessionId,
          product_size_stock_id: productSizeStockId,
        },
      },
    })

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      if (newQuantity > productSizeStock.stock) {
        return { success: false, message: "Not enough stock available" }
      }

      await prisma.panelItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      })

      return { success: true, message: "Cart updated successfully" }
    } else {
      // Create new cart item
      await prisma.panelItem.create({
        data: {
          guest_session_id: sessionId,
          product_size_stock_id: productSizeStockId,
          quantity,
        },
      })

      return { success: true, message: "Item added to cart" }
    }
  } catch (error) {
    console.error("Add to cart error:", error)
    return { success: false, message: "Failed to add item to cart" }
  }
}

// Get cart items (READ operation - use read-only session)
export async function getCartItems(): Promise<CartItemsResponse> {
  try {
    const sessionId = await getOrCreateGuestSessionReadOnly()

    // If no session exists, return empty cart
    if (!sessionId) {
      return { success: true, message: "No session found", items: [] }
    }

    const cartItems = await prisma.panelItem.findMany({
      where: { guest_session_id: sessionId },
      include: {
        productSizeStock: {
          include: {
            productColor: {
              include: {
                product: true,
                color: true,
              },
            },
            size: true,
          },
        },
      },
      orderBy: { added_at: "desc" },
    })

    const formattedItems: CartItemForCheckout[] = cartItems.map((item) => {
      const product = item.productSizeStock.productColor.product
      const color = item.productSizeStock.productColor.color
      const size = item.productSizeStock.size
      
      // Calculate current price considering discount
      const basePrice = Number(item.productSizeStock.price)
      const discountPercentage = product.solde_percentage || 0
      const currentPrice = discountPercentage > 0 ? basePrice * (1 - discountPercentage / 100) : basePrice

      return {
        id: item.id,
        product_size_stock_id: item.product_size_stock_id,
        quantity: item.quantity,
        price: currentPrice,
        subtotal: currentPrice * item.quantity,
        product: {
          id: product.id,
          name: product.name,
        },
        color: {
          id: color.id,
          name: color.name,
          hex: color.hex || "#000000",
        },
        size: {
          id: size.id,
          label: size.label,
        },
        image_url: item.productSizeStock.productColor.image_url || "/placeholder.svg",
      }
    })

    return {
      success: true,
      message: "Cart items retrieved successfully",
      items: formattedItems,
    }
  } catch (error) {
    console.error("Get cart items error:", error)
    return {
      success: false,
      message: "Failed to retrieve cart items",
      items: [],
    }
  }
}

// Get cart items with details (READ operation - use read-only session)
export async function getCartWithDetails(): Promise<CartItemWithDetails[]> {
  try {
    const sessionId = await getOrCreateGuestSessionReadOnly()

    // If no session exists, return empty cart
    if (!sessionId) {
      return []
    }

    const cartItems = await prisma.panelItem.findMany({
      where: { guest_session_id: sessionId },
      include: {
        productSizeStock: {
          include: {
            productColor: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
                color: true,
              },
            },
            size: true,
          },
        },
      },
      orderBy: { added_at: "desc" },
    })

    return cartItems.map((item) => {
      const product = item.productSizeStock.productColor.product
      const color = item.productSizeStock.productColor.color
      const size = item.productSizeStock.size

      // Calculate current price considering discount
      const basePrice = Number(item.productSizeStock.price)
      const discountPercentage = product.solde_percentage || 0
      const currentPrice = discountPercentage > 0 ? basePrice * (1 - discountPercentage / 100) : basePrice

      return {
        id: item.id,
        guest_session_id: item.guest_session_id,
        product_variant_id: item.productSizeStock.id,
        product_size_stock_id: item.product_size_stock_id,
        quantity: item.quantity,
        added_at: item.added_at.toISOString(),
        product: {
          id: product.id,
          name: product.name,
          description: product.description || "",
          category_id: product.category_id || "",
          current_price: currentPrice,
          base_price: basePrice,
          discount_percentage: discountPercentage,
          is_featured: product.top_price,
          created_at: product.created_at.toISOString(),
          ref_code: `${product.name.slice(0, 3).toUpperCase()}-${product.id.slice(-6)}`,
        },
        variant: {
          id: item.productSizeStock.id,
          product_id: product.id,
          color_id: color.id,
          size_id: size.id,
          stock_quantity: item.productSizeStock.stock,
          sku: `${product.name.slice(0, 3).toUpperCase()}-${color.name.slice(0, 2).toUpperCase()}-${size.label}`,
        },
        color: {
          id: color.id,
          name: color.name,
          hex_code: color.hex || "#000000",
        },
        size: {
          id: size.id,
          label: size.label,
          sort_order: 0,
        },
        image: {
          id: item.productSizeStock.productColor.id,
          product_id: product.id,
          color_id: color.id,
          image_url: item.productSizeStock.productColor.image_url || "/placeholder.svg",
          is_primary: true,
        },
      }
    })
  } catch (error) {
    console.error("Get cart with details error:", error)
    return []
  }
}

// Get cart count (READ operation - use read-only session)
export async function getCartCount(): Promise<number> {
  try {
    const sessionId = await getOrCreateGuestSessionReadOnly()

    // If no session exists, return 0
    if (!sessionId) {
      return 0
    }

    const result = await prisma.panelItem.aggregate({
      where: { guest_session_id: sessionId },
      _sum: { quantity: true },
    })

    return result._sum.quantity || 0
  } catch (error) {
    console.error("Get cart count error:", error)
    return 0
  }
}

// Update cart item quantity (WRITE operation - can create session)
export async function updateCartQuantity(itemId: string, newQuantity: number) {
  try {
    if (newQuantity <= 0) {
      return await removeFromCart(itemId)
    }

    const cartItem = await prisma.panelItem.findUnique({
      where: { id: itemId },
      include: {
        productSizeStock: true,
      },
    })

    if (!cartItem) {
      return { success: false, message: "Cart item not found" }
    }

    if (newQuantity > cartItem.productSizeStock.stock) {
      return { success: false, message: "Not enough stock available" }
    }

    // Ensure the guest user exists in the database before updating
    await ensureGuestUserExists(cartItem.guest_session_id)

    await prisma.panelItem.update({
      where: { id: itemId },
      data: { quantity: newQuantity },
    })

    return { success: true, message: "Cart updated successfully" }
  } catch (error) {
    console.error("Update cart quantity error:", error)
    return { success: false, message: "Failed to update cart" }
  }
}

// Remove item from cart (WRITE operation - no session creation needed)
export async function removeFromCart(itemId: string) {
  try {
    await prisma.panelItem.delete({
      where: { id: itemId },
    })

    return { success: true, message: "Item removed from cart" }
  } catch (error) {
    console.error("Remove from cart error:", error)
    return { success: false, message: "Failed to remove item from cart" }
  }
}

// Clear entire cart (WRITE operation - can create session)
export async function clearCart() {
  try {
    const sessionId = await getOrCreateGuestSession()

    // Ensure the guest user exists in the database
    await ensureGuestUserExists(sessionId)

    await prisma.panelItem.deleteMany({
      where: { guest_session_id: sessionId },
    })

    return { success: true, message: "Cart cleared successfully" }
  } catch (error) {
    console.error("Clear cart error:", error)
    return { success: false, message: "Failed to clear cart" }
  }
}

// Get cart total (READ operation - use read-only session)
export async function getCartTotal(): Promise<number> {
  try {
    const cartItems = await getCartWithDetails()
    return cartItems.reduce((total, item) => {
      return total + item.product.base_price * item.quantity
    }, 0)
  } catch (error) {
    console.error("Get cart total error:", error)
    return 0
  }
}