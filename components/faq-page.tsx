"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronDown,
  Search,
  HelpCircle,
  ShoppingCart,
  Truck,
  CreditCard,
  RotateCcw,
  MessageCircle,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react"

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const categories = [
    { id: "all", name: "All Questions", icon: HelpCircle, count: 24 },
    { id: "orders", name: "Orders & Shopping", icon: ShoppingCart, count: 8 },
    { id: "shipping", name: "Shipping & Delivery", icon: Truck, count: 6 },
    { id: "payments", name: "Payments & Billing", icon: CreditCard, count: 5 },
    { id: "returns", name: "Returns & Exchanges", icon: RotateCcw, count: 5 },
  ]

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "How do I place an order?",
      answer:
        "To place an order, simply browse our collection, select your desired items, choose size and color, add to cart, and proceed to checkout. You'll need to provide shipping information and payment details to complete your purchase.",
      category: "orders",
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and bank transfers. All payments are processed securely through our encrypted payment system.",
      category: "payments",
    },
    {
      id: 3,
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days within Morocco. Express shipping is available for 1-2 business days. International shipping takes 7-14 business days depending on the destination.",
      category: "shipping",
    },
    {
      id: 4,
      question: "Can I return or exchange items?",
      answer:
        "Yes! We offer a 30-day return policy for unworn items in original condition with tags attached. Exchanges are free, and returns are processed within 5-7 business days after we receive your items.",
      category: "returns",
    },
    {
      id: 5,
      question: "How do I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'My Orders' section.",
      category: "orders",
    },
    {
      id: 6,
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship worldwide! International shipping costs vary by destination and are calculated at checkout. Please note that customs duties and taxes may apply depending on your country.",
      category: "shipping",
    },
    {
      id: 7,
      question: "What if my item doesn't fit?",
      answer:
        "We offer free exchanges for different sizes within 30 days. Please refer to our size guide before ordering. If you're unsure about sizing, our customer service team is happy to help.",
      category: "returns",
    },
    {
      id: 8,
      question: "Is my payment information secure?",
      answer:
        "We use industry-standard SSL encryption to protect your payment information. We never store your credit card details on our servers, and all transactions are processed through secure payment gateways.",
      category: "payments",
    },
  ]

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full mb-6 shadow-lg">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-light text-gray-800 mb-4 tracking-wide">Frequently Asked Questions</h1>
          <p className="text-[#e94491] font-normal text-lg tracking-wider">HELP CENTER</p>
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
            <span className="text-[#e94491]">FAQ</span>
          </nav>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-gray-800 mb-4">How can we help you?</h2>
            <p className="text-gray-600">Search our knowledge base or browse categories below</p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-14 text-lg transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-[#e94491] to-[#f472b6] text-white shadow-lg"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        activeCategory === category.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Contact */}
              <div className="mt-8 p-4 bg-gradient-to-r from-[#e94491]/10 to-[#f472b6]/10 rounded-xl border border-[#e94491]/20">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="h-5 w-5 text-[#e94491]" />
                  <span className="font-semibold text-gray-800">Still need help?</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Can't find what you're looking for?</p>
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white rounded-xl">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {activeCategory === "all" ? "All Questions" : categories.find((c) => c.id === activeCategory)?.name}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {filteredFAQs.length} {filteredFAQs.length === 1 ? "question" : "questions"}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredFAQs.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No results found</h3>
                    <p className="text-gray-600">Try adjusting your search or browse different categories</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq) => (
                    <div key={faq.id} className="group">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-800 group-hover:text-[#e94491] transition-colors pr-4">
                            {faq.question}
                          </h4>
                          <ChevronDown
                            className={`h-5 w-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                              expandedItems.includes(faq.id) ? "rotate-180 text-[#e94491]" : ""
                            }`}
                          />
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedItems.includes(faq.id) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-6 pb-6">
                          <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#e94491]">
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Help Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">99% Satisfaction</h4>
                <p className="text-gray-600 text-sm">Customer satisfaction rate</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">24/7 Support</h4>
                <p className="text-gray-600 text-sm">Round the clock assistance</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Expert Team</h4>
                <p className="text-gray-600 text-sm">Knowledgeable support staff</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
