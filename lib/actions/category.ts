"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Import types
import type { Category } from "@/lib/types"

// Enhanced Category type with subcategories
export interface CategoryWithSubcategories extends Category {
  subcategories: Category[]
}

// Get all categories with their subcategories
export const getCategoriesWithSubcategories = async (): Promise<CategoryWithSubcategories[]> => {
  try {
    // Get all parent categories (categories with noparentId)
    const parentCategories = await prisma.category.findMany({
      where: {
       parentId: null,
      },
      orderBy: {
        name: "asc",
      },
    })

    // Get all subcategories
    const subcategories = await prisma.category.findMany({
      where: {
       parentId: {
          not: null,
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    // Map parent categories with their subcategories
    const categoriesWithSubs: CategoryWithSubcategories[] = parentCategories.map((parent: Category) => ({
      id: parent.id,
      name: parent.name,
      slug: parent.slug,
     parentId: parent.parentId,
      subcategories: subcategories.filter((sub: Category) => sub.parentId === parent.id),
    }))

    return categoriesWithSubs
  } catch (error) {
    console.error("Get categories with subcategories error:", error)
    return []
  }
}

// Get all parent categories only
export const getParentCategories = async (): Promise<Category[]> => {
  try {
    const categories = await prisma.category.findMany({
      where: {
       parentId: null,
      },
      orderBy: {
        name: "asc",
      },
    })

    return categories
  } catch (error) {
    console.error("Get parent categories error:", error)
    return []
  }
}

// Get subcategories by parent category ID
export const getSubcategoriesByParentId = async (parentId: string): Promise<Category[]> => {
  try {
    const subcategories = await prisma.category.findMany({
      where: {
       parentId: parentId,
      },
      orderBy: {
        name: "asc",
      },
    })

    return subcategories
  } catch (error) {
    console.error("Get subcategories by parent ID error:", error)
    return []
  }
}

// Get category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        slug: slug,
      },
    })

    return category
  } catch (error) {
    console.error("Get category by slug error:", error)
    return null
  }
}

// Get all categories (flat structure)
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        {parentId: "asc" }, // Parent categories first
        { name: "asc" },
      ],
    })

    return categories
  } catch (error) {
    console.error("Get all categories error:", error)
    return []
  }
}

// Get category hierarchy (parent with all its children)
export const getCategoryHierarchy = async (categorySlug: string): Promise<{
  parent: Category | null
  subcategories: Category[]
} | null> => {
  try {
    const category = await getCategoryBySlug(categorySlug)
    
    if (!category) return null

    // If it's a parent category, get its subcategories
    if (!category.parentId) {
      const subcategories = await getSubcategoriesByParentId(category.id)
      return {
        parent: category,
        subcategories,
      }
    }

    // If it's a subcategory, get its parent and siblings
    const parent = await prisma.category.findUnique({
      where: {
        id: category.parentId,
      },
    })

    const subcategories = parent ? await getSubcategoriesByParentId(parent.id) : []

    return {
      parent,
      subcategories,
    }
  } catch (error) {
    console.error("Get category hierarchy error:", error)
    return null
  }
}