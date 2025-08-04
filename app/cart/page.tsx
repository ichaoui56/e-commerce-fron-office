import ShoppingCartPage from "@/components/shopping-cart-page"
import { getCartWithDetails } from "@/lib/actions/cart"

export default async function Cart() {
  const cartItems = await getCartWithDetails()

  return <ShoppingCartPage initialCartItems={cartItems} />
}
