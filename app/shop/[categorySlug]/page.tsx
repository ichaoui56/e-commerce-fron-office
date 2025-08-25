import ShopPage from "@/components/shop-page"
import { getProductsByCategorySlug, getAllProductsByMainCategory } from "@/lib/actions/products"
import { getCategoryBySlug, getSubCategories } from "@/lib/actions/category"
import { getWishlistProductIds } from "@/lib/actions/wishlist"
import { notFound } from "next/navigation"

interface CategoryShopPageProps {
  params: Promise<{ categorySlug: string }>
}

export default async function CategoryShop({ params }: CategoryShopPageProps) {
  const { categorySlug } = await params
  
  // Get category details first
  const category = await getCategoryBySlug(categorySlug)
  
  if (!category) {
    notFound()
  }

  // Check if this is a main category that should include child products
  const isMainCategoryWithChildren = categorySlug === "pyjamas" || categorySlug === "lingerie"
  
  // Get products based on category type
  const products = isMainCategoryWithChildren 
    ? await getAllProductsByMainCategory(categorySlug)
    : await getProductsByCategorySlug(categorySlug)
  
  // Get wishlist product IDs
  const wishlistProductIds = await getWishlistProductIds()

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