"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Grid, List, X } from "lucide-react"
import ProductCard from "./product-card"
import type { ProductWithDetails } from "@/lib/types"
import { removeFromWishlist } from "@/lib/actions/wishlist"
import { addToCart } from "@/lib/actions/cart"
import { useToast } from "@/hooks/use-toast"
import { useTransition } from "react"

interface WishlistPageProps {
  products: ProductWithDetails[]
}

export default function WishlistPage({ products }: WishlistPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [wishlistProducts, setWishlistProducts] = useState(products)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleWishlistChange = (productId: string, isLiked: boolean) => {
    if (!isLiked) {
      // Remove from local state immediately
      setWishlistProducts((prev) => prev.filter((p) => p.id !== productId))
      
      // Dispatch custom event to update navbar count
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { count: wishlistProducts.length - 1 } 
      }))
    }
  }

  const handleRemoveFromWishlist = (productId: string) => {
    startTransition(async () => {
      try {
        const result = await removeFromWishlist(productId)

        if (result.success) {
          setWishlistProducts((prev) => prev.filter((p) => p.id !== productId))
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
          description: "Failed to remove from wishlist",
          variant: "destructive",
        })
      }
    })
  }

  const handleAddToCart = (product: ProductWithDetails) => {
    startTransition(async () => {
      try {
        const firstVariant = product.variants.find(v => v.stock_quantity > 0)
        if (!firstVariant) {
          toast({
            title: "Error",
            description: "No variants available",
            variant: "destructive",
          })
          return
        }

        const result = await addToCart(product.id, firstVariant.color_id, firstVariant.size_id, 1)

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-800 mb-2">My Wishlist</h1>
              <p className="text-gray-600">{wishlistProducts.length} items saved</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-[#e94491] hover:bg-[#d63384]" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-[#e94491] hover:bg-[#d63384]" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-light text-gray-800 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love to your wishlist and they'll appear here for easy shopping later.
            </p>
            <Link href="/shop">
              <Button className="bg-[#e94491] hover:bg-[#d63384] text-white px-8 py-3 rounded-lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={true}
                onWishlistChange={handleWishlistChange}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex gap-6">
                  <Link href={`/product/${product.id}`}>
                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.images[0]?.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="text-lg font-medium text-gray-800 hover:text-[#e94491] transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        {product.category && (
                          <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        disabled={isPending}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-medium text-[#e94491]">${product.current_price.toFixed(2)}</span>
                      {product.discount_percentage > 0 && (
                        <span className="text-sm text-gray-400 line-through">${product.base_price.toFixed(2)}</span>
                      )}
                      {product.discount_percentage > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          -{product.discount_percentage}% OFF
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.status === "in_stock" 
                            ? "bg-green-500" 
                            : product.status === "low_stock" 
                            ? "bg-yellow-500" 
                            : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          product.status === "in_stock" 
                            ? "text-green-600" 
                            : product.status === "low_stock" 
                            ? "text-yellow-600" 
                            : "text-red-600"
                        }`}
                      >
                        {product.status === "in_stock" 
                          ? "In Stock" 
                          : product.status === "low_stock" 
                          ? "Low Stock" 
                          : "Out of Stock"}
                      </span>
                      {product.status === "low_stock" && (
                        <span className="text-sm text-gray-500">({product.total_stock} left)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={isPending || product.status === "out_of_stock"}
                        className="bg-[#e94491] hover:bg-[#d63384] text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isPending ? "Adding..." : product.status === "out_of_stock" ? "Out of Stock" : "Add to Cart"}
                      </Button>
                      <Link href={`/product/${product.id}`}>
                        <Button variant="outline" className="px-6 py-2 rounded-lg bg-transparent border-[#e94491] text-[#e94491] hover:bg-[#e94491] hover:text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}