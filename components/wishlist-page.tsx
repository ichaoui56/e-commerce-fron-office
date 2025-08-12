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
    }
  }

  const handleRemoveFromWishlist = (productId: string) => {
    startTransition(async () => {
      try {
        const result = await removeFromWishlist(productId)

        if (result.success) {
          setWishlistProducts((prev) => prev.filter((p) => p.id !== productId))
          toast({
            title: "Supprimé de la liste de souhaits",
            variant: "success",
          })
        } else {
          toast({
            title: "Erreur",
            description: "Échec de la suppression de la liste de souhaits",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Échec de la suppression de la liste de souhaits",
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
            title: "Erreur",
            description: "Aucun stock disponible",
            variant: "destructive",
          })
          return
        }
  
        const result = await addToCart(firstVariant.id, 1) // ✅ FIXED: use `variant.id` not `size_id`
  
        if (result.success) {
          toast({
            title: "Ajouté au panier",
            variant: "success",
          })
          window.dispatchEvent(new CustomEvent("cartUpdated")) // optional: sync cart badge
        } else {
          toast({
            title: "Erreur",
            description: "Échec de l'ajout au panier",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Échec de l'ajout au panier",
          variant: "destructive",
        })
      }
    })
  }
  

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-800 mb-2">Ma liste de souhaits</h1>
              <p className="text-gray-600">{wishlistProducts.length} articles enregistrés</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
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
            <h2 className="text-2xl font-light text-gray-800 mb-4">Votre liste de souhaits est vide</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Enregistrez les articles que vous aimez dans votre liste de souhaits et ils apparaîtront ici pour faciliter vos achats plus tard.
            </p>
            <Link href="/shop">
              <Button className="bg-[#e94491] hover:bg-[#d63384] text-white px-8 py-3 rounded-lg">
                Continuer vos achats
              </Button>
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <p className="text-sm text-gray-500 mt-1">{product.category?.name}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        disabled={isPending}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-medium text-[#e94491]">${product.current_price.toFixed(2)}</span>
                      {product.discount_percentage > 0 && (
                        <span className="text-sm text-gray-400 line-through">${product.base_price.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={isPending}
                        className="bg-[#e94491] hover:bg-[#d63384] text-white px-6 py-2 rounded-lg"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isPending ? "Ajout..." : "Ajouter au panier"}
                      </Button>
                      <Link href={`/product/${product.id}`}>
                        <Button variant="outline" className="hidden md:block px-6 py-2 rounded-lg bg-transparent">
                          Voir les détails
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
