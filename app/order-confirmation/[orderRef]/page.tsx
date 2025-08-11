"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Package, Truck, Phone, MapPin, Calendar, Loader2, ArrowRight, Download, Share2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getOrderByRef } from "@/lib/actions/orders"
import { toast } from "sonner"

interface OrderDetails {
  id: string
  ref_id: string
  name: string
  phone: string
  address: string
  status: string
  created_at: string
  shipping_cost: number
  shipping_option?: string
  total_amount: number
  items: Array<{
    id: string
    quantity: number
    unit_price: number
    subtotal: number
    product: {
      id: string
      name: string
    }
    color: {
      id: string
      name: string
      hex: string
    }
    size: {
      id: string
      label: string
    }
    image_url: string
  }>
}

export default function OrderConfirmationPage({ params }: { params: Promise<{ orderRef: string }> }) {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderData = await getOrderByRef((await params).orderRef)
        if (orderData) {
          setOrder(orderData)
        } else {
          setError("Order not found")
        }
      } catch (err) {
        console.error("Error loading order:", err)
        setError("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [params])

  const copyOrderRef = async () => {
    if (order) {
      try {
        await navigator.clipboard.writeText(order.ref_id)
        setCopied(true)
        toast.success("Order reference copied!")
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        toast.error("Failed to copy order reference")
      }
    }
  }

  const shareOrder = async () => {
    if (order && navigator.share) {
      try {
        await navigator.share({
          title: `Order ${order.ref_id}`,
          text: `My order has been confirmed! Order reference: ${order.ref_id}`,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to copying URL
        copyOrderRef()
      }
    } else {
      copyOrderRef()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-[#e94491] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-light text-gray-800 mb-2">Loading your order...</h2>
          <p className="text-gray-600">Please wait while we fetch your order details</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Package className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-light text-gray-800 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {error || "The order you're looking for doesn't exist or may have been removed."}
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-[#e94491] hover:bg-[#d63384] text-white py-3">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-[#e94491] text-[#e94491] hover:bg-[#e94491] hover:text-white py-3">
              <Link href="/orders">View My Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200'
      case 'shipped':
        return 'text-blue-700 bg-blue-100 border-blue-200'
      case 'delivered':
        return 'text-green-700 bg-green-100 border-green-200'
      case 'cancelled':
        return 'text-red-700 bg-red-100 border-red-200'
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '⏳'
      case 'shipped':
        return '🚚'
      case 'delivered':
        return '✅'
      case 'cancelled':
        return '❌'
      default:
        return '📦'
    }
  }

  // Calculate subtotal from items
  const subtotal = order.items.reduce((total, item) => total + item.subtotal, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Success Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 shadow-2xl animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-light text-gray-800 mb-3">🎉 Order Confirmed!</h1>
              <p className="text-lg text-gray-600 mb-4">
                Thank you <strong className="text-[#e94491]">{order.name}</strong> for your order! 
                We've received your order and will process it shortly.
              </p>
              <div className="inline-flex items-center gap-2 bg-[#e94491]/10 px-6 py-3 rounded-full">
                <span className="text-sm text-gray-600">Order Reference:</span>
                <code className="font-mono font-bold text-[#e94491] text-lg">{order.ref_id}</code>
                <button
                  onClick={copyOrderRef}
                  className="ml-2 p-1 hover:bg-[#e94491]/20 rounded transition-colors"
                  title="Copy order reference"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-[#e94491]" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-light text-gray-800 mb-2">Order Details</h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  <span className="mr-2">{getStatusIcon(order.status)}</span>
                  {order.status.toUpperCase()}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-[#e94491]/5 to-[#f472b6]/5 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#e94491] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
                      <p className="text-gray-700 font-medium">{order.name}</p>
                      <p className="text-gray-600">{order.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Delivery Address</h3>
                      <p className="text-gray-700 leading-relaxed">{order.address}</p>
                      {order.shipping_option && (
                        <p className="text-sm text-gray-500 mt-1">
                          Shipping: {order.shipping_option}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                    <Package className="w-6 h-6 text-[#e94491]" />
                    Your Items ({order.items.length} {order.items.length === 1 ? 'product' : 'products'})
                  </h3>
                  <span className="text-sm text-gray-500">
                    {order.items.reduce((total, item) => total + item.quantity, 0)} items total
                  </span>
                </div>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id} className="group bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 transition-colors">
                      <div className="flex gap-6">
                        <div className="relative w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                          <Image
                            src={item.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2 w-6 h-6 bg-[#e94491] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-3 text-lg">{item.product.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: item.color.hex }}
                              />
                              <span className="font-medium">{item.color.name}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <span><strong>Size:</strong> {item.size.label}</span>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <span><strong>Qty:</strong> {item.quantity}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{item.unit_price.toFixed(2)} DHS</span> × {item.quantity}
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-[#e94491] text-lg">
                                {item.subtotal.toFixed(2)} DHS
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-r from-[#e94491]/10 to-[#f472b6]/10 rounded-2xl p-8 border border-[#e94491]/20">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                ⏭️ What Happens Next?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#e94491] rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Order Processing</h4>
                    <p className="text-sm text-gray-600">We'll verify your order and prepare your items for shipping.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#e94491] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Shipping</h4>
                    <p className="text-sm text-gray-600">Your order will be shipped within 1-2 business days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#e94491] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Delivery & Payment</h4>
                    <p className="text-sm text-gray-600">Pay cash when you receive your order at your doorstep.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                📋 Order Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">
                    Items ({order.items.reduce((total, item) => total + item.quantity, 0)}):
                  </span>
                  <span className="font-medium text-gray-800">
                    {subtotal.toFixed(2)} DHS
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-gray-800">
                    {order.shipping_cost > 0 ? `${order.shipping_cost.toFixed(2)} DHS` : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between py-4 text-xl font-bold border-t-2 border-gray-200">
                  <span className="text-[#e94491]">Total:</span>
                  <span className="text-[#e94491]">{order.total_amount.toFixed(2)} DHS</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#e94491]" />
                Delivery Info
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💰</span>
                    <p className="text-sm font-semibold text-green-800">Cash on Delivery</p>
                  </div>
                  <p className="text-xs text-green-700">No advance payment required. Pay when you receive your order.</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🚚</span>
                    <p className="text-sm font-semibold text-blue-800">Estimated Delivery</p>
                  </div>
                  <p className="text-xs text-blue-700">3-5 business days from order confirmation</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📱</span>
                    <p className="text-sm font-semibold text-purple-800">Order Tracking</p>
                  </div>
                  <p className="text-xs text-purple-700">We'll contact you with updates via phone</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button 
                onClick={shareOrder}
                className="w-full bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Order
              </Button>
              
              <Button asChild className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl">
                <Link href="/shop" className="flex items-center justify-center gap-2">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-[#e94491] text-[#e94491] hover:bg-[#e94491] hover:text-white py-3 rounded-xl">
                <Link href="/orders" className="flex items-center justify-center gap-2">
                  <Package className="w-4 h-4" />
                  View All Orders
                </Link>
              </Button>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                💬 Need Help?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about your order? We're here to help!
              </p>
              <div className="space-y-2">
                <Link href="/contact" className="block text-sm text-[#e94491] hover:text-[#d63384] font-medium">
                  📧 Contact Support
                </Link>
                <Link href="/faq" className="block text-sm text-[#e94491] hover:text-[#d63384] font-medium">
                  ❓ View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}