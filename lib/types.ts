// lib/types/product.ts

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
  base_price: number
  current_price: number
  discount_percentage: number
  is_featured: boolean
  total_stock: number
  status: "in_stock" | "low_stock" | "out_of_stock"
}

export interface ProductCardProps {
  product: ProductWithDetails
  isInWishlist?: boolean
}

// For wishlist actions
export interface WishlistResponse {
  success: boolean
  message: string
}

// For cart actions
export interface CartResponse {
  success: boolean
  message: string
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

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
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


export interface CartItem {
  id: string
  guest_session_id: string
  product_variant_id: string
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

export interface Like {
  id: string
  guest_session_id: string
  product_id: string
  liked_at: string
}

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  base_cost: number
  cost_per_item: number
}

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
