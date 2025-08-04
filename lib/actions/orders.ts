"use server"

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { getGuestSession } from "./session"
import { getCart, clearCart } from "./cart"
import { v4 as uuidv4 } from "uuid"

export interface Order {
  id: string
  guest_session_id: string
  order_ref: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  country: string
  shipping_cost: number
  order_notes?: string
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  created_at: string
  total_amount: number
}

export interface OrderItem {
  id: string
  order_id: string
  product_variant_id: string
  quantity: number
  unit_price: number
  color_id: string
  size_id: string
}

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  base_cost: number
  cost_per_item: number
}

// Helper functions
function getOrdersFilePath() {
  return join(process.cwd(), "data", "orders.json")
}

function getOrderItemsFilePath() {
  return join(process.cwd(), "data", "order-items.json")
}

function readOrders(): Order[] {
  try {
    const content = readFileSync(getOrdersFilePath(), "utf-8")
    return JSON.parse(content)
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]) {
  writeFileSync(getOrdersFilePath(), JSON.stringify(orders, null, 2))
}

function readOrderItems(): OrderItem[] {
  try {
    const content = readFileSync(getOrderItemsFilePath(), "utf-8")
    return JSON.parse(content)
  } catch {
    return []
  }
}

function writeOrderItems(orderItems: OrderItem[]) {
  writeFileSync(getOrderItemsFilePath(), JSON.stringify(orderItems, null, 2))
}

function readShippingZones(): ShippingZone[] {
  const content = readFileSync(join(process.cwd(), "data", "shipping-zones.json"), "utf-8")
  return JSON.parse(content)
}

// Calculate shipping cost
export async function calculateShipping(country: string, itemCount: number): Promise<number> {
  const zones = readShippingZones()

  let zone = zones.find((z) => z.countries.includes(country))
  if (!zone) {
    zone = zones.find((z) => z.countries.includes("*")) // Rest of world
  }

  if (!zone) return 0

  return zone.base_cost + zone.cost_per_item * itemCount
}

// Generate order reference
function generateOrderRef(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `ORD-${timestamp}-${random}`.toUpperCase()
}

// Place order
export async function placeOrder(orderData: {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  country: string
  order_notes?: string
}): Promise<{ success: boolean; message: string; order_ref?: string }> {
  try {
    const sessionId = await getGuestSession()
    const cartItems = await getCart()

    if (cartItems.length === 0) {
      return { success: false, message: "Cart is empty" }
    }

    // Calculate totals (simplified - in real app you'd get actual product prices)
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = itemCount * 50 // Simplified calculation
    const shippingCost = await calculateShipping(orderData.country, itemCount)
    const totalAmount = subtotal + shippingCost

    // Create order
    const orderId = uuidv4()
    const orderRef = generateOrderRef()

    const order: Order = {
      id: orderId,
      guest_session_id: sessionId,
      order_ref: orderRef,
      ...orderData,
      shipping_cost: shippingCost,
      status: "PENDING",
      created_at: new Date().toISOString(),
      total_amount: totalAmount,
    }

    // Create order items
    const orderItems: OrderItem[] = cartItems.map((cartItem) => ({
      id: uuidv4(),
      order_id: orderId,
      product_variant_id: cartItem.product_variant_id,
      quantity: cartItem.quantity,
      unit_price: 50, // Simplified
      color_id: "color-1", // Simplified
      size_id: "size-3", // Simplified
    }))

    // Save to files
    const orders = readOrders()
    orders.push(order)
    writeOrders(orders)

    const allOrderItems = readOrderItems()
    allOrderItems.push(...orderItems)
    writeOrderItems(allOrderItems)

    // Clear cart
    await clearCart()

    return {
      success: true,
      message: "Order placed successfully!",
      order_ref: orderRef,
    }
  } catch (error) {
    return { success: false, message: "Failed to place order" }
  }
}

// Get user's orders
export async function getUserOrders(): Promise<Order[]> {
  try {
    const sessionId = await getGuestSession()
    const orders = readOrders()

    return orders.filter((order) => order.guest_session_id === sessionId)
  } catch {
    return []
  }
}

// Get order by reference
export async function getOrderByRef(orderRef: string): Promise<Order | null> {
  try {
    const orders = readOrders()
    return orders.find((order) => order.order_ref === orderRef) || null
  } catch {
    return null
  }
}
