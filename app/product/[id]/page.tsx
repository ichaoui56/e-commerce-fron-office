import { getProductById } from "@/lib/actions/products"
import { getWishlistProductIds } from "@/lib/actions/wishlist"
import ProductDetailPage from "@/components/product-detail-page"
import { notFound } from "next/navigation"

interface ProductPageProps {
    params: {
        id: string
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProductById(params.id)

    if (!product) {
        notFound()
    }

    const inWishlist = await getWishlistProductIds()

    return <ProductDetailPage product={product} isInWishlist={inWishlist.includes(product.id)} />
}

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