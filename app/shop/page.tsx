import ShopPage from "@/components/shop-page"
import { getProductsWithDetails } from "@/lib/actions/products"
import { getWishlistProductIds } from "@/lib/actions/wishlist"

export default async function Shop() {
  const products = await getProductsWithDetails()
  const wishlistProductIds = await getWishlistProductIds()

  return <ShopPage products={products} wishlist={wishlistProductIds} />
}