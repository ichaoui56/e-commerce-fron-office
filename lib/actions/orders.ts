"use server"

import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import type { Order, OrderItem } from "@/lib/types"
import { getOrCreateGuestSession } from "@/lib/actions/session"

const prisma = new PrismaClient()

// Get guest session for read operations (build-safe)
async function getGuestSessionReadOnly(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get("guest_session_id")?.value || null
  } catch (error) {
    console.warn("Cannot get guest session during build time:", error)
    return null
  }
}

// Generate order reference
function generateOrderRef(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

// Create order from cart (WRITE operation - can create session)
export async function createOrder(orderData: {
  name: string
  phone: string
  city: string
  shippingCost: number
  shippingOption: string
}) {
  try {
    const sessionId = await getOrCreateGuestSession()

    // Get cart items
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
    })

    if (cartItems.length === 0) {
      return { success: false, message: "Cart is empty" }
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.productSizeStock.stock < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for ${item.productSizeStock.productColor.product.name}`,
        }
      }
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
      return total + Number(item.productSizeStock.price) * item.quantity
    }, 0)

    // Create order in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create order with shipping cost
      const order = await tx.order.create({
        data: {
          guest_session_id: sessionId,
          ref_id: generateOrderRef(),
          name: orderData.name,
          phone: orderData.phone,
          city: orderData.city,
          shipping_cost: orderData.shippingCost,
          shipping_option: orderData.shippingOption,
          status: "pending",
        },
      })

      // Create order items and update stock
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            order_id: order.id,
            product_size_stock_id: item.product_size_stock_id,
            quantity: item.quantity,
            price_at_purchase: item.productSizeStock.price,
          },
        })

        // Update stock
        await tx.productSizeStock.update({
          where: { id: item.product_size_stock_id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      // Clear cart
      await tx.panelItem.deleteMany({
        where: { guest_session_id: sessionId },
      })

      return order
    })

    return {
      success: true,
      message: "Order created successfully",
      orderId: result.id,
      orderRef: result.ref_id,
    }
  } catch (error) {
    console.error("Create order error:", error)
    return { success: false, message: "Failed to create order" }
  }
}

// Get order by ID (READ operation - no session needed)
export async function getOrderById(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
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
        },
      },
    })

    if (!order) {
      return null
    }

    // Calculate subtotal from order items
    const subtotal = order.orderItems.reduce((total, item) => {
      return total + Number(item.price_at_purchase) * item.quantity
    }, 0)

    // Total includes shipping cost
    const total = subtotal + Number(order.shipping_cost)

    return {
      id: order.id,
      ref_id: order.ref_id,
      name: order.name,
      phone: order.phone,
      city: order.city,
      status: order.status,
      created_at: order.created_at.toISOString(),
      shipping_cost: Number(order.shipping_cost),
      shipping_option: order.shipping_option,
      total_amount: total,
      items: order.orderItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unit_price: Number(item.price_at_purchase),
        subtotal: Number(item.price_at_purchase) * item.quantity,
        product: {
          id: item.productSizeStock.productColor.product.id,
          name: item.productSizeStock.productColor.product.name,
        },
        color: {
          id: item.productSizeStock.productColor.color.id,
          name: item.productSizeStock.productColor.color.name,
          hex: item.productSizeStock.productColor.color.hex || "#000000",
        },
        size: {
          id: item.productSizeStock.size.id,
          label: item.productSizeStock.size.label,
        },
        image_url: item.productSizeStock.productColor.image_url || "/placeholder.svg",
      })),
    }
  } catch (error) {
    console.error("Get order by ID error:", error)
    return null
  }
}

// Get order by reference (READ operation - no session needed)
export async function getOrderByRef(orderRef: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { ref_id: orderRef },
      include: {
        orderItems: {
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
        },
      },
    })

    if (!order) {
      return null
    }

    return await getOrderById(order.id)
  } catch (error) {
    console.error("Get order by ref error:", error)
    return null
  }
}

// Get user orders (READ operation - use read-only session)
export async function getUserOrders() {
  try {
    const sessionId = await getGuestSessionReadOnly()

    // Return empty array if no session (e.g., during build time)
    if (!sessionId) {
      return []
    }

    const orders = await prisma.order.findMany({
      where: { guest_session_id: sessionId },
      include: {
        orderItems: {
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
        },
      },
      orderBy: { created_at: "desc" },
    })

    return orders.map((order) => {
      const subtotal = order.orderItems.reduce((total, item) => {
        return total + Number(item.price_at_purchase) * item.quantity
      }, 0)
      
      return {
        id: order.id,
        order_ref: order.ref_id,
        status: order.status.toUpperCase() as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
        created_at: order.created_at.toISOString(),
        total_amount: subtotal + Number(order.shipping_cost),
        items_count: order.orderItems.reduce((total, item) => total + item.quantity, 0),
      }
    })
  } catch (error) {
    console.error("Get user orders error:", error)
    return []
  }
}

// Update order status (admin function - WRITE operation)
export async function updateOrderStatus(orderId: string, status: "pending" | "shipped" | "delivered" | "cancelled") {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    return { success: true, message: "Order status updated successfully" }
  } catch (error) {
    console.error("Update order status error:", error)
    return { success: false, message: "Failed to update order status" }
  }
}