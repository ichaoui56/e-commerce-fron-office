"use server"

import { PrismaClient } from "@prisma/client"
import { getGuestSessionId, getOrCreateGuestSession } from "@/lib/actions/session"
import type { ProductWithDetails } from "@/lib/types"

const prisma = new PrismaClient()

export interface WishlistResponse {
  success: boolean
  message: string
  count?: number
}

// Add product to wishlist
export async function addToWishlist(productId: string): Promise<WishlistResponse> {
  try {
    const sessionId = await getOrCreateGuestSession()

    // Check if already in wishlist
    const existingLike = await prisma.like.findUnique({
      where: {
        guest_session_id_product_id: {
          guest_session_id: sessionId,
          product_id: productId,
        },
      },
    })

    if (existingLike) {
      return {
        success: false,
        message: "Product already in wishlist",
      }
    }

    // Ensure guest user exists
    await prisma.guestUser.upsert({
      where: { session_id: sessionId },
      update: {},
      create: {
        session_id: sessionId,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })

    // Add to wishlist
    await prisma.like.create({
      data: {
        guest_session_id: sessionId,
        product_id: productId,
      },
    })

    // Get updated count
    const count = await getWishlistCount()

    return {
      success: true,
      message: "Added to wishlist",
      count,
    }
  } catch (error) {
    console.error("Add to wishlist error:", error)
    return {
      success: false,
      message: "Failed to add to wishlist",
    }
  }
}

// Remove product from wishlist
export async function removeFromWishlist(productId: string): Promise<WishlistResponse> {
  try {
    const sessionId = await getOrCreateGuestSession()

    await prisma.like.deleteMany({
      where: {
        guest_session_id: sessionId,
        product_id: productId,
      },
    })

    // Get updated count
    const count = await getWishlistCount()

    return {
      success: true,
      message: "Removed from wishlist",
      count,
    }
  } catch (error) {
    console.error("Remove from wishlist error:", error)
    return {
      success: false,
      message: "Failed to remove from wishlist",
    }
  }
}

// Get wishlist count
export async function getWishlistCount(): Promise<number> {
  try {
    const sessionId = await getGuestSessionId()

    if (!sessionId) {
      return 0
    }

    const count = await prisma.like.count({
      where: {
        guest_session_id: sessionId,
      },
    })

    return count
  } catch (error) {
    console.error("Get wishlist count error:", error)
    return 0
  }
}

// Get wishlist product IDs
export async function getWishlistProductIds(): Promise<string[]> {
  try {
    const sessionId = await getGuestSessionId()

    if (!sessionId) {
      return []
    }

    const likes = await prisma.like.findMany({
      where: {
        guest_session_id: sessionId,
      },
      select: {
        product_id: true,
      },
    })

    return likes.map((like) => like.product_id)
  } catch (error) {
    console.error("Get wishlist product IDs error:", error)
    return []
  }
}

// Get wishlist with full product details
export async function getWishlistWithDetails(): Promise<ProductWithDetails[]> {
  try {
    const sessionId = await getGuestSessionId()

    if (!sessionId) {
      return []
    }

    const likes = await prisma.like.findMany({
      where: {
        guest_session_id: sessionId,
      },
      include: {
        product: {
          include: {
            category: true,
            productColors: {
              include: {
                color: true,
                productSizeStocks: {
                  include: {
                    size: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        liked_at: "desc",
      },
    })

    // Transform the data to match ProductWithDetails interface
    const products = likes.map((like) => like.product)
    return transformProductsData(products)
  } catch (error) {
    console.error("Get wishlist with details error:", error)
    return []
  }
}

// Check if product is in wishlist
export async function isProductInWishlist(productId: string): Promise<boolean> {
  try {
    const sessionId = await getGuestSessionId()

    if (!sessionId) {
      return false
    }

    const like = await prisma.like.findUnique({
      where: {
        guest_session_id_product_id: {
          guest_session_id: sessionId,
          product_id: productId,
        },
      },
    })

    return !!like
  } catch (error) {
    console.error("Check wishlist error:", error)
    return false
  }
}

// Transform products data to match the expected structure
const transformProductsData = (products: any[]): ProductWithDetails[] => {
  return products.map((product) => {
    // Extract colors from productColors
    const colors = product.productColors.map((pc: any) => ({
      id: pc.color.id,
      name: pc.color.name,
      hex_code: pc.color.hex || "#000000",
    }))

    // Extract images from productColors (using image_url as primary image)
    const images = product.productColors
      .filter((pc: any) => pc.image_url)
      .map((pc: any, index: number) => ({
        id: pc.id,
        color_id: pc.color_id,
        image_url: pc.image_url,
        is_primary: index === 0, // First image is primary
      }))

    // Extract variants from productSizeStocks
    const variants = product.productColors.flatMap((pc: any) =>
      pc.productSizeStocks.map((pss: any) => ({
        id: pss.id,
        color_id: pc.color_id,
        size_id: pss.size_id,
        stock_quantity: pss.stock,
        price: Number(pss.price),
        size: {
          id: pss.size.id,
          label: pss.size.label,
        },
        color: {
          id: pc.color.id,
          name: pc.color.name,
          hex: pc.color.hex,
        },
      })),
    )

    const sizes = product.productColors.flatMap((pc: any) =>
      pc.productSizeStocks.map((pss: any) => ({
        id: pss.size_id,
        label: pss.size.label,
      }))
    )

    // Calculate pricing
    const basePrices = variants.map((v: any) => v.price).filter((price: any) => price > 0)
    const basePrice = basePrices.length > 0 ? Math.min(...basePrices) : 0
    const discountPercentage = product.solde_percentage || 0
    const currentPrice = discountPercentage > 0 ? basePrice * (1 - discountPercentage / 100) : basePrice

    // Calculate total stock
    const totalStock = variants.reduce((total: number, variant: any) => total + variant.stock_quantity, 0)

    // Determine stock status
    let status: "in_stock" | "low_stock" | "out_of_stock" = "out_of_stock"
    if (totalStock === 0) {
      status = "out_of_stock"
    } else if (totalStock < 20) {
      status = "low_stock"
    } else {
      status = "in_stock"
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      solde_percentage: product.solde_percentage,
      top_price: product.top_price,
      created_at: product.created_at,
      updated_at: product.updated_at,
      category: product.category,
      colors: colors,
      images: images,
      variants: variants,
      sizes: sizes,
      base_price: basePrice,
      current_price: currentPrice,
      discount_percentage: discountPercentage,
      is_featured: product.top_price, // Using top_price as featured flag
      total_stock: totalStock,
      status: status,
    }
  })
}
