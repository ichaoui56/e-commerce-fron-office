import WishlistPage from "@/components/wishlist-page"
import { getWishlistWithDetails } from "@/lib/actions/wishlist"

export default async function Wishlist() {
  const products = await getWishlistWithDetails()

  return <WishlistPage products={products} />
}
