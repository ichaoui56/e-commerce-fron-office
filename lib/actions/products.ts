"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Import types from shared location
import type { ProductWithDetails } from "@/lib/types"

// Get top 4 featured products (where top_price is true)
export const getFeaturedProducts = async (): Promise<ProductWithDetails[]> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        top_price: true, // Only get products marked as top products
      },
      include: {
        category: true,
        productColors: {
          include: {
            color: true,
            productSizeStocks: {
              include: {
                size: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc", // Get the latest top products first
      },
      take: 4, // Limit to 4 products
    })

    return transformProductsData(products)
  } catch (error) {
    console.error("Get featured products error:", error)
    return []
  }
}

// Get all products with full details
export const getProductsWithDetails = async (): Promise<ProductWithDetails[]> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        productColors: {
          include: {
            color: true,
            productSizeStocks: {
              include: {
                size: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return transformProductsData(products)
  } catch (error) {
    console.error("Get products with details error:", error)
    return []
  }
}

// Get products by category
export const getProductsByCategory = async (categoryId: string): Promise<ProductWithDetails[]> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        category_id: categoryId,
      },
      include: {
        category: true,
        productColors: {
          include: {
            color: true,
            productSizeStocks: {
              include: {
                size: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return transformProductsData(products)
  } catch (error) {
    console.error("Get products by category error:", error)
    return []
  }
}

// Get products by category slug
export const getProductsByCategorySlug = async (categorySlug: string): Promise<ProductWithDetails[]> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      include: {
        category: true,
        productColors: {
          include: {
            color: true,
            productSizeStocks: {
              include: {
                size: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return transformProductsData(products)
  } catch (error) {
    console.error("Get products by category slug error:", error)
    return []
  }
}

// New method for getting all products from main category and its subcategories
export const getAllProductsByMainCategory = async (categorySlug: string): Promise<ProductWithDetails[]> => {
  try {
    // First get the main category
    const mainCategory = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        children: true // Get subcategories
      }
    })

    if (!mainCategory) {
      return []
    }

    // Define hardcoded mappings for specific main categories
    const mainCategoryMappings: Record<string, string[]> = {
      'lingerie': [
        'lingerie-nightie',
        'lingerie-nuisette-et-peignoir-satin', 
        'lingerie-sous-vetements',
        'lingerie-sportswear'
      ],
      'pyjamas': [
        'pyjamas-3-pieces',
        'pyjamas-body-et-colon',
        'pyjamas-haut-et-pantalon',
        'pyjamas-pyjama-long',
        'pyjamas-pyjama-short',
        'pyjamas-pyjamas-satin'
      ]
    }

    let categorySlugsList: string[] = [categorySlug]

    // Check if this is a main category with hardcoded subcategories
    if (mainCategoryMappings[mainCategory.name.toLowerCase()]) {
      categorySlugsList = [
        categorySlug, 
        ...mainCategoryMappings[mainCategory.name.toLowerCase()]
      ]
    } else if (mainCategory.children && mainCategory.children.length > 0) {
      // Dynamic approach: include all database subcategories
      const subCategorySlugs = mainCategory.children.map(child => child.slug)
      categorySlugsList = [categorySlug, ...subCategorySlugs]
    }

    // Fetch products from all relevant categories
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: {
            in: categorySlugsList
          }
        }
      },
      include: {
        category: true,
        productColors: {
          include: {
            color: true,
            productSizeStocks: {
              include: {
                size: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc"
      }
    })

    // Remove duplicates based on product ID (in case a product appears in multiple categories)
    const uniqueProducts = products.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    )

    return transformProductsData(uniqueProducts)
  } catch (error) {
    console.error('Error fetching products by main category:', error)
    return []
  }
}

// Alternative method for fetching products with subcategory pattern matching
export const getProductsByMainCategoryPattern = async (categorySlug: string): Promise<ProductWithDetails[]> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          // Direct category match
          {
            category: {
              slug: categorySlug
            }
          },
          // Subcategory pattern match (e.g., lingerie-*)
          {
            category: {
              slug: {
                startsWith: `${categorySlug}-`
              }
            }
          }
        ]
      },
      include: {
        category: true,
        productColors: {
          include: {
            color: true,
            productSizeStocks: {
              include: {
                size: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc"
      }
    })

    return transformProductsData(products)
  } catch (error) {
    console.error('Error fetching products by category pattern:', error)
    return []
  }
}

// Get latest products (New Arrivals)
export const getLatestProducts = async (limit: number = 8): Promise<ProductWithDetails[]> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        productColors: {
          include: {
            color: true,
            productSizeStocks: {
              include: {
                size: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    })

    return transformProductsData(products)
  } catch (error) {
    console.error("Get latest products error:", error)
    return []
  }
}

// Get products on sale (with discount)
export const getSaleProducts = async (): Promise<ProductWithDetails[]> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        solde_percentage: {
          gt: 0, // Products with discount greater than 0
        },
      },
      include: {
        category: true,
        productColors: {
          include: {
            color: true,
            productSizeStocks: {
              include: {
                size: true,
              },
            },
          },
        },
      },
      orderBy: {
        solde_percentage: "desc", // Order by highest discount first
      },
    })

    return transformProductsData(products)
  } catch (error) {
    console.error("Get sale products error:", error)
    return []
  }
}

