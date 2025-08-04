"use server"

import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import type { Order, OrderItem } from "@/lib/types"

const prisma = new PrismaClient()

// Get or create guest session
async function getGuestSession(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get("guest_session_id")?.value

  if (!sessionId) {
    throw new Error("No guest session found")
  }

  return sessionId
}

// Generate order reference
function generateOrderRef(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

// Create order from cart
export async function createOrder(orderData: {
  name: string
  phone: string
  address: string
  shippingCost?: number
}) {
  try {
    const sessionId = await getGuestSession()

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

    // Calculate total
    const subtotal = cartItems.reduce((total, item) => {
      return total + Number(item.productSizeStock.price) * item.quantity
    }, 0)

    const shippingCost = orderData.shippingCost || 0
    const total = subtotal + shippingCost

    // Create order in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          guest_session_id: sessionId,
          ref_id: generateOrderRef(),
          name: orderData.name,
          phone: orderData.phone,
          address: orderData.address,
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

// Get order by ID
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

    return {
      id: order.id,
      guest_session_id: order.guest_session_id,
      order_ref: order.ref_id,
      first_name: order.name.split(" ")[0] || order.name,
      last_name: order.name.split(" ").slice(1).join(" ") || "",
      email: "", // You might want to add email to your schema
      phone: order.phone,
      address: order.address,
      city: "", // You might want to add city to your schema
      postal_code: "", // You might want to add postal_code to your schema
      country: "", // You might want to add country to your schema
      shipping_cost: 0, // You might want to add shipping_cost to your schema
      order_notes: "", // You might want to add order_notes to your schema
      status: order.status.toUpperCase() as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
      created_at: order.created_at.toISOString(),
      total_amount: order.orderItems.reduce((total, item) => {
        return total + Number(item.price_at_purchase) * item.quantity
      }, 0),
      items: order.orderItems.map((item) => ({
        id: item.id,
        order_id: item.order_id,
        product_variant_id: item.product_size_stock_id,
        quantity: item.quantity,
        unit_price: Number(item.price_at_purchase),
        color_id: item.productSizeStock.productColor.color_id,
        size_id: item.productSizeStock.size_id,
        product: {
          id: item.productSizeStock.productColor.product.id,
          name: item.productSizeStock.productColor.product.name,
          image_url: item.productSizeStock.productColor.image_url || "/placeholder.svg",
        },
        color: {
          id: item.productSizeStock.productColor.color.id,
          name: item.productSizeStock.productColor.color.name,
          hex_code: item.productSizeStock.productColor.color.hex || "#000000",
        },
        size: {
          id: item.productSizeStock.size.id,
          label: item.productSizeStock.size.label,
        },
      })),
    }
  } catch (error) {
    console.error("Get order by ID error:", error)
    return null
  }
}

// Get order by reference
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

// Get user orders
export async function getUserOrders() {
  try {
    const sessionId = await getGuestSession()

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

    return orders.map((order) => ({
      id: order.id,
      order_ref: order.ref_id,
      status: order.status.toUpperCase() as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
      created_at: order.created_at.toISOString(),
      total_amount: order.orderItems.reduce((total, item) => {
        return total + Number(item.price_at_purchase) * item.quantity
      }, 0),
      items_count: order.orderItems.reduce((total, item) => total + item.quantity, 0),
    }))
  } catch (error) {
    console.error("Get user orders error:", error)
    return []
  }
}

// Update order status (admin function)
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