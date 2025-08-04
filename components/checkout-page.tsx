"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Truck, Tag, ShoppingBag } from "lucide-react"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

const shippingOptions = [
  { id: "casablanca", label: "LIVRAISON CASABLANCA", price: 20, cities: "Casablanca" },
  { id: "proche", label: "MOHMADIA / BOUSKOURA / BERRCHID", price: 39, cities: "Mohmadia, Bouskoura, Berrchid" },
  { id: "rahma", label: "LIVRAISON RAHMA / DEROUA / TITT MELIL", price: 30, cities: "Rahma, Deroua, Titt Melil" },
  {
    id: "rabat",
    label: "RABAT / KENITRA / SALE / TEMARA ET REGIONS",
    price: 35,
    cities: "Rabat, Kenitra, Sale, Temara",
  },
  { id: "autres", label: "RESTE DES VILLES (باقي المدن)", price: 45, cities: "Autres villes" },
]

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    city: "",
    address: "",
    phone: "",
    notes: "",
  })

  const [selectedShipping, setSelectedShipping] = useState("casablanca")
  const [couponCode, setCouponCode] = useState("")
  const [createAccount, setCreateAccount] = useState(false)
  const [differentAddress, setDifferentAddress] = useState(false)

  const orderItems: OrderItem[] = [
    { id: 1, name: "Beige knitted elastic runner shoes", price: 84.0, quantity: 2 },
    { id: 2, name: "Blue utility pinafore denim dress", price: 76.0, quantity: 1 },
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = shippingOptions.find((option) => option.id === selectedShipping)?.price || 0
  const total = subtotal + shippingCost

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Beautiful Page Header */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://portotheme.com/html/molla/assets/images/page-header-bg.jpg"
            alt="Pattern Background"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e94491]/20 to-[#f472b6]/20"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e94491] rounded-full mb-6 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-light text-gray-800 mb-4 tracking-wide">Checkout</h1>
          <p className="text-[#e94491] font-normal text-lg tracking-wider">SHOP</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e94491] to-[#f472b6] mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#e94491] transition-colors">
              Home
            </Link>
            <span className="text-gray-300">›</span>
            <Link href="/shop" className="text-gray-500 hover:text-[#e94491] transition-colors">
              Shop
            </Link>
            <span className="text-gray-300">›</span>
            <span className="text-[#e94491]">Checkout</span>
          </nav>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Coupon Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="h-5 w-5 text-[#e94491]" />
            <span className="text-gray-600">Have a coupon?</span>
            <button className="text-[#e94491] hover:underline">Click here to enter your code</button>
          </div>
          <div className="flex gap-3 max-w-md">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border-2 border-gray-200 rounded-xl focus:border-[#e94491]"
            />
            <Button className="bg-[#e94491] hover:bg-[#d63384] text-white px-6 rounded-xl">Apply</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-light text-gray-800 mb-8">Billing Details</h2>

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">First Name *</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Last Name *</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Phone Number *</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12"
                    required
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">City *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Street Address *</label>
                  <Input
                    placeholder="House number and street name"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12 mb-3"
                    required
                  />
                  <Input
                    placeholder="Apartment, suite, unit etc. (optional)"
                    className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12"
                  />
                </div>

                {/* Shipping Options */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="h-5 w-5 text-[#e94491]" />
                    <label className="text-sm text-gray-700">Shipping Options *</label>
                  </div>
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-[#e94491] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="text-[#e94491] focus:ring-[#e94491]"
                          />
                          <div>
                            <span className="text-gray-800">{option.label}</span>
                            <p className="text-xs text-gray-500">{option.cities}</p>
                          </div>
                        </div>
                        <span className="text-[#e94491] font-medium">{option.price} DHS</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="create-account" checked={createAccount} onCheckedChange={setCreateAccount} />
                    <label htmlFor="create-account" className="text-sm text-gray-600">
                      Create an account?
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="different-address" checked={differentAddress} onCheckedChange={setDifferentAddress} />
                    <label htmlFor="different-address" className="text-sm text-gray-600">
                      Ship to a different address?
                    </label>
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Order notes (optional)</label>
                  <Textarea
                    placeholder="Notes about your order, e.g. special notes for delivery"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="h-5 w-5 text-[#e94491]" />
                <h3 className="text-xl font-light text-gray-800">Your Order</h3>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600 pb-2 border-b border-gray-200">
                  <span>Product</span>
                  <span>Total</span>
                </div>
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-[#e94491]">{shippingCost} DHS</span>
                </div>
                <div className="flex justify-between py-3 text-lg">
                  <span className="text-[#e94491]">Total:</span>
                  <span className="text-[#e94491]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 mb-4">Payment Method</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#e94491]">
                    <input type="radio" name="payment" value="bank" className="text-[#e94491]" defaultChecked />
                    <span className="text-sm text-gray-700">Direct bank transfer</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#e94491]">
                    <input type="radio" name="payment" value="cash" className="text-[#e94491]" />
                    <span className="text-sm text-gray-700">Cash on delivery</span>
                  </label>
                </div>
              </div>

              {/* Place Order Button */}
              <Button className="w-full bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white py-4 text-lg font-normal tracking-wider rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                PLACE ORDER
              </Button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Your personal data will be used to process your order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
