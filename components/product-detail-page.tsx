"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Heart, Minus, Plus, Facebook, Twitter, Instagram, Share } from "lucide-react"
import type { ProductWithDetails } from "@/lib/types"
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist"
import { addToCart } from "@/lib/actions/cart"
import { useToast } from "@/hooks/use-toast"

interface ProductDetailPageProps {
  product: ProductWithDetails
  isInWishlist: boolean
}

export default function ProductDetailPage({ product, isInWishlist }: ProductDetailPageProps) {
  const { toast } = useToast()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColorId, setSelectedColorId] = useState(product.colors[0]?.id || "")
  const [selectedSizeId, setSelectedSizeId] = useState(product.variants[0]?.size_id || "")
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(isInWishlist)
  const [isPending, startTransition] = useTransition()

  // Get images for selected color
  const colorImages = product.images.filter((img) => img.color_id === selectedColorId)
  const displayImages = colorImages.length > 0 ? colorImages : product.images

  // Get available stock for selected variant
  const selectedVariant = product.variants.find((v) => v.color_id === selectedColorId && v.size_id === selectedSizeId)
  const availableStock = selectedVariant?.stock_quantity || 0

  // Get available sizes for selected color
  const availableSizesForColor = product.variants
    .filter(v => v.color_id === selectedColorId)
    .map(v => v.size)
    .filter((size, index, self) => self.findIndex(s => s.id === size.id) === index)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const handleWishlistToggle = () => {
    startTransition(async () => {
      try {
        const result = isLiked ? await removeFromWishlist(product.id) : await addToWishlist(product.id)

        if (result.success) {
          setIsLiked(!isLiked)
          toast({
            title: !isLiked ? "Ajouté à la liste de souhaits" : "Retiré de la liste de souhaits",
            variant: "success",
          })
        } else {
          toast({
            title: "Erreur",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue",
          variant: "destructive",
        })
      }
    })
  }

  const handleAddToCart = () => {
    // Check if both color and size are selected
    if (!selectedColorId || !selectedSizeId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner la couleur et la taille",
        variant: "destructive",
      })
      return
    }

    // Get the specific variant for selected color AND size
    const selectedVariantForCart = product.variants.find(
      (variant) => variant.color_id === selectedColorId && variant.size_id === selectedSizeId
    )

    if (!selectedVariantForCart) {
      toast({
        title: "Erreur",
        description: "Variante sélectionnée non trouvée",
        variant: "destructive",
      })
      return
    }

    if (selectedVariantForCart.stock_quantity === 0) {
      toast({
        title: "Erreur",
        description: "La taille sélectionnée est en rupture de stock",
        variant: "destructive",
      })
      return
    }

    if (selectedVariantForCart.stock_quantity < quantity) {
      toast({
        title: "Erreur",
        description: "Stock insuffisant",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        // Use the correct variant ID (ProductSizeStock ID) for the selected color and size
        const result = await addToCart(selectedVariantForCart.id, quantity)

        if (result.success) {
          // Dispatch the cart update event to notify the navbar
          window.dispatchEvent(new CustomEvent("cartUpdated"))

          toast({
            title: result.message,
            variant: "success",
          })
        } else {
          toast({
            title: "Error",
            description: result.message,
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

  const handleColorChange = (colorId: string) => {
    setSelectedColorId(colorId)
    setCurrentImageIndex(0) // Reset to first image when color changes

    // Reset size selection if current size is not available for new color
    const availableSizes = product.variants
      .filter(v => v.color_id === colorId)
      .map(v => v.size.id)

    if (!availableSizes.includes(selectedSizeId)) {
      setSelectedSizeId(availableSizes[0] || "")
    }
    
    // Reset quantity to 1 when changing color
    setQuantity(1)
  }

  const handleSizeChange = (sizeId: string) => {
    setSelectedSizeId(sizeId)
    // Reset quantity to 1 when changing size
    setQuantity(1)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500">
              <ol className="list-none p-0 inline-flex space-x-2">
                <li>
                  <Link href="/" className="hover:text-[#e94491]">Accueil</Link>
                </li>
                <li>
                  <span>/</span>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-[#e94491]">Boutique</Link>
                </li>
                <li>
                  <span>/</span>
                </li>
                <li className="text-gray-800 font-medium">{product.name}</li>
              </ol>
            </nav>
        </div>
      </div>

      {/* Product Detail Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden group">
              {displayImages.length > 0 ? (
                <Image
                  src={displayImages[currentImageIndex]?.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span>Aucune image disponible</span>
                </div>
              )}

              {/* Navigation Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-800 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-800 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group ${index === currentImageIndex ? "ring-2 ring-[#e94491]" : ""
                      }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-light text-gray-800 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {renderStars(4)}
              </div>
              <span className="text-gray-500 text-sm">(120 Avis)</span>
            </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-light text-[#e94491]">{product.current_price.toFixed(2)} MAD</span>
                {product.discount_percentage > 0 && (
                  <span className="text-xl text-gray-400 line-through ml-3">{product.base_price.toFixed(2)} MAD</span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="text-gray-600 leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Couleur</h3>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColorId === color.id ? "border-gray-400 scale-110" : "border-gray-200"
                        }`}
                      style={{ backgroundColor: color.hex_code }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizesForColor.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-800">Taille :</h3>
                </div>
                <div className="flex items-center gap-3">
                  {availableSizesForColor.map((size) => {
                    const sizeVariant = product.variants.find(v =>
                      v.color_id === selectedColorId && v.size_id === size.id
                    )
                    const isOutOfStock = !sizeVariant || sizeVariant.stock_quantity === 0

                    return (
                      <button
                        key={size.id}
                        onClick={() => !isOutOfStock && handleSizeChange(size.id)}
                        disabled={isOutOfStock}
                        className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${selectedSizeId === size.id
                            ? "border-[#e94491] text-[#e94491]"
                            : isOutOfStock
                              ? "border-gray-200 text-gray-300 cursor-not-allowed"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                      >
                        {size.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Stock Info */}
            {selectedVariant && (
              <div className="mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold">Disponibilité :</span>
                  <span className={`ml-2 font-medium ${availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {availableStock > 0 ? `${availableStock} en stock` : 'Épuisé'}
                  </span>
                </p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:text-white hover:bg-[#e94491] transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-3 min-w-[60px] text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  className="p-4 hover:bg-[#e94491] hover:text-white transition-colors"
                  disabled={quantity >= availableStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={isPending || availableStock === 0 || !selectedVariant}
                className="flex-1 bg-transparent border-2 border-[#e94491] text-[#e94491] hover:bg-[#e94491] hover:text-white py-3 px-8 rounded-lg font-medium tracking-wider transition-all"
              >
                {isPending ? "AJOUT..." : "AJOUTER AU PANIER"}
              </Button>
            </div>

            {/* Wishlist and Compare */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleWishlistToggle}
                disabled={isPending}
                className="flex items-center gap-2 text-gray-600 hover:text-[#e94491] transition-colors"
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                <span>{isLiked ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}</span>
              </button>
            </div>

            {/* Category */}
            {product.category && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Catégorie :</span>
                  <Link
                    href={`/shop?category=${product.category.slug}`}
                    className="text-gray-800 hover:text-[#e94491] transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </div>
              </div>
            )}

            {/* Social Share */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Partager :</span>
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#3b5998] hover:text-white transition-all">
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1da1f2] hover:text-white transition-all">
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#e4405f] hover:text-white transition-all">
                    <Instagram className="h-4 w-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#bd081c] hover:text-white transition-all">
                    <Share className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}