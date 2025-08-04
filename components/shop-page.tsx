"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, ChevronDown, Grid3X3, List, Heart, ShoppingCart, Star, SlidersHorizontal } from "lucide-react"
import ProductCard from "./product-card"
import Link from "next/link"
import type { ProductWithDetails } from "@/lib/types"

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  parent?: Category | null
  children?: Category[]
}

interface ShopPageProps {
  products: ProductWithDetails[]
  wishlist: string[]
  category?: Category | null
  subCategories?: Category[]
}

interface FilterState {
  categories: string[]
  sizes: string[]
  colors: string[]
  brands: string[]
  priceRange: [number, number]
}

export default function ShopPage({ products, wishlist, category, subCategories = [] }: ShopPageProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("most-popular")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    brands: [],
    priceRange: [0, 750],
  })
  const [tempFilters, setTempFilters] = useState<FilterState>(filters)

  // Get unique categories, brands, etc. from products
  const categories = Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean)))
  const sizes = Array.from(new Set(products.flatMap((p) => p.sizes?.map((s) => s.label) || [])))
  const colors = Array.from(
    new Set(products.flatMap((p) => p.colors?.map((c) => ({ name: c.name, value: c.hex_code })) || [])),
  )
  const brands = ["Next", "River Island", "Geox", "New Balance", "UGG", "F&F", "Nike"] // Mock brands

  // Filter products based on current filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesPrice =
      product.current_price >= filters.priceRange[0] && product.current_price <= filters.priceRange[1]
    const matchesCategory = filters.categories.length === 0 || (product.category?.name && filters.categories.includes(product.category.name))
    const matchesSize =
      filters.sizes.length === 0 || (product.sizes && filters.sizes.some((size) => product.sizes.some((s) => s.label === size)))
    const matchesColor =
      filters.colors.length === 0 || (product.colors && filters.colors.some((color) => product.colors.some((c) => c.hex_code === color)))
    const matchesBrand = filters.brands.length === 0 || filters.brands.includes("Next") // Mock brand matching

    return matchesSearch && matchesPrice && matchesCategory && matchesSize && matchesColor && matchesBrand
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.current_price - b.current_price
      case "price-high":
        return b.current_price - a.current_price
      case "rating":
        return 5 - 4 // Mock rating sort
      case "newest":
        return b.id.localeCompare(a.id)
      default:
        return 0
    }
  })

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showFilters && !target.closest("[data-filters-sidebar]") && !target.closest("[data-filters-trigger]")) {
        setShowFilters(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [showFilters])

  // Prevent body scroll when filters are open
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showFilters])

  const updateTempFilter = (type: keyof FilterState, value: any) => {
    setTempFilters((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const applyFilters = () => {
    setFilters(tempFilters)
    setShowFilters(false)
  }

  const clearAllFilters = () => {
    const resetFilters = {
      categories: [],
      sizes: [],
      colors: [],
      brands: [],
      priceRange: [0, 750] as [number, number],
    }
    setTempFilters(resetFilters)
    setFilters(resetFilters)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  // Generate breadcrumb path
  const generateBreadcrumb = () => {
    const breadcrumbItems = [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" }
    ]

    if (category) {
      // If category has a parent, add parent first
      if (category.parent) {
        breadcrumbItems.push({
          label: category.parent.name,
          href: `/shop/${category.parent.slug}`
        })
      }
      
      // Add current category
      breadcrumbItems.push({
        label: category.name,
        href: `/shop/${category.slug}`,
      })
    } else {
      breadcrumbItems.push({ label: "All Products", href: "/shop" })
    }

    return breadcrumbItems
  }

  const breadcrumbItems = generateBreadcrumb()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-3 text-sm mb-6">
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {item.href ? (
                  <Link href={item.href} className="text-gray-500 hover:text-[#e94491] transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#e94491] font-medium">
                    {item.label}
                  </span>
                )}
                {index < breadcrumbItems.length - 1 && (
                  <span className="text-gray-300">›</span>
                )}
              </div>
            ))}
          </nav>

          {/* Category Header */}
          {category && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h1>
              {category.parent && (
                <p className="text-gray-600">
                  Category in <Link href={`/shop/${category.parent.slug}`} className="text-[#e94491] hover:underline">{category.parent.name}</Link>
                </p>
              )}
            </div>
          )}

          {/* Subcategories */}
          {subCategories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Shop by Category</h3>
              <div className="flex flex-wrap gap-3">
                {subCategories.map((subCategory) => (
                  <Link
                    key={subCategory.id}
                    href={`/shop/${subCategory.slug}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-[#e94491] hover:text-[#e94491] transition-colors text-sm font-medium"
                  >
                    {subCategory.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Side - Filters Button */}
            <div className="flex items-center gap-4">
              <button
                data-filters-trigger
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#e94491] hover:text-[#e94491] transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="font-medium">FILTERS</span>
              </button>

              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{sortedProducts.length}</span> of{" "}
                <span className="font-medium">{products.length}</span> Products
                {category && <span className="ml-1">in {category.name}</span>}
              </div>
            </div>

            {/* Right Side - Sort and View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#e94491] focus:outline-none"
                >
                  <option value="most-popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-[#e94491] text-white" : "text-gray-600 hover:text-[#e94491]"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-[#e94491] text-white" : "text-gray-600 hover:text-[#e94491]"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} isInWishlist={wishlist.includes(product.id)} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300 flex"
              >
                {/* Product Image */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={product.images?.[0]?.image_url || "/placeholder.svg"}
                    alt={product.name || "Product"}
                    className="w-full h-full object-cover"
                  />

                  {/* Product Tag */}
                  {product.discount_percentage > 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white rounded bg-red-500">
                      -{product.discount_percentage}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex-1">
                    {/* Category */}
                    <p className="text-xs text-gray-500 mb-1">{product.category?.name || "Uncategorized"}</p>

                    {/* Product Name */}
                    <h3 className="text-sm sm:text-base line-clamp-2 font-medium text-gray-800 mb-2">{product.name}</h3>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base sm:text-lg font-medium text-[#e94491]">
                        ${product.current_price?.toFixed(2) || "0.00"}
                      </span>
                      {product.discount_percentage > 0 && (
                        <span className="text-sm text-gray-400 line-through">${product.base_price?.toFixed(2) || "0.00"}</span>
                      )}
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">{renderStars(4)}</div>
                      <span className="text-xs text-gray-500">(4)</span>
                    </div>

                    {/* Color Swatches */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        {product.colors.slice(0, 3).map((color, index) => (
                          <button
                            key={index}
                            className="w-4 h-4 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: color.hex_code }}
                          />
                        ))}
                        {product.colors.length > 3 && (
                          <span className="text-xs text-gray-500">+{product.colors.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* List View Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button className="bg-[#e94491] hover:bg-[#d63384] text-white px-4 py-2 text-sm rounded-lg flex-1 sm:flex-none">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">ADD TO CART</span>
                      <span className="sm:hidden">ADD</span>
                    </Button>
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:border-[#e94491] hover:text-[#e94491] transition-colors text-sm flex-1 sm:flex-none">
                      <Heart className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Wishlist</span>
                      <span className="sm:hidden">Like</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Products Found */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found {category ? `in ${category.name}` : ""} matching your filters.
            </p>
            <Button onClick={clearAllFilters} className="mt-4 bg-[#e94491] hover:bg-[#d63384] text-white">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {sortedProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-2 border-gray-300 hover:border-[#e94491] hover:text-[#e94491] bg-transparent px-8 py-3 rounded-lg font-medium"
            >
              MORE PRODUCTS
            </Button>
          </div>
        )}
      </div>

      {/* Filter Sidebar - keeping your existing filter sidebar code */}
      {showFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowFilters(false)}
            style={{ top: 0 }}
          />

          {/* Sidebar */}
          <div
            data-filters-sidebar
            className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out max-w-[90vw]"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <h3 className="text-lg font-semibold text-gray-800">FILTERS</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-[#e94491] hover:text-[#d63384] transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Category Filter */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Category</h4>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="space-y-3">
                    {categories.filter((c): c is string => !!c).map((categoryName) => (
                      <div key={categoryName} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={categoryName}
                            checked={tempFilters.categories.includes(categoryName)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateTempFilter("categories", [...tempFilters.categories, categoryName])
                              } else {
                                updateTempFilter(
                                  "categories",
                                  tempFilters.categories.filter((c) => c !== categoryName),
                                )
                              }
                            }}
                          />
                          <label htmlFor={categoryName} className="text-sm text-gray-700 cursor-pointer">
                            {categoryName}
                          </label>
                        </div>
                        <span className="text-xs text-gray-500">
                          {products.filter((p) => p.category?.name === categoryName).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Size</h4>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="space-y-3">
                    {sizes.map((size) => (
                      <div key={size} className="flex items-center gap-3">
                        <Checkbox
                          id={size}
                          checked={tempFilters.sizes.includes(size)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateTempFilter("sizes", [...tempFilters.sizes, size])
                            } else {
                              updateTempFilter(
                                "sizes",
                                tempFilters.sizes.filter((s) => s !== size),
                              )
                            }
                          }}
                        />
                        <label htmlFor={size} className="text-sm text-gray-700 cursor-pointer">
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Colour</h4>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (tempFilters.colors.includes(color.value)) {
                            updateTempFilter(
                              "colors",
                              tempFilters.colors.filter((c) => c !== color.value),
                            )
                          } else {
                            updateTempFilter("colors", [...tempFilters.colors, color.value])
                          }
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          tempFilters.colors.includes(color.value)
                            ? "border-gray-800 scale-110 ring-2 ring-[#e94491]"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Brand</h4>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="space-y-3">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center gap-3">
                        <Checkbox
                          id={brand}
                          checked={tempFilters.brands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateTempFilter("brands", [...tempFilters.brands, brand])
                            } else {
                              updateTempFilter(
                                "brands",
                                tempFilters.brands.filter((b) => b !== brand),
                              )
                            }
                          }}
                        />
                        <label htmlFor={brand} className="text-sm text-gray-700 cursor-pointer">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Price</h4>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Price Range: ${tempFilters.priceRange[0]} - ${tempFilters.priceRange[1]}
                    </div>
                    <div className="relative px-2">
                      <input
                        type="range"
                        min="0"
                        max="750"
                        value={tempFilters.priceRange[1]}
                        onChange={(e) =>
                          updateTempFilter("priceRange", [tempFilters.priceRange[0], Number.parseInt(e.target.value)])
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 px-2">
                      <span>$0</span>
                      <span>$750</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowFilters(false)}
                    variant="outline"
                    className="flex-1 border-gray-300 hover:border-gray-400"
                  >
                    Cancel
                  </Button>
                  <Button onClick={applyFilters} className="flex-1 bg-[#e94491] hover:bg-[#d63384] text-white">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}