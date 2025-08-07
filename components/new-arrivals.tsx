"use client"

import { ProductWithDetails } from "@/lib/types"
import ProductCard from "./product-card"


interface NewArrivalsProps {
  featuredProducts: ProductWithDetails[]
  wishlistProductIds: string[]
}

export default function NewArrivals({
  featuredProducts,
  wishlistProductIds,
}: NewArrivalsProps) {
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-4">New Arrivals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our latest collection of premium fashion pieces, carefully curated for the modern lifestyle.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
            <p className="text-sm text-gray-400 mt-2">
              Make sure you have products with "top_price" set to true in your database.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-800 mb-4">New Arrivals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our latest collection of premium fashion pieces, carefully curated for the modern lifestyle.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Showing {featuredProducts.length} featured products
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => {
            const isInWishlist = wishlistProductIds.includes(product.id)
            return <ProductCard key={product.id} product={product} isInWishlist={isInWishlist} />
          })}
        </div>
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center px-8 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  )
}
