import { getProductById } from "@/lib/actions/products"
import { getWishlistProductIds } from "@/lib/actions/wishlist"
import ProductDetailPage from "@/components/product-detail-page"
import { notFound } from "next/navigation"

interface ProductPageProps {
    params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProductById((await params).id)

    if (!product) {
        notFound()
    }

    const inWishlist = await getWishlistProductIds()

    return <ProductDetailPage product={product} isInWishlist={inWishlist.includes(product.id)} />
}

export async function generateMetadata({ params }: ProductPageProps) {
    const product = await getProductById((await params).id)

    if (!product) {
        return {
            title: 'Produit non trouvé',
        }
    }

    return {
        title: `${product.name} - Votre Boutique`,
        description: product.description || `Achetez ${product.name} à des prix avantageux`,
        openGraph: {
            title: product.name,
            description: product.description || `Achetez ${product.name} à des prix avantageux`,
            images: product.images.length > 0 ? [product.images[0].image_url] : [],
        },
    }
}