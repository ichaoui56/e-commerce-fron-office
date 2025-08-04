import ShopPage from "@/components/shop-page"
import { getProductsWithDetails } from "@/lib/actions/products"
import { getWishlist } from "@/lib/actions/wishlist"

export default async function Shop() {
  const products = await getProductsWithDetails()
  const wishlist = await getWishlist()

  return <ShopPage products={products} wishlist={wishlist} />
}