// Get single product by ID
export const getProductById = async (productId: string): Promise<ProductWithDetails | null> => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        productColors: {
          include: {
            color: true,
            productSizeStocks: {
              include: {
                size: true,
              },
            },
          },
        },
      },
    })

    if (!product) return null

    const transformedProducts = transformProductsData([product])
    return transformedProducts[0] || null
  } catch (error) {
    console.error("Get product by ID error:", error)
    return null
  }
}

// Transform products data to match the expected structure
const transformProductsData = (products: any[]): ProductWithDetails[] => {
  return products.map((product) => {
    // Extract colors from productColors
    const colors = product.productColors.map((pc: any) => ({
      id: pc.color.id,
      name: pc.color.name,
      hex_code: pc.color.hex || "#000000",
    }))

    // Extract images from productColors (using image_url as primary image)
    const images = product.productColors
      .filter((pc: any) => pc.image_url)
      .map((pc: any, index: number) => ({
        id: pc.id,
        color_id: pc.color_id,
        image_url: pc.image_url,
        is_primary: index === 0, // First image is primary
      }))

    // Extract variants from productSizeStocks
    const variants = product.productColors.flatMap((pc: any) =>
      pc.productSizeStocks.map((pss: any) => ({
        id: pss.id,
        color_id: pc.color_id,
        size_id: pss.size_id,
        stock_quantity: pss.stock,
        price: Number(pss.price),
        size: {
          id: pss.size.id,
          label: pss.size.label,
        },
        color: {
          id: pc.color.id,
          name: pc.color.name,
          hex: pc.color.hex,
        },
      }))
    )

    const sizes = product.productColors.flatMap((pc: any) =>
      pc.productSizeStocks.map((pss: any) => ({
        id: pss.size_id,
        label: pss.size.label,
      }))
    )

    // Extract unique sizes from variants
    const uniqueSizes = Array.from(
      new Map(variants.map((v: any) => [v.size.id, v.size])).values()
    )

    // Calculate pricing
    const basePrices = variants.map((v: any) => v.price).filter((price: any) => price > 0)
    const basePrice = basePrices.length > 0 ? Math.min(...basePrices) : 0
    const discountPercentage = product.solde_percentage || 0
    const currentPrice = discountPercentage > 0 ? basePrice * (1 - discountPercentage / 100) : basePrice

    // Calculate total stock
    const totalStock = variants.reduce((total : number, variant: any) => total + variant.stock_quantity, 0)

    // Determine stock status
    let status: "in_stock" | "low_stock" | "out_of_stock" = "out_of_stock"
    if (totalStock === 0) {
      status = "out_of_stock"
    } else if (totalStock < 20) {
      status = "low_stock"
    } else {
      status = "in_stock"
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      solde_percentage: product.solde_percentage,
      top_price: product.top_price,
      created_at: product.created_at,
      updated_at: product.updated_at,
      category: product.category,
      colors: colors,
      images: images,
      variants: variants,
      sizes: sizes, // Add the sizes array
      base_price: basePrice,
      current_price: currentPrice,
      discount_percentage: discountPercentage,
      is_featured: product.top_price, // Using top_price as featured flag
      total_stock: totalStock,
      status: status,
    }
  })
}