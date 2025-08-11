import ShopPage from "@/components/shop-page"
import { getProductsByCategorySlug } from "@/lib/actions/products"
import { getCategoryBySlug, getSubCategories } from "@/lib/actions/category"
import { getWishlistProductIds } from "@/lib/actions/wishlist"
import { notFound } from "next/navigation"

interface CategoryShopPageProps {
  params: Promise<{ categorySlug: string }>
}

export default async function CategoryShop({ params }: CategoryShopPageProps) {
  const { categorySlug } = await params
  
  // Get products for this category
  const products = await getProductsByCategorySlug(categorySlug)
  
  // Get wishlist product IDs
  const wishlistProductIds = await getWishlistProductIds()
  
  // Get category details
  const category = await getCategoryBySlug(categorySlug)
  
  if (!category) {
    notFound()
  }

  // Get subcategories if they exist
  const subCategories = await getSubCategories(category.id)

  return (
    <ShopPage 
      products={products} 
      category={category}
      subCategories={subCategories}
      wishlist={wishlistProductIds}
    />
  )
}