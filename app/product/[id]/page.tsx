import { getProductById } from "@/lib/actions/products"
import { isInWishlist } from "@/lib/actions/wishlist"
import ProductDetailPage from "@/components/product-detail-page"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Fetch product data
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  // Check if product is in wishlist
  const inWishlist = await isInWishlist(params.id)

  return <ProductDetailPage product={product} isInWishlist={inWishlist} />
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} - Your Store`,
    description: product.description || `Shop ${product.name} at great prices`,
    openGraph: {
      title: product.name,
      description: product.description || `Shop ${product.name} at great prices`,
      images: product.images.length > 0 ? [product.images[0].image_url] : [],
    },
  }
}