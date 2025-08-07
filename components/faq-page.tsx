"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
}

const slideInFromBottom = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const expandAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: "easeInOut" }
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

  const helpStats = [
    {
      icon: CheckCircle,
      title: "99% Satisfaction",
      description: "Customer satisfaction rate",
      color: "green",
      bgColor: "bg-green-100",
      iconColor: "text-green-500"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round the clock assistance",
      color: "blue",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500"
    },
    {
      icon: Star,
      title: "Expert Team",
      description: "Knowledgeable support staff",
      color: "yellow",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Beautiful Page Header */}
      <motion.div 
        className="relative py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://portotheme.com/html/molla/assets/images/page-header-bg.jpg"
            alt="Pattern Background"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e94491]/20 to-[#f472b6]/20"></div>
        </div>
        <motion.div 
          className="container mx-auto px-4 text-center relative z-10"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full mb-6 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <HelpCircle className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            className="text-5xl font-light text-gray-800 mb-4 tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            className="text-[#e94491] font-normal text-lg tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            HELP CENTER
          </motion.p>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-[#e94491] to-[#f472b6] mx-auto mt-6 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          ></motion.div>
        </motion.div>
      </motion.div>

      {/* Breadcrumb */}
      <motion.div 
        className="bg-white shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#e94491] transition-colors">
              Home
            </Link>
            <span className="text-gray-300">›</span>
            <span className="text-[#e94491]">FAQ</span>
          </nav>
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div 
        className="container mx-auto px-4 py-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100"
          variants={fadeInUp}
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-light text-gray-800 mb-4">How can we help you?</h2>
            <p className="text-gray-600">Search our knowledge base or browse categories below</p>
          </motion.div>

          <motion.div 
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-14 text-lg transition-all duration-300 hover:border-gray-300"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            variants={fadeInLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3 
                className="text-lg font-semibold text-gray-800 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Categories
              </motion.h3>
              <motion.div 
                className="space-y-2"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-[#e94491] to-[#f472b6] text-white shadow-lg"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                    variants={slideInFromBottom}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <motion.span
                      className={`text-xs px-2 py-1 rounded-full ${
                        activeCategory === category.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {category.count}
                    </motion.span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Quick Contact */}
              <motion.div 
                className="mt-8 p-4 bg-gradient-to-r from-[#e94491]/10 to-[#f472b6]/10 rounded-xl border border-[#e94491]/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="flex items-center gap-2 mb-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <MessageCircle className="h-5 w-5 text-[#e94491]" />
                  <span className="font-semibold text-gray-800">Still need help?</span>
                </motion.div>
                <motion.p 
                  className="text-sm text-gray-600 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Can't find what you're looking for?
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link href="/contact">
                    <Button className="w-full bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white rounded-xl transform hover:-translate-y-1 transition-all duration-200">
                      Contact Support
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* FAQ Content */}
          <motion.div 
            className="lg:col-span-3"
            variants={fadeInRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="p-6 border-b border-gray-200 bg-gray-50"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {activeCategory === "all" ? "All Questions" : categories.find((c) => c.id === activeCategory)?.name}
                  </h3>
                  <motion.span 
                    className="text-sm text-gray-600"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    {filteredFAQs.length} {filteredFAQs.length === 1 ? "question" : "questions"}
                  </motion.span>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div 
                  className="divide-y divide-gray-200"
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredFAQs.length === 0 ? (
                    <motion.div 
                      className="p-12 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Search className="w-8 h-8 text-gray-400" />
                      </motion.div>
                      <motion.h3 
                        className="text-lg font-medium text-gray-800 mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        No results found
                      </motion.h3>
                      <motion.p 
                        className="text-gray-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        Try adjusting your search or browse different categories
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      {filteredFAQs.map((faq, index) => (
                        <motion.div 
                          key={faq.id} 
                          className="group"
                          variants={slideInFromBottom}
                          custom={index}
                          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.button
                            onClick={() => toggleExpanded(faq.id)}
                            className="w-full p-6 text-left transition-colors duration-200"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-medium text-gray-800 group-hover:text-[#e94491] transition-colors pr-4">
                                {faq.question}
                              </h4>
                              <motion.div
                                animate={{ 
                                  rotate: expandedItems.includes(faq.id) ? 180 : 0,
                                  color: expandedItems.includes(faq.id) ? "#e94491" : "#6b7280"
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronDown className="h-5 w-5 flex-shrink-0" />
                              </motion.div>
                            </div>
                          </motion.button>

                          <AnimatePresence>
                            {expandedItems.includes(faq.id) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <motion.div 
                                  className="px-6 pb-6"
                                  initial={{ y: -10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: -10, opacity: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                  <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#e94491]">
                                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                  </div>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Help Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              {helpStats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center group"
                  variants={scaleIn}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    scale: 1.02
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </motion.div>
                  <motion.h4 
                    className="font-semibold text-gray-800 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  >
                    {stat.title}
                  </motion.h4>
                  <motion.p 
                    className="text-gray-600 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    {stat.description}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}