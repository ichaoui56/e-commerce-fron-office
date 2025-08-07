// app/new-arrivals/page.tsx
import NewArrivals from "@/components/new-arrivals"
import { getFeaturedProducts } from "@/lib/actions/products"
import { getWishlistProductIds } from "@/lib/actions/wishlist"

export default async function NewArrivalsWrapper() {
  const [featuredProducts, wishlistProductIds] = await Promise.all([
    getFeaturedProducts(),
    getWishlistProductIds()
  ])

  return (
    <NewArrivals
      featuredProducts={featuredProducts}
      wishlistProductIds={wishlistProductIds}
    />
  )
}