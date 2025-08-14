//order.ts

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

// Create order from cart (WRITE operation - reserves stock, doesn't reduce)
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

    // Check available stock (actual stock minus reserved stock)
    for (const item of cartItems) {
      const availableStock = item.productSizeStock.stock - item.productSizeStock.reserved_stock
      if (availableStock < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for ${item.productSizeStock.productColor.product.name}. Available: ${availableStock}, Required: ${item.quantity}`,
        }
      }
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((total:any, item:any) => {
      return total + Number(item.productSizeStock.price) * item.quantity
    }, 0)

    // Create order in transaction - RESERVE stock, don't reduce yet
    const result = await prisma.$transaction(async (tx:any) => {
      // Create order with new schema fields
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
          stock_reserved: true,  // Mark stock as reserved
          stock_reduced: false,  // Stock not reduced yet (awaiting approval)
        },
      })

      // Create order items and RESERVE stock (don't reduce actual stock)
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            order_id: order.id,
            product_size_stock_id: item.product_size_stock_id,
            quantity: item.quantity,
            price_at_purchase: item.productSizeStock.price,
          },
        })

        // Reserve stock instead of reducing it
        await tx.productSizeStock.update({
          where: { id: item.product_size_stock_id },
          data: {
            reserved_stock: {
              increment: item.quantity,
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
      message: "Order created successfully and stock reserved",
      orderId: result.id,
      orderRef: result.ref_id,
    }
  } catch (error) {
    console.error("Create order error:", error)
    return { success: false, message: "Failed to create order" }
  }
}

// Alternative order creation function compatible with dashboard
// export async function createOrderDirect(orderData: {
//   guest_session_id: string
//   name: string
//   phone: string
//   city: string
//   shipping_cost: number
//   shipping_option?: string
//   items: Array<{
//     product_size_stock_id: string
//     quantity: number
//     price_at_purchase: number
//   }>
// }): Promise<{ success: boolean; order?: any; error?: string }> => {
//   try {
//     // Generate unique reference ID
//     const refId = generateOrderRef()

//     // Check stock availability before creating order
//     for (const item of orderData.items) {
//       const sizeStock = await prisma.productSizeStock.findUnique({
//         where: { id: item.product_size_stock_id }
//       })

//       if (!sizeStock) {
//         return { success: false, error: "Product variant not found" }
//       }

//       const availableStock = sizeStock.stock - sizeStock.reserved_stock
//       if (availableStock < item.quantity) {
//         return { 
//           success: false, 
//           error: `Insufficient stock. Available: ${availableStock}, Required: ${item.quantity}` 
//         }
//       }
//     }

//     const result = await prisma.$transaction(async (tx:any) => {
//       // Create the order
//       const newOrder = await tx.order.create({
//         data: {
//           guest_session_id: orderData.guest_session_id,
//           ref_id: refId,
//           name: orderData.name,
//           phone: orderData.phone,
//           city: orderData.city,
//           shipping_cost: orderData.shipping_cost,
//           shipping_option: orderData.shipping_option,
//           status: "pending",
//           stock_reserved: true, // Mark as reserved
//           stock_reduced: false  // Not reduced yet
//         }
//       })

//       // Create order items and reserve stock
//       for (const item of orderData.items) {
//         await tx.orderItem.create({
//           data: {
//             order_id: newOrder.id,
//             product_size_stock_id: item.product_size_stock_id,
//             quantity: item.quantity,
//             price_at_purchase: item.price_at_purchase
//           }
//         })

//         // Reserve stock (don't reduce actual stock yet)
//         await tx.productSizeStock.update({
//           where: { id: item.product_size_stock_id },
//           data: {
//             reserved_stock: {
//               increment: item.quantity
//             }
//           }
//         })
//       }

//       return newOrder
//     })

//     return { success: true, order: result }
//   } catch (error) {
//     console.error("Create order direct error:", error)
//     return { success: false, error: "Failed to create order" }
//   }
// }

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
                    product_images: {
                      orderBy: { sort_order: 'asc' }
                    }
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
    const subtotal = order.orderItems.reduce((total:any, item:any) => {
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
      stock_reserved: order.stock_reserved,
      stock_reduced: order.stock_reduced,
      created_at: order.created_at.toISOString(),
      confirmed_at: order.confirmed_at?.toISOString(),
      approved_by: order.approved_by,
      shipping_cost: Number(order.shipping_cost),
      shipping_option: order.shipping_option,
      total_amount: total,
      items: order.orderItems.map((item:any) => ({
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
        image_urls: item.productSizeStock.productColor.product_images.map((img:any) => img.image_url),
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
                    product_images: {
                      orderBy: { sort_order: 'asc' }
                    }
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
    const subtotal = order.orderItems.reduce((total:any, item:any) => {
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
      stock_reserved: order.stock_reserved,
      stock_reduced: order.stock_reduced,
      created_at: order.created_at.toISOString(),
      confirmed_at: order.confirmed_at?.toISOString(),
      approved_by: order.approved_by,
      shipping_cost: Number(order.shipping_cost),
      shipping_option: order.shipping_option || undefined,
      total_amount: total,
      items: order.orderItems.map((item:any) => ({
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
        image_urls: item.productSizeStock.productColor.product_images.map((img:any) => img.image_url),
      })),
    }
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
                    product_images: {
                      where: { is_primary: true },
                      take: 1
                    }
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

    return orders.map((order:any) => {
      const subtotal = order.orderItems.reduce((total:any, item:any) => {
        return total + Number(item.price_at_purchase) * item.quantity
      }, 0)
      
      return {
        id: order.id,
        order_ref: order.ref_id,
        status: order.status.toUpperCase() as "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED",
        created_at: order.created_at.toISOString(),
        confirmed_at: order.confirmed_at?.toISOString(),
        approved_by: order.approved_by,
        stock_reserved: order.stock_reserved,
        stock_reduced: order.stock_reduced,
        total_amount: subtotal + Number(order.shipping_cost),
        items_count: order.orderItems.reduce((total:any, item:any) => total + item.quantity, 0),
      }
    })
  } catch (error) {
    console.error("Get user orders error:", error)
    return []
  }
}

// Update order status (compatible with dashboard statuses)
export async function updateOrderStatus(
  orderId: string, 
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            productSizeStock: true
          }
        }
      }
    })

    if (!order) {
      return { success: false, message: "Order not found" }
    }

    // If cancelling an order that has reserved stock, release the reserved stock
    if (status === "cancelled" && order.stock_reserved && !order.stock_reduced) {
      await prisma.$transaction(async (tx:any) => {
        // Release reserved stock
        for (const item of order.orderItems) {
          await tx.productSizeStock.update({
            where: { id: item.product_size_stock_id },
            data: {
              reserved_stock: {
                decrement: item.quantity
              }
            }
          })
        }

        // Update order status and stock flags
        await tx.order.update({
          where: { id: orderId },
          data: { 
            status,
            stock_reserved: false
          },
        })
      })
    } else {
      // Regular status update
      await prisma.order.update({
        where: { id: orderId },
        data: { status },
      })
    }

    return { success: true, message: "Order status updated successfully" }
  } catch (error) {
    console.error("Update order status error:", error)
    return { success: false, message: "Failed to update order status" }
  }
}

// Cancel order and release reserved stock
export async function cancelOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            productSizeStock: true
          }
        }
      }
    })

    if (!order) {
      return { success: false, message: "Order not found" }
    }

    if (order.status === "cancelled") {
      return { success: false, message: "Order is already cancelled" }
    }

    if (order.status === "delivered") {
      return { success: false, message: "Cannot cancel delivered order" }
    }

    await prisma.$transaction(async (tx:any) => {
      // Release reserved stock if it was reserved
      if (order.stock_reserved && !order.stock_reduced) {
        for (const item of order.orderItems) {
          await tx.productSizeStock.update({
            where: { id: item.product_size_stock_id },
            data: {
              reserved_stock: {
                decrement: item.quantity
              }
            }
          })
        }
      }
      
      // If stock was already reduced (order was approved), restore it
      if (order.stock_reduced) {
        for (const item of order.orderItems) {
          await tx.productSizeStock.update({
            where: { id: item.product_size_stock_id },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          })
        }
      }

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { 
          status: "cancelled",
          stock_reserved: false,
          // Keep stock_reduced as is for tracking purposes
        },
      })
    })

    return { success: true, message: "Order cancelled successfully" }
  } catch (error) {
    console.error("Cancel order error:", error)
    return { success: false, message: "Failed to cancel order" }
  }
}

// Get available stock (actual stock minus reserved stock)
export async function getAvailableStock(productSizeStockId: string): Promise<number> {
  try {
    const sizeStock = await prisma.productSizeStock.findUnique({
      where: { id: productSizeStockId }
    })

    if (!sizeStock) return 0

    return Math.max(0, sizeStock.stock - sizeStock.reserved_stock)
  } catch (error) {
    console.error("Get available stock error:", error)
    return 0
  }
}

// Get detailed stock information
export async function getStockInfo(productSizeStockId: string) {
  try {
    const sizeStock = await prisma.productSizeStock.findUnique({
      where: { id: productSizeStockId }
    })

    if (!sizeStock) return null

    return {
      actualStock: sizeStock.stock,
      reservedStock: sizeStock.reserved_stock,
      availableStock: Math.max(0, sizeStock.stock - sizeStock.reserved_stock)
    }
  } catch (error) {
    console.error("Get stock info error:", error)
    return null
  }
}

// Check if order can be cancelled by customer
export async function canCancelOrder(orderId: string): Promise<boolean> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true }
    })

    if (!order) return false

    // Orders can be cancelled if they're pending or confirmed but not shipped/delivered
    return order.status === "pending" || order.status === "confirmed"
  } catch (error) {
    console.error("Can cancel order error:", error)
    return false
  }
}

// Get order summary for customer (lightweight version)
export async function getOrderSummary(orderRef: string) {
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

    // Calculate totals
    const subtotal = order.orderItems.reduce((total:any, item:any) => {
      return total + Number(item.price_at_purchase) * item.quantity
    }, 0)

    const total = subtotal + Number(order.shipping_cost)
    const itemsCount = order.orderItems.reduce((count:any, item:any) => count + item.quantity, 0)

    return {
      ref_id: order.ref_id,
      status: order.status,
      created_at: order.created_at.toISOString(),
      confirmed_at: order.confirmed_at?.toISOString(),
      name: order.name,
      phone: order.phone,
      city: order.city,
      shipping_option: order.shipping_option,
      subtotal,
      shipping_cost: Number(order.shipping_cost),
      total_amount: total,
      items_count: itemsCount,
      can_cancel: order.status === "pending" || order.status === "confirmed"
    }
  } catch (error) {
    console.error("Get order summary error:", error)
    return null
  }
}