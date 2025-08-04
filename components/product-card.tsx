"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist"
import { addToCart } from "@/lib/actions/cart"
import { useToast } from "@/hooks/use-toast"
import { useState, useTransition, useEffect } from "react"

// Updated interface to match your server actions
interface ProductWithDetails {
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

interface ProductCardProps {
  product: ProductWithDetails
  isInWishlist?: boolean
  onWishlistChange?: (productId: string, isLiked: boolean) => void
}

export default function ProductCard({ product, isInWishlist = false, onWishlistChange }: ProductCardProps) {
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(isInWishlist)
  const [selectedColorId, setSelectedColorId] = useState(product.colors[0]?.id || "")
  const [isPending, startTransition] = useTransition()

  // Update local state when prop changes
  useEffect(() => {
    setIsLiked(isInWishlist)
  }, [isInWishlist])

  // Get current image based on selected color
  const currentImage =
    product.images.find((img) => img.color_id === selectedColorId && img.is_primary)?.image_url ||
    product.images.find((img) => img.color_id === selectedColorId)?.image_url ||
    product.images[0]?.image_url ||
    "/placeholder.svg"

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    startTransition(async () => {
      try {
        const result = isLiked ? await removeFromWishlist(product.id) : await addToWishlist(product.id)

        if (result.success) {
          const newLikedState = !isLiked
          setIsLiked(newLikedState)
          
          // Call the callback to update parent component
          onWishlistChange?.(product.id, newLikedState)
          
          toast({
            title: result.message,
            variant: "success",
          })

          // Dispatch custom event to update navbar count
          window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { count: result.count || 0 } 
          }))
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        })
      }
    })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    startTransition(async () => {
      try {
        // Find first available variant for selected color
        const availableVariant = product.variants.find(
          (variant) => variant.color_id === selectedColorId && variant.stock_quantity > 0,
        )

        if (!availableVariant) {
          toast({
            title: "Error",
            description: "No stock available for selected color",
            variant: "destructive",
          })
          return
        }

        const result = await addToCart(product.id, selectedColorId, availableVariant.size_id, 1)

        if (result.success) {
          toast({
            title: result.message,
            variant: "success",
          })
          
          // Dispatch custom event to update navbar cart count
          window.dispatchEvent(new CustomEvent('cartUpdated'))
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add to cart",
          variant: "destructive",
        })
      }
    })
  }

  // Check if product has stock
  const hasStock = product.total_stock > 0
  const isOutOfStock = product.status === "out_of_stock"

  return (
    <div className="group relative bg-white rounded-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Product Image Container */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 ${!isMobile ? "group-hover:scale-105" : ""} ${
              isOutOfStock ? "grayscale opacity-75" : ""
            }`}
          />

          {/* Discount Badge */}
          {product.discount_percentage > 0 && (
            <div className="absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-full bg-red-500 shadow-lg">
              -{product.discount_percentage}%
            </div>
          )}

          {/* Stock Status Badge */}
          {isOutOfStock && (
            <div className="absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-full bg-gray-500 shadow-lg">
              OUT OF STOCK
            </div>
          )}

          {/* Featured Badge */}
          {product.is_featured && (
            <div className="absolute top-3 right-14 px-2 py-1 text-xs font-bold text-white rounded-full bg-[#e94491] shadow-lg">
              TOP
            </div>
          )}

          {/* Heart Icon - Always visible on mobile, hover on desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlistToggle}
            disabled={isPending}
            className={`absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full h-10 w-10 transition-all duration-300 shadow-lg ${
              isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isLiked ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button>

          {/* Add to Cart Button - Always visible on mobile, hover on desktop */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 transition-transform duration-300 ${
              isMobile ? "translate-y-0" : "transform translate-y-full group-hover:translate-y-0"
            }`}
          >
            <Button
              variant="outline"
              onClick={handleAddToCart}
              disabled={isPending || isOutOfStock}
              className="w-full bg-white/95 backdrop-blur-sm border-gray-200 hover:bg-[#e94491] hover:text-white text-gray-700 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isPending ? "ADDING..." : isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
            {product.category.name}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 line-clamp-2 hover:text-[#e94491] transition-colors cursor-pointer leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-[#e94491]">
            ${product.current_price.toFixed(2)}
          </span>
          {product.discount_percentage > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ${product.base_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 mr-1">Colors:</span>
            {product.colors.slice(0, 5).map((color) => (
              <button
                key={color.id}
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedColorId(color.id)
                }}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110",
                  selectedColorId === color.id 
                    ? "border-[#000000] ring-1 ring-[#000000]/30 scale-110" 
                    : "border-gray-300 hover:border-gray-400",
                )}
                style={{ backgroundColor: color.hex_code }}
                title={color.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-gray-400 ml-1">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                product.status === "in_stock" 
                  ? "bg-green-500" 
                  : product.status === "low_stock" 
                  ? "bg-yellow-500" 
                  : "bg-red-500"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                product.status === "in_stock" 
                  ? "text-green-600" 
                  : product.status === "low_stock" 
                  ? "text-yellow-600" 
                  : "text-red-600"
              )}
            >
              {product.status === "in_stock" 
                ? "In Stock" 
                : product.status === "low_stock" 
                ? "Low Stock" 
                : "Out of Stock"}
            </span>
          </div>
          
          {/* Show stock count for low stock items */}
          {product.status === "low_stock" && (
            <span className="text-xs text-gray-500">
              {product.total_stock} left
            </span>
          )}
        </div>
      </div>
    </div>
  )
}