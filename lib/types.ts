// lib/types/index.ts

// Product interfaces
export interface ProductWithDetails {
  id: string
  name: string
  description: string | null
  category_id: string | null
  solde_percentage: number | null
  top_price: boolean
  created_at: Date
  updated_at: Date
  category: {
    id: string
    name: string
    slug: string
  } | null
  colors: {
    id: string
    name: string
    hex_code: string
  }[]
  images: {
    id: string
    color_id: string
    image_url: string
    is_primary: boolean
  }[]
  variants: {
    id: string
    color_id: string
    size_id: string
    stock_quantity: number
    price: number
    size: {
      id: string
      label: string
    }
    color: {
      id: string
      name: string
      hex: string | null
    }
  }[]
  sizes: {
    id: string
    label: string
  }[]
  base_price: number
  current_price: number
  discount_percentage: number
  is_featured: boolean
  total_stock: number
  status: "in_stock" | "low_stock" | "out_of_stock"
}

export interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  parent?: Category | null
  children?: Category[]
}

export interface ProductCardProps {
  product: ProductWithDetails
  isInWishlist?: boolean
}

export interface Product {
  id: string
  name: string
  base_price: number
  discount_percentage: number
  description: string
  is_featured: boolean
  created_at: string
  category_id: string
  ref_code: string
}

export interface Color {
  id: string
  name: string
  hex_code: string
}

export interface Size {
  id: string
  label: string
  sort_order: number
}

export interface ProductVariant {
  id: string
  product_id: string
  color_id: string
  size_id: string
  stock_quantity: number
  sku: string
}

export interface ProductImage {
  id: string
  product_id: string
  color_id: string
  image_url: string
  is_primary: boolean
}

// Cart interfaces
export interface CartItem {
  id: string
  guest_session_id: string
  product_size_stock_id: string
  quantity: number
  added_at: string
}

export interface CartItemWithDetails extends CartItem {
  product: Product
  variant: ProductVariant
  color: Color
  size: Size
  image: ProductImage
}

export interface CartItemForCheckout {
  id: string
  product_size_stock_id: string
  quantity: number
  price: number
  subtotal: number
  product: {
    id: string
    name: string
  }
  color: {
    id: string
    name: string
    hex: string
  }
  size: {
    id: string
    label: string
  }
  image_url: string
}

// Wishlist interfaces
export interface Like {
  id: string
  guest_session_id: string
  product_id: string
  liked_at: string
}

export interface WishlistResponse {
  success: boolean
  message: string
}

export interface CartResponse {
  success: boolean
  message: string
}

// Shipping interfaces
export interface ShippingOption {
  id: string
  label: string
  price: number
  cities: string
}

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  base_cost: number
  cost_per_item: number
}

// Order interfaces
export interface Order {
  id: string
  guest_session_id: string
  ref_id: string
  name: string
  phone: string
  city: string
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  created_at: string
  total_amount: number
  subtotal?: number
  shipping_cost?: number
  shipping_option?: ShippingOption
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_size_stock_id: string
  quantity: number
  price: number
  unit_price: number
  subtotal: number
  product: {
    id: string
    name: string
  }
  color: {
    id: string
    name: string
    hex: string
  }
  size: {
    id: string
    label: string
  }
  image_url: string
}

export interface OrderSummary {
  id: string
  ref_id: string
  name: string
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  created_at: string
  total_amount: number
  items_count: number
}

// Form interfaces
export interface CheckoutFormData {
  fullName: string
  phone: string
  city: string
  notes?: string
}

export interface OrderCreationData extends CheckoutFormData {
  shippingOptionId: string
}

// API Response interfaces
export interface OrderCreationResponse {
  success: boolean
  message: string
  order?: Order
}

export interface CartItemsResponse {
  success: boolean
  message: string
  items: CartItemForCheckout[]
}

// Guest user interface
export interface GuestUser {
  session_id: string
  created_at: string
  expires_at: string
}