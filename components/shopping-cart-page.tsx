"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Minus, Plus, X, Truck, ShoppingCart } from "lucide-react"
import type { CartItemWithDetails } from "@/lib/types"
import { updateCartQuantity, removeFromCart } from "@/lib/actions/cart"
import { useToast } from "@/hooks/use-toast"

interface ShoppingCartPageProps {
  initialCartItems: CartItemWithDetails[]
}

export default function ShoppingCartPage({ initialCartItems }: ShoppingCartPageProps) {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [couponCode, setCouponCode] = useState("")
  const [selectedShipping, setSelectedShipping] = useState("free")
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const shippingCosts = {
    free: 0,
    standard: 10,
    express: 20,
  }

  const shippingCost = shippingCosts[selectedShipping as keyof typeof shippingCosts]
  const subtotal = cartItems.reduce((total, item) => total + item.product.current_price * item.quantity, 0)
  const total = subtotal + shippingCost

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    startTransition(async () => {
      try {
        const result = await updateCartQuantity(itemId, newQuantity)

        if (result.success) {
          if (newQuantity === 0) {
            setCartItems((prev) => prev.filter((item) => item.id !== itemId))
          } else {
            setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
          }
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
          description: "Failed to update cart",
          variant: "destructive",
        })
      }
    })
  }

  const handleRemoveItem = (itemId: string) => {
    startTransition(async () => {
      try {
        const result = await removeFromCart(itemId)

        if (result.success) {
          setCartItems((prev) => prev.filter((item) => item.id !== itemId))
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
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Header */}
      <div className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#e94491]/20 to-[#f472b6]/20"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-[#e94491] rounded-full mb-4 md:mb-6 shadow-lg">
            <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-gray-800 mb-2 md:mb-4 tracking-wide">Shopping Cart</h1>
          <p className="text-[#e94491] font-medium text-sm md:text-lg tracking-wider">SHOP</p>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-[#e94491] to-[#f472b6] mx-auto mt-4 md:mt-6 rounded-full"></div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <nav className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#e94491] transition-colors font-medium">
              Home
            </Link>
            <span className="text-gray-300">›</span>
            <Link href="/shop" className="text-gray-500 hover:text-[#e94491] transition-colors font-medium">
              Shop
            </Link>
            <span className="text-gray-300">›</span>
            <span className="text-[#e94491] font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-6 md:py-12">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-8 md:p-16 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6 md:mb-8">
              <ShoppingCart className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-2 md:mb-4">Your cart is empty</h2>
            <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-md mx-auto">
              No products selected. Start shopping to add items to your cart and see them here!
            </p>
            <Link href="/shop">
              <Button className="bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold tracking-wider rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Desktop Table Header */}
                <div className="hidden md:block bg-gradient-to-r from-gray-50 to-gray-100 px-6 md:px-8 py-4 md:py-6 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 font-normal text-gray-700 text-xs md:text-sm uppercase tracking-wider">
                    <div className="col-span-5">Product Details</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-1 text-center">Total</div>
                    <div className="col-span-1 text-center">Remove</div>
                  </div>
                </div>

                {/* Cart Items */}
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 p-6 md:p-8 items-center hover:bg-gray-50 transition-colors">
                      <div className="col-span-5 flex items-center gap-4 md:gap-6">
                        <Link href={`/product/${item.product.id}`}>
                          <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                            <Image
                              src={item.image.image_url || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                        <div>
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="font-normal text-gray-800 text-sm md:text-lg mb-1 hover:text-[#e94491] transition-colors cursor-pointer">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-gray-500 text-xs md:text-sm">
                            {item.color.name} • {item.size.label}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <span className="text-gray-800 font-normal text-sm md:text-lg">
                          ${item.product.current_price.toFixed(2)}
                        </span>
                      </div>

                      <div className="col-span-3 flex justify-center">
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={isPending}
                            className="p-2 md:p-4 hover:bg-[#e94491] hover:text-white transition-all duration-200 text-gray-600 flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                          <span className="px-3 md:px-4 py-2 min-w-[50px] md:min-w-[60px] text-center font-medium text-gray-800 bg-gray-50 flex items-center justify-center text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isPending}
                            className="p-2 md:p-4 hover:bg-[#e94491] hover:text-white transition-all duration-200 text-gray-600 flex items-center justify-center"
                          >
                            <Plus className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <span className="text-[#e94491] font-normal text-sm md:text-lg">
                          ${(item.product.current_price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isPending}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm"
                        >
                          <X className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden p-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex gap-4">
                        <Link href={`/product/${item.product.id}`}>
                          <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                            <Image
                              src={item.image.image_url || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 pr-2">
                              <Link href={`/product/${item.product.id}`}>
                                <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-[#e94491] transition-colors cursor-pointer">
                                  {item.product.name}
                                </h3>
                              </Link>
                              <p className="text-gray-500 text-xs mt-1">
                                {item.color.name} • {item.size.label}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isPending}
                              className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Price</span>
                              <span className="text-gray-800 font-medium text-sm">
                                ${item.product.current_price.toFixed(2)}
                              </span>
                            </div>

                            <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={isPending}
                                className="p-2 hover:bg-[#e94491] hover:text-white transition-all duration-200 text-gray-600 flex items-center justify-center"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 py-2 min-w-[40px] text-center font-medium text-gray-800 bg-gray-50 flex items-center justify-center text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={isPending}
                                className="p-2 hover:bg-[#e94491] hover:text-white transition-all duration-200 text-gray-600 flex items-center justify-center"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="flex flex-col text-right">
                              <span className="text-xs text-gray-500">Total</span>
                              <span className="text-[#e94491] font-medium text-sm">
                                ${(item.product.current_price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 lg:sticky lg:top-8">
                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-base md:text-lg font-normal text-gray-800 mb-2">Cart Summary</h3>
                  <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-[#e94491] to-[#f472b6] mx-auto rounded-full"></div>
                </div>

                <div className="flex justify-between items-center py-3 md:py-4 border-b border-gray-200">
                  <span className="text-gray-600 font-medium text-sm md:text-base">Subtotal:</span>
                  <span className="font-normal text-base md:text-lg text-gray-800">${subtotal.toFixed(2)}</span>
                </div>

                <div className="py-4 md:py-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <Truck className="h-4 w-4 md:h-5 md:w-5 text-[#e94491]" />
                    <span className="text-gray-700 font-medium text-sm md:text-base">Shipping:</span>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    {[
                      { value: "free", label: "Free Shipping", price: 0, desc: "5-7 business days" },
                      { value: "standard", label: "Standard", price: 10, desc: "3-5 business days" },
                      { value: "express", label: "Express", price: 20, desc: "1-2 business days" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center justify-between cursor-pointer p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.value}
                            checked={selectedShipping === option.value}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="text-[#e94491] focus:ring-[#e94491]"
                          />
                          <div>
                            <span className="font-medium text-gray-800 text-sm md:text-base">{option.label}</span>
                            <p className="text-xs text-gray-500">{option.desc}</p>
                          </div>
                        </div>
                        <span className="font-normal text-[#e94491] text-sm md:text-base">
                          ${option.price.toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="py-4 md:py-6">
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <span className="text-sm md:text-base font-normal text-gray-800">Total:</span>
                    <span className="text-lg md:text-xl font-normal text-[#e94491]">${total.toFixed(2)}</span>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white py-3 md:py-4 text-base md:text-lg font-semibold tracking-wider rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                      PROCEED TO CHECKOUT
                    </Button>
                  </Link>

                  <p className="text-center text-xs text-gray-500 mt-3 md:mt-4">
                    Secure checkout powered by SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
