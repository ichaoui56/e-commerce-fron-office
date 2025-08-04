"use client"

import {
  Search,
  Heart,
  ShoppingCart,
  ChevronDown,
  Lightbulb,
  X,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { getCartWithDetails, getCartCount } from "@/lib/actions/cart"
import { getWishlistCount } from "@/lib/actions/wishlist"
import { removeFromCart } from "@/lib/actions/cart"
import { useToast } from "@/hooks/use-toast"
import type { CartItemWithDetails } from "@/lib/types"

const clothingCategories = [
  "Daily offers",
  "Gift Ideas",
  "Women's Clothing",
  "Men's Clothing",
  "Accessories",
  "Shoes & Footwear",
  "Bags & Purses",
  "Jewelry & Watches",
  "Sportswear",
  "Underwear & Lingerie",
  "Kids & Baby",
  "Plus Size",
]

const shopCategories = [
  {
    name: "ROBES",
    subcategories: [],
  },
  {
    name: "PYJAMAS",
    subcategories: ["Haut + Pantalon", "Pyjama Short", "3 PIECES", "Pyjama Long", "Pyjamas Satin", "Body & Colon"],
  },
  {
    name: "SANDALES",
    subcategories: [],
  },
  {
    name: "LINGERIE",
    subcategories: ["NUISETTE ET PEIGNOIR SATIN", "NIGHTIE", "SOUS VETEMENTS", "SPORTSWEAR"],
  },
  {
    name: "SERVIETTES",
    subcategories: [],
  },
  {
    name: "BURKINI",
    subcategories: [],
  },
  {
    name: "HOMME",
    subcategories: [],
  },
  {
    name: "KIDS",
    subcategories: [],
  },
  {
    name: "SOLDES",
    subcategories: [],
  },
  {
    name: "ACCESSOIRES",
    subcategories: [],
  },
]

const mainMenuItems = [
  { name: "HOME", href: "/", hasSubmenu: false },
  { name: "SHOP", href: "/shop", hasSubmenu: true, submenu: shopCategories },
  { name: "FAQ", href: "/faq", hasSubmenu: false },
  { name: "ABOUT", href: "/about", hasSubmenu: false },
  { name: "CONTACT", href: "/contact", hasSubmenu: false },
]

export default function Navbar() {
  const pathname = usePathname()
  const { toast } = useToast()

  // Separate states for main and sticky navigation
  const [showMainCategories, setShowMainCategories] = useState(false)
  const [showStickyCategories, setShowStickyCategories] = useState(false)
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const [showShopDropdown, setShowShopDropdown] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [activeTab, setActiveTab] = useState<"menu" | "categories">("menu")
  const [expandedMenuItem, setExpandedMenuItem] = useState<string | null>(null)
  const [expandedSubMenus, setExpandedSubMenus] = useState<Set<string>>(new Set())
  const [isClosing, setIsClosing] = useState(false)

  // Real-time data states
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cartData, cartCountData, wishlistCountData] = await Promise.all([
          getCartWithDetails(),
          getCartCount(),
          getWishlistCount(),
        ])
        setCartItems(cartData)
        setCartCount(cartCountData)
        setWishlistCount(wishlistCountData)
      } catch (error) {
        console.error("Failed to load navbar data:", error)
      }
    }
    loadData()
  }, [])

  // Refresh data when pathname changes
  useEffect(() => {
    const refreshData = async () => {
      try {
        const [cartData, cartCountData, wishlistCountData] = await Promise.all([
          getCartWithDetails(),
          getCartCount(),
          getWishlistCount(),
        ])
        setCartItems(cartData)
        setCartCount(cartCountData)
        setWishlistCount(wishlistCountData)
      } catch (error) {
        console.error("Failed to refresh navbar data:", error)
      }
    }
    refreshData()
  }, [pathname])

  // Listen for custom events to update counts in real-time
  useEffect(() => {
    const handleWishlistUpdate = (event: CustomEvent) => {
      setWishlistCount(event.detail.count)
    }

    const handleCartUpdate = async () => {
      try {
        const [cartData, cartCountData] = await Promise.all([getCartWithDetails(), getCartCount()])
        setCartItems(cartData)
        setCartCount(cartCountData)
      } catch (error) {
        console.error("Failed to update cart data:", error)
      }
    }

    window.addEventListener("wishlistUpdated", handleWishlistUpdate as EventListener)
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate as EventListener)
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  // Check if current path is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const handleScroll = () => {
      const newScrolled = window.scrollY > 500
      setIsScrolled(newScrolled)

      // Close dropdowns when scroll state changes
      if (newScrolled) {
        setShowMainCategories(false)
        if (showShopDropdown) {
          setShowShopDropdown(false)
          setHoveredCategory(null)
        }
      } else {
        setShowStickyCategories(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showShopDropdown])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest("[data-cart-dropdown]") && !target.closest("[data-remove-item]")) {
        setShowCartDropdown(false)
      }
    }
    if (showCartDropdown) {
      document.addEventListener("click", handleClickOutside)
    }
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [showCartDropdown])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (showMobileSidebar) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showMobileSidebar])

  // Main navigation category handlers
  const handleMainCategoriesMouseEnter = () => {
    if (!isScrolled) {
      setShowMainCategories(true)
    }
  }

  const handleMainCategoriesMouseLeave = () => {
    if (!isScrolled) {
      setShowMainCategories(false)
    }
  }

  // Sticky navigation category handlers
  const handleStickyCategoriesMouseEnter = () => {
    if (isScrolled) {
      setShowStickyCategories(true)
    }
  }

  const handleStickyCategoriesMouseLeave = () => {
    if (isScrolled) {
      setShowStickyCategories(false)
    }
  }

  const handleStickyShopMouseEnter = () => {
    if (isScrolled) {
      setShowShopDropdown(true)
    }
  }

  const handleStickyShopMouseLeave = () => {
    if (isScrolled) {
      setShowShopDropdown(false)
      setHoveredCategory(null)
    }
  }

  const handleShopMouseEnter = () => {
    if (!isScrolled) {
      setShowShopDropdown(true)
    }
  }

  const handleShopMouseLeave = () => {
    if (!isScrolled) {
      setShowShopDropdown(false)
      setHoveredCategory(null)
    }
  }

  const toggleMenuItem = (itemName: string) => {
    setExpandedMenuItem(expandedMenuItem === itemName ? null : itemName)
  }

  const toggleSubMenuItem = (subItemName: string) => {
    const newExpandedSubMenus = new Set(expandedSubMenus)
    if (newExpandedSubMenus.has(subItemName)) {
      newExpandedSubMenus.delete(subItemName)
    } else {
      newExpandedSubMenus.add(subItemName)
    }
    setExpandedSubMenus(newExpandedSubMenus)
  }

  const openSidebar = () => {
    setIsClosing(false)
    setShowMobileSidebar(true)
  }

  const closeSidebar = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowMobileSidebar(false)
      setIsClosing(false)
      setExpandedMenuItem(null)
      setExpandedSubMenus(new Set())
      setActiveTab("menu")
    }, 600)
  }

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      const result = await removeFromCart(itemId)
      if (result.success) {
        // Update local state
        setCartItems((prev) => prev.filter((item) => item.id !== itemId))
        setCartCount((prev) => Math.max(0, prev - 1))
        toast({
          title: result.message,
          variant: "success",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.base_price * item.quantity, 0)
  }

  return (
    <>
      <header className="bg-white text-gray-800 relative z-50">
        <div className="border-b">
          <div className="container mx-auto px-4 flex justify-between items-center py-6">
            {/* Mobile Menu Button with Enhanced Animation */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={openSidebar}
                className="hover:bg-gray-100 w-12 h-12 p-3 relative overflow-hidden group"
              >
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div className="absolute inset-0 flex flex-col justify-center items-center gap-1.5">
                    <div
                      className={`w-6 h-0.5 bg-gray-800 transition-all duration-700 ease-in-out transform origin-center ${
                        showMobileSidebar && !isClosing
                          ? "rotate-45 translate-y-2 bg-[#e94491]"
                          : "rotate-0 translate-y-0"
                      }`}
                    />
                    <div
                      className={`w-6 h-0.5 bg-gray-800 transition-all duration-500 ease-in-out ${
                        showMobileSidebar && !isClosing ? "opacity-0 scale-0" : "opacity-100 scale-100"
                      }`}
                    />
                    <div
                      className={`w-6 h-0.5 bg-gray-800 transition-all duration-700 ease-in-out transform origin-center ${
                        showMobileSidebar && !isClosing
                          ? "-rotate-45 -translate-y-2 bg-[#e94491]"
                          : "rotate-0 translate-y-0"
                      }`}
                    />
                  </div>
                </div>
              </Button>
            </div>

            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/shahine-logo.png" alt="Shahine Logo" width={120} height={40} className="object-contain" />
              </Link>
            </div>

            {/* Desktop Search - Hidden on Mobile */}
            <div className="hidden lg:flex flex-1 justify-center">
              <div className="relative w-full max-w-md">
                <Input
                  type="search"
                  placeholder="Search product ..."
                  className="pr-10 border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Wishlist and Cart - Always Visible */}
            <div className="flex items-center gap-4 lg:gap-6">
              <Link
                href="/wishlist"
                className="relative flex items-center gap-2 hover:text-[#e94491] transition-colors"
              >
                <Heart className="h-6 w-6" />
                <span className="hidden sm:inline">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#e94491] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <div className="relative" data-cart-dropdown>
                <button
                  onClick={() => setShowCartDropdown(!showCartDropdown)}
                  className="flex items-center gap-2 hover:text-[#e94491] transition-colors cursor-pointer"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#e94491] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Cart Dropdown */}
                {showCartDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in slide-in-from-top-2 duration-200">
                    {cartItems.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 mb-4">No products selected</p>
                        <Link href="/shop">
                          <Button className="bg-[#e94491] hover:bg-[#d63384] text-white px-6 py-2 rounded-xl">
                            Continue Shopping
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 max-h-80 overflow-y-auto">
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image.image_url || "/placeholder.svg"}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-800 mb-1 line-clamp-1">
                                  {item.product.name}
                                </h4>
                                <p className="text-xs text-gray-500 mb-1">
                                  {item.color.name} • {item.size.label}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} x ${item.product.base_price.toFixed(2)}
                                </p>
                              </div>
                              <button
                                data-remove-item
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleRemoveFromCart(item.id)
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-gray-800">TOTAL</span>
                            <span className="text-lg font-medium text-[#e94491]">${getTotalPrice().toFixed(2)}</span>
                          </div>
                          <div className="flex gap-3">
                            <Link href="/cart" className="flex-1">
                              <Button
                                variant="outline"
                                className="w-full border-2 border-[#e94491] text-[#e94491] hover:bg-[#e94491] hover:text-white rounded-xl bg-transparent"
                                onClick={() => setShowCartDropdown(false)}
                              >
                                View Cart
                              </Button>
                            </Link>
                            <Link href="/checkout" className="flex-1">
                              <Button
                                variant="outline"
                                className="w-full border-2 border-[#e94491] text-[#e94491] hover:bg-[#e94491] hover:text-white rounded-xl bg-transparent"
                                onClick={() => setShowCartDropdown(false)}
                              >
                                Checkout →
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Second Navigation Section - Hidden on Mobile */}
          <div className="border-b relative hidden lg:block">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <nav className="flex-1 flex items-center justify-between gap-8">
                <div
                  className="relative group"
                  onMouseEnter={handleMainCategoriesMouseEnter}
                  onMouseLeave={handleMainCategoriesMouseLeave}
                >
                  <button
                    className={`flex items-center gap-2 w-[15rem] p-4 border-b-2 border-transparent font-semibold transition-colors ${
                      showMainCategories ? "bg-[#e94491]" : ""
                    }`}
                  >
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <div className="absolute inset-0 flex flex-col justify-center items-center gap-1">
                        <div
                          className={`w-4 h-0.5 bg-current transition-all duration-300 ${
                            showMainCategories ? "rotate-45 translate-y-1.5 text-white" : ""
                          }`}
                        ></div>
                        <div
                          className={`w-4 h-0.5 bg-current transition-all duration-300 ${
                            showMainCategories ? "opacity-0" : ""
                          }`}
                        ></div>
                        <div
                          className={`w-4 h-0.5 bg-current transition-all duration-300 ${
                            showMainCategories ? "-rotate-45 -translate-y-1.5 text-white" : ""
                          }`}
                        ></div>
                      </div>
                    </div>
                    <span className={`transition-colors duration-300 ${showMainCategories ? "text-white" : ""}`}>
                      Browse Categories
                    </span>
                  </button>

                  {showMainCategories && !isScrolled && (
                    <div className="absolute top-full left-0 w-60 bg-white shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300 rounded-lg overflow-hidden">
                      <div className="max-h-96 overflow-y-auto">
                        {clothingCategories.map((category, index) => (
                          <Link
                            key={index}
                            href="#"
                            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e94491] border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-8">
                  <Link
                    href="/"
                    className={`flex items-center gap-1 py-6 border-b-2 font-semibold transition-colors ${
                      isActiveLink("/")
                        ? "border-[#e94491] text-[#e94491]"
                        : "border-transparent hover:border-[#e94491] hover:text-[#e94491]"
                    }`}
                  >
                    Home
                  </Link>

                  <div className="relative" onMouseEnter={handleShopMouseEnter} onMouseLeave={handleShopMouseLeave}>
                    <Link
                      href="/shop"
                      className={`flex items-center gap-1 py-6 border-b-2 font-semibold transition-colors ${
                        isActiveLink("/shop")
                          ? "border-[#e94491] text-[#e94491]"
                          : "border-transparent hover:border-[#e94491] hover:text-[#e94491]"
                      }`}
                    >
                      Shop <ChevronDown className="h-4 w-4" />
                    </Link>

                    {showShopDropdown && !isScrolled && (
                      <div className="absolute top-full left-0 w-[600px] bg-white shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300 rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-[#e94491] to-[#f472b6] text-white px-6 py-4">
                          <h3 className="text-lg font-semibold">Shop Categories</h3>
                          <p className="text-sm opacity-90">Discover our amazing collection</p>
                        </div>
                        <div className="flex">
                          <div className="w-1/2 p-4 border-r border-gray-200">
                            <div className="grid grid-cols-2 gap-2">
                              {shopCategories.map((category, index) => (
                                <div
                                  key={index}
                                  className={`relative group cursor-pointer`}
                                  onMouseEnter={() => setHoveredCategory(category.name)}
                                >
                                  <Link
                                    href={`/shop/${category.name.toLowerCase()}`}
                                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                      hoveredCategory === category.name
                                        ? "bg-[#e94491] text-white"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-[#e94491]"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{category.name}</span>
                                      {category.subcategories.length > 0 && (
                                        <ChevronRight className="h-3 w-3 opacity-60" />
                                      )}
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="w-1/2 p-4">
                            {hoveredCategory && (
                              <div className="animate-in slide-in-from-right-2 duration-200">
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                                  {hoveredCategory} Collection
                                </h4>
                                <div className="space-y-1">
                                  {shopCategories
                                    .find((cat) => cat.name === hoveredCategory)
                                    ?.subcategories.map((subcategory, index) => (
                                      <Link
                                        key={index}
                                        href={`/shop/${hoveredCategory.toLowerCase()}/${subcategory
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}`}
                                        className="block px-3 py-2 text-sm text-gray-600 hover:text-[#e94491] hover:bg-gray-50 rounded-md transition-colors"
                                      >
                                        {subcategory}
                                      </Link>
                                    ))}
                                  {shopCategories.find((cat) => cat.name === hoveredCategory)?.subcategories.length ===
                                    0 && (
                                    <p className="text-sm text-gray-500 italic px-3 py-2">
                                      Explore our {hoveredCategory.toLowerCase()} collection
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            {!hoveredCategory && (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <div className="text-center">
                                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                  <p className="text-sm">Hover over a category to see subcategories</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800">Special Offers</h4>
                              <p className="text-xs text-gray-600">Up to 50% off on selected items</p>
                            </div>
                            <Link
                              href="/shop/soldes"
                              className="bg-[#e94491] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d63384] transition-colors"
                            >
                              View Deals
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/faq"
                    className={`flex items-center gap-1 py-6 border-b-2 font-semibold transition-colors ${
                      isActiveLink("/faq")
                        ? "border-[#e94491] text-[#e94491]"
                        : "border-transparent hover:border-[#e94491] hover:text-[#e94491]"
                    }`}
                  >
                    FAQ
                  </Link>

                  <Link
                    href="/about"
                    className={`flex items-center gap-1 py-6 border-b-2 font-semibold transition-colors ${
                      isActiveLink("/about")
                        ? "border-[#e94491] text-[#e94491]"
                        : "border-transparent hover:border-[#e94491] hover:text-[#e94491]"
                    }`}
                  >
                    About
                  </Link>

                  <Link
                    href="/contact"
                    className={`flex items-center gap-1 py-6 border-b-2 font-semibold transition-colors ${
                      isActiveLink("/contact")
                        ? "border-[#e94491] text-[#e94491]"
                        : "border-transparent hover:border-[#e94491] hover:text-[#e94491]"
                    }`}
                  >
                    Contact
                  </Link>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span>Clearance Up to 30% Off</span>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Sidebar with Better Animations */}
        {showMobileSidebar && (
          <>
            {/* Backdrop with smooth fade */}
            <div
              className={`fixed inset-0 bg-black z-50 lg:hidden transition-all duration-600 ease-in-out ${
                isClosing ? "bg-opacity-0" : "bg-opacity-50"
              }`}
              onClick={closeSidebar}
            />

            {/* Sidebar with enhanced slide animation */}
            <div
              className={`fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden shadow-2xl transition-all duration-600 ease-out transform ${
                isClosing ? "-translate-x-full opacity-0 scale-95" : "translate-x-0 opacity-100 scale-100"
              }`}
              style={{
                transformOrigin: "left center",
              }}
            >
              <div className="flex flex-col h-full">
                {/* Header with enhanced styling */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#e94491] to-[#f472b6]">
                  <Link href="/" onClick={closeSidebar}>
                    <Image
                      src="/shahine-logo.png"
                      alt="Shahine Logo"
                      width={100}
                      height={32}
                      className="object-contain brightness-0 invert"
                    />
                  </Link>
                  <button
                    onClick={closeSidebar}
                    className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
                  >
                    <X className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search product ..."
                      className="pr-12 border-2 border-gray-200 focus:border-[#e94491] rounded-lg transition-colors duration-200"
                    />
                    <button className="absolute right-1 top-1 bottom-1 px-3 bg-[#e94491] hover:bg-[#d63384] text-white rounded-md transition-colors duration-200">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setActiveTab("menu")}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-500 relative ${
                      activeTab === "menu"
                        ? "text-[#e94491] bg-white"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    MENU
                    {activeTab === "menu" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e94491] transform scale-x-100 transition-transform duration-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("categories")}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-500 relative ${
                      activeTab === "categories"
                        ? "text-[#e94491] bg-white"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    CATEGORIES
                    {activeTab === "categories" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e94491] transform scale-x-100 transition-transform duration-500" />
                    )}
                  </button>
                </div>

                {/* Content with improved animations */}
                <div className="flex-1 overflow-y-auto">
                  {activeTab === "menu" && (
                    <div className="py-2">
                      {mainMenuItems.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-all duration-200 group">
                            <Link
                              href={item.href}
                              className={`flex-1 font-medium text-base group-hover:text-[#e94491] transition-colors duration-200 ${
                                isActiveLink(item.href) ? "text-[#e94491]" : "text-gray-700"
                              }`}
                              onClick={() => !item.hasSubmenu && closeSidebar()}
                            >
                              {item.name}
                            </Link>
                            {item.hasSubmenu && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  toggleMenuItem(item.name)
                                }}
                                className="p-2 hover:bg-gray-200 rounded-full transition-all duration-200 group-hover:scale-110"
                              >
                                <ChevronDown
                                  className={`h-5 w-5 text-gray-500 transition-all duration-300 ${
                                    expandedMenuItem === item.name ? "rotate-180 text-[#e94491] scale-110" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Enhanced Submenu with better animations */}
                          <div
                            className={`overflow-hidden transition-all duration-700 ease-in-out ${
                              expandedMenuItem === item.name ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            {item.hasSubmenu && expandedMenuItem === item.name && (
                              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-[#e94491] ml-4 mr-2 rounded-r-lg">
                                {item.submenu?.map((subItem, subIndex) => (
                                  <div key={subIndex}>
                                    <div className="flex items-center justify-between px-4 py-3 hover:bg-white transition-all duration-300 rounded-r-lg group">
                                      <Link
                                        href={`/shop/${subItem.name.toLowerCase()}`}
                                        className="flex-1 text-sm text-gray-600 hover:text-[#e94491] font-medium transition-colors duration-300"
                                        onClick={() => subItem.subcategories.length === 0 && closeSidebar()}
                                      >
                                        {subItem.name}
                                      </Link>
                                      {subItem.subcategories.length > 0 && (
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            toggleSubMenuItem(`${item.name}-${subItem.name}`)
                                          }}
                                          className="p-1 hover:bg-gray-200 rounded-full transition-all duration-300 group-hover:scale-110"
                                        >
                                          <ChevronDown
                                            className={`h-4 w-4 text-gray-400 transition-all duration-500 ${
                                              expandedSubMenus.has(`${item.name}-${subItem.name}`)
                                                ? "rotate-180 text-[#e94491]"
                                                : ""
                                            }`}
                                          />
                                        </button>
                                      )}
                                    </div>

                                    {/* Enhanced Sub-subcategories with better animations */}
                                    <div
                                      className={`overflow-hidden transition-all duration-600 ease-in-out ${
                                        expandedSubMenus.has(`${item.name}-${subItem.name}`)
                                          ? "max-h-96 opacity-100"
                                          : "max-h-0 opacity-0"
                                      }`}
                                    >
                                      {subItem.subcategories.length > 0 &&
                                        expandedSubMenus.has(`${item.name}-${subItem.name}`) && (
                                          <div className="ml-4 border-l-2 border-[#e94491] bg-white rounded-r-lg shadow-inner">
                                            {subItem.subcategories.map((subSubItem, subSubIndex) => (
                                              <Link
                                                key={subSubIndex}
                                                href={`/shop/${subItem.name.toLowerCase()}/${subSubItem
                                                  .toLowerCase()
                                                  .replace(/\s+/g, "-")}`}
                                                className="flex items-center px-4 py-2 text-xs text-gray-500 hover:text-[#e94491] hover:bg-gray-50 transition-all duration-300 rounded-r-lg border-b border-gray-100 last:border-b-0 hover:translate-x-1 group"
                                                onClick={closeSidebar}
                                              >
                                                <span className="inline-block w-2 h-2 bg-[#e94491] rounded-full mr-3 opacity-60 group-hover:opacity-100 transition-all duration-300"></span>
                                                <span className="flex-1">{subSubItem}</span>
                                                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-all duration-300 transform group-hover:translate-x-1" />
                                              </Link>
                                            ))}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "categories" && (
                    <div className="py-2">
                      {clothingCategories.map((category, index) => (
                        <Link
                          key={index}
                          href="#"
                          className="flex items-center justify-between px-4 py-4 text-gray-700 hover:bg-gray-50 hover:text-[#e94491] transition-all duration-300 border-b border-gray-100 last:border-b-0 group hover:translate-x-1"
                          onClick={closeSidebar}
                        >
                          <span className="flex-1">{category}</span>
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-60 transition-all duration-300 transform group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced Social Media Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-center gap-4">
                    <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#3b5998] hover:text-white hover:border-[#3b5998] transition-all duration-500 transform hover:scale-110 hover:-translate-y-1">
                      <Facebook className="h-5 w-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#1da1f2] hover:text-white hover:border-[#1da1f2] transition-all duration-500 transform hover:scale-110 hover:-translate-y-1">
                      <Twitter className="h-5 w-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#e4405f] hover:text-white hover:border-[#e4405f] transition-all duration-500 transform hover:scale-110 hover:-translate-y-1">
                      <Instagram className="h-5 w-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#ff0000] hover:text-white hover:border-[#ff0000] transition-all duration-500 transform hover:scale-110 hover:-translate-y-1">
                      <Youtube className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Sticky Second Navigation - Desktop Only */}
        <div
          className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 transition-transform duration-300 hidden lg:block ${
            isScrolled ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            <nav className="flex-1 flex items-center justify-between gap-8">
              <div
                className="relative group"
                onMouseEnter={handleStickyCategoriesMouseEnter}
                onMouseLeave={handleStickyCategoriesMouseLeave}
              >
                <button
                  className={`flex items-center gap-2 w-[15rem] p-4 border-b-2 border-transparent font-semibold transition-colors ${
                    showStickyCategories ? "bg-[#e94491]" : ""
                  }`}
                >
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <div className="absolute inset-0 flex flex-col justify-center items-center gap-1">
                      <div
                        className={`w-4 h-0.5 bg-current transition-all duration-300 ${
                          showStickyCategories ? "rotate-45 translate-y-1.5 text-white" : ""
                        }`}
                      ></div>
                      <div
                        className={`w-4 h-0.5 bg-current transition-all duration-300 ${
                          showStickyCategories ? "opacity-0" : ""
                        }`}
                      ></div>
                      <div
                        className={`w-4 h-0.5 bg-current transition-all duration-300 ${
                          showStickyCategories ? "-rotate-45 -translate-y-1.5 text-white" : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                  <span className={`transition-colors duration-300 ${showStickyCategories ? "text-white" : ""}`}>
                    Browse Categories
                  </span>
                </button>

                {showStickyCategories && isScrolled && (
                  <div className="absolute top-full left-0 w-60 bg-white shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300 rounded-lg overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      {clothingCategories.map((category, index) => (
                        <Link
                          key={index}
                          href="#"
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e94491] border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-8">
                <Link
                  href="/"
                  className={`flex items-center gap-1 py-6 border-b-2 font-semibold transition-colors ${
                    isActiveLink("/")
                      ? "border-[#e94491] text-[#e94491]"
                      : "border-transparent hover:border-[#e94491] hover:text-[#e94491]"
                  }`}
                >
                  Home
                </Link>

                <div
                  className="relative"
                  onMouseEnter={handleStickyShopMouseEnter}
                  onMouseLeave={handleStickyShopMouseLeave}
                >
                  <Link
                    href="/shop"
                    className={`flex items-center gap-1 py-6 border-b-2 font-semibold transition-colors ${
                      isActiveLink("/shop")
                        ? "border-[#e94491] text-[#e94491]"
                        : "border-transparent hover:border-[#e94491] hover:text-[#e94491]"
                    }`}
                  >
                    Shop <ChevronDown className="h-4 w-4" />
                  </Link>

                  {showShopDropdown && isScrolled && (
                    <div className="absolute top-full left-0 w-[600px] bg-white shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300 rounded-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-[#e94491] to-[#f472b6] text-white px-6 py-4">
                        <h3 className="text-lg font-semibold">Shop Categories</h3>
                        <p className="text-sm opacity-90">Discover our amazing collection</p>
                      </div>
                      <div className="flex">
                        <div className="w-1/2 p-4 border-r border-gray-200">
                          <div className="grid grid-cols-2 gap-2">
                            {shopCategories.map((category, index) => (
                              <div
                                key={index}
                                className={`relative group cursor-pointer`}
                                onMouseEnter={() => setHoveredCategory(category.name)}
                              >
                                <Link
                                  href={`/shop/${category.name.toLowerCase()}`}
                                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    hoveredCategory === category.name
                                      ? "bg-[#e94491] text-white"
                                      : "text-gray-700 hover:bg-gray-50 hover:text-[#e94491]"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{category.name}</span>
                                    {category.subcategories.length > 0 && (
                                      <ChevronRight className="h-3 w-3 opacity-60" />
                                    )}
                                  </div>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="w-1/2 p-4">
                          {hoveredCategory && (
                            <div className="animate-in slide-in-from-right-2 duration-200">
                              <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                                {hoveredCategory} Collection
                              </h4>
                              <div className="space-y-1">
                                {shopCategories
                                  .find((cat) => cat.name === hoveredCategory)
                                  ?.subcategories.map((subcategory, index) => (
                                    <Link
                                      key={index}
                                      href={`/shop/${hoveredCategory.toLowerCase()}/${subcategory
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                      className="block px-3 py-2 text-sm text-gray-600 hover:text-[#e94491] hover:bg-gray-50 rounded-md transition-colors"
                                    >
                                      {subcategory}
                                    </Link>
                                  ))}
                                {shopCategories.find((cat) => cat.name === hoveredCategory)?.subcategories.length ===
                                  0 && (
                                  <p className="text-sm text-gray-500 italic px-3 py-2">
                                    Explore our {hoveredCategory.toLowerCase()} collection
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          {!hoveredCategory && (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <div className="text-center">
                                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Hover over a category to see subcategories</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">Special Offers</h4>
                            <p className="text-xs text-gray-600">Up to 50% off on selected items</p>
                          </div>
                          <Link
                            href="/shop/soldes"
                            className="bg-[#e94491] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d63384] transition-colors"
                          >
                            View Deals
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/faq"
                  className={`flex items-center gap-1 py-6 border-b-2 font-semibold transition-colors ${
                    isActiveLink("/faq")
                      ? "border-[#e94491] text-[#e94491]"
                      : "border-transparent hover:border-[#e94491] hover:text-[#e94491]"
                  }`}
                >
                  FAQ
                </Link>

                <Link
                  href="/about"
                  className={`flex items-center gap-1 py-6 border-b-2 font-semibold transition-colors ${
                    isActiveLink("/about")
                      ? "border-[#e94491] text-[#e94491]"
                      : "border-transparent hover:border-[#e94491] hover:text-[#e94491]"
                  }`}
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className={`flex items-center gap-1 py-6 border-b-2 font-semibold transition-colors ${
                    isActiveLink("/contact")
                      ? "border-[#e94491] text-[#e94491]"
                      : "border-transparent hover:border-[#e94491] hover:text-[#e94491]"
                  }`}
                >
                  Contact
                </Link>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Clearance Up to 30% Off</span>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
