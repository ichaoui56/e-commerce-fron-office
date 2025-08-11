"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist"
import { addToCart } from "@/lib/actions/cart"
import { useToast } from "@/hooks/use-toast"
import { useState, useTransition, useEffect } from "react"

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
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [loadedImageUrl, setLoadedImageUrl] = useState("")

  useEffect(() => {
    setIsLiked(isInWishlist)
  }, [isInWishlist])

  // Get current image based on selected color
  const currentImage =
    product.images.find((img) => img.color_id === selectedColorId && img.is_primary)?.image_url ||
    product.images.find((img) => img.color_id === selectedColorId)?.image_url ||
    product.images[0]?.image_url ||
    "/placeholder.svg"

  // Handle image loading when color changes
  useEffect(() => {
    if (currentImage && currentImage !== loadedImageUrl) {
      setIsImageLoading(true)
    }
  }, [currentImage, loadedImageUrl])

  const handleImageLoad = () => {
    setIsImageLoading(false)
    setLoadedImageUrl(currentImage)
  }

  const handleImageError = () => {
    setIsImageLoading(false)
  }

  const handleColorChange = (colorId: string) => {
    if (colorId !== selectedColorId) {
      setSelectedColorId(colorId)
      // Start loading immediately when color changes
      setIsImageLoading(true)
    }
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    startTransition(async () => {
      try {
        const result = isLiked ? await removeFromWishlist(product.id) : await addToWishlist(product.id)
        if (result.success) {
          const newLikedState = !isLiked
          setIsLiked(newLikedState)
          onWishlistChange?.(product.id, newLikedState)
          toast({
            title: result.message,
            variant: "success",
          })
          window.dispatchEvent(new CustomEvent("wishlistUpdated", {
            detail: { count: result.count || 0 },
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
        const availableVariant = product.variants.find(
          (variant) => variant.color_id === selectedColorId && variant.stock_quantity > 0
        )

        if (!availableVariant) {
          toast({
            title: "Error",
            description: "No stock available for selected color",
            variant: "destructive",
          })
          return
        }

        const result = await addToCart(availableVariant.id, 1)
        if (result.success) {
          toast({
            title: result.message,
            variant: "success",
          })
          window.dispatchEvent(new CustomEvent("cartUpdated"))
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

  const hasStock = product.total_stock > 0
  const isOutOfStock = product.status === "out_of_stock"

  return (
    <div
      className="group relative bg-white rounded-xl border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container - Much bigger/taller */}
      <div className="relative aspect-[3/5] sm:aspect-[4/6] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Loading Overlay - positioned over the image */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-2 rounded-lg px-3 py-2 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
              <span className="text-xs text-gray-600 font-medium">Loading...</span>
            </div>
          </div>
        )}
        <Link href={`/product/${product.id}`}>
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 cursor-pointer ${!isMobile && isHovered ? "scale-105" : "scale-100"
              } ${isOutOfStock ? "grayscale opacity-75" : ""} ${isImageLoading ? "opacity-50" : "opacity-100"
              }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={false}
          />
        </Link>
        {/* Badges - Positioned outside image area on mobile */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 sm:bottom-auto flex flex-row sm:flex-col gap-1 sm:gap-2 z-20">
          {product.discount_percentage > 0 && (
            <div className="px-2 py-1 text-xs font-bold text-white rounded-md bg-red-500 shadow-sm">
              -{product.discount_percentage}%
            </div>
          )}
          {product.is_featured && (
            <div className="px-2 py-1 text-xs font-bold text-white rounded-md bg-[#e94491] shadow-sm">
              TOP
            </div>
          )}
        </div>

        {/* Action Buttons - Different layout for mobile vs desktop */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 z-20">
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlistToggle}
            disabled={isPending}
            className={`bg-white/90 backdrop-blur-sm hover:bg-white rounded-full h-8 w-8 sm:h-9 sm:w-9 transition-all duration-200 shadow-sm border border-gray-100 ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${isLiked ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"
                }`}
            />
          </Button>

          {/* Quick View Button */}
          <Link href={`/product/${product.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className={`bg-white/90 backdrop-blur-sm hover:bg-white rounded-full h-8 w-8 sm:h-9 sm:w-9 transition-all duration-200 shadow-sm border border-gray-100 ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4 text-gray-600 hover:text-[#e94491]" />
            </Button>
          </Link>

          {/* Add to Cart Button - Icon only, ONLY visible on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddToCart}
            disabled={isPending || isOutOfStock}
            className={`sm:hidden bg-white/90 backdrop-blur-sm hover:bg-white rounded-full h-8 w-8 transition-all duration-200 shadow-sm border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${!isOutOfStock ? "hover:bg-[#e94491] hover:text-white hover:border-[#e94491]" : ""
              }`}
            aria-label={isPending ? "Adding to cart..." : isOutOfStock ? "Out of stock" : "Add to cart"}
          >
            <ShoppingCart
              className={`h-4 w-4 transition-colors ${isPending ? "animate-pulse" : ""
                } ${isOutOfStock ? "text-gray-400" : "text-gray-600"}`}
            />
          </Button>
        </div>

        {/* Full Add to Cart Button - ONLY visible on larger screens */}
        <div className={`hidden sm:block absolute bottom-0 left-0 right-0 p-3 transition-all duration-500 z-20 ${isMobile ? "" : "translate-y-full group-hover:translate-y-0"
          }`}>
          <Button
            onClick={handleAddToCart}
            disabled={isPending || isOutOfStock}
            className="w-full bg-white/95 backdrop-blur-sm border border-white/50 hover:bg-[#e94491] hover:text-white hover:border-[#e94491] text-gray-700 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg h-10 text-sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isPending ? "ADDING..." : isOutOfStock ? "SOLD OUT" : "ADD TO CART"}
          </Button>
        </div>
      </div>

      {/* Product Information - More compact since image is bigger */}
      <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
        {/* Category & Status */}
        <div className="flex justify-between items-center">
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium truncate">
              {product.category.name}
            </p>
          )}
          {/* Stock Status Indicator */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
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
                  ? `${product.total_stock} left`
                  : "Sold Out"}
            </span>
          </div>
        </div>

        {/* Product Name - Compact */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2 hover:text-[#e94491] transition-colors cursor-pointer leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-[#e94491]">
            {product.current_price.toFixed(2)} MAD
          </span>
          {product.discount_percentage > 0 && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {product.base_price.toFixed(2)} MAD
            </span>
          )}
        </div>

        {/* Color Selection - Compact */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 mr-1">Colors:</span>
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <button
                  key={color.id}
                  onClick={(e) => {
                    e.preventDefault()
                    handleColorChange(color.id)
                  }}
                  disabled={isImageLoading}
                  className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50",
                    selectedColorId === color.id
                      ? "border-gray-800 ring-1 ring-gray-800/20 scale-110"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                  style={{ backgroundColor: color.hex_code }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 3 && (
                <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-100 border border-gray-200 text-xs text-gray-500 font-medium">
                  +{product.colors.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}