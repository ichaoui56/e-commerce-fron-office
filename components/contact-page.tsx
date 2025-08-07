"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Store,
  Users,
  Award,
  Truck,
  Shield,
  Heart,
  CheckCircle,
  Star,
  Globe,
  ArrowRight,
} from "lucide-react"

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
      staggerChildren: 0.2
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log("Contact form submitted:", formData)
    setIsSubmitting(false)
    // Reset form or show success message
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Store",
      details: ["Shahine Vêtements pour femmes", "El Jadida, Morocco"],
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+212 523 123 456", "+212 661 234 567"],
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@shahine.com", "support@shahine.com"],
      color: "text-[#e94491]",
      bgColor: "bg-pink-50",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sunday: 10:00 AM - 6:00 PM"],
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ]

  const storeFeatures = [
    {
      icon: Users,
      title: "Expert Staff",
      description: "Our knowledgeable team is here to help you find the perfect style",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Carefully curated collection of high-quality fashion items",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep",
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Safe and secure payment processing for your peace of mind",
    },
  ]

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "24/7", label: "Customer Support", icon: Headphones },
    { number: "99%", label: "Satisfaction Rate", icon: Star },
    { number: "15+", label: "Years Experience", icon: Award },
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
            <MessageCircle className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            className="text-5xl font-light text-gray-800 mb-4 tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Contact Us
          </motion.h1>
          <motion.p 
            className="text-[#e94491] font-normal text-lg tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            GET IN TOUCH
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
            <span className="text-[#e94491]">Contact</span>
          </nav>
        </div>
      </motion.div>

      {/* Contact Information Cards */}
      <motion.div 
        className="container mx-auto px-4 py-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={staggerContainer}
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              variants={scaleIn}
              whileHover={{ y: -10 }}
            >
              <div
                className={`w-12 h-12 ${info.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <info.icon className={`h-6 w-6 ${info.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">
                    {detail}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics Section */}
        <motion.div 
          className="bg-white py-12 rounded-2xl shadow-xl mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="container mx-auto px-8">
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center group"
                  variants={scaleIn}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-[#e94491]/10 to-[#f472b6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-[#e94491]" />
                  </div>
                  <div className="text-3xl font-light text-gray-800 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            variants={fadeInLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full flex items-center justify-center">
                <Send className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-gray-800">Send us a Message</h2>
                <p className="text-gray-600 text-sm">We'd love to hear from you</p>
              </div>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={slideInFromBottom}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div variants={slideInFromBottom}>
                  <label className="block text-sm text-gray-600 mb-2">Your Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12 transition-all duration-300 hover:border-gray-300"
                    required
                  />
                </motion.div>
                <motion.div variants={slideInFromBottom}>
                  <label className="block text-sm text-gray-600 mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12 transition-all duration-300 hover:border-gray-300"
                    required
                  />
                </motion.div>
              </motion.div>

              <motion.div
                variants={slideInFromBottom}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm text-gray-600 mb-2">Subject *</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12 transition-all duration-300 hover:border-gray-300"
                  required
                />
              </motion.div>

              <motion.div
                variants={slideInFromBottom}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm text-gray-600 mb-2">Message *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] min-h-[120px] transition-all duration-300 hover:border-gray-300"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white py-4 text-lg font-normal tracking-wider rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </motion.div>

          {/* Right Side Content */}
          <motion.div 
            className="space-y-8"
            variants={fadeInRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
           

            {/* Store Features */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-light text-gray-800">Why Choose Us</h3>
                  <p className="text-gray-600 text-sm">What makes us special</p>
                </div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {storeFeatures.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="group"
                    variants={scaleIn}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-[#e94491] transition-colors duration-300">
                        <feature.icon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Customer Support */}
            <motion.div 
              className="bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-2xl shadow-xl p-8 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Headphones className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-semibold">24/7 Customer Support</h3>
                  <p className="text-white/90 text-sm">We're here to help you anytime</p>
                </div>
              </motion.div>
              <motion.p 
                className="text-white/90 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Our dedicated support team is available around the clock to assist you with any questions or concerns.
                Get instant help through our multiple channels.
              </motion.p>
            
               
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Section */}
         {/* Google Maps */}
         <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 bg-gradient-to-r from-[#e94491]/10 to-[#f472b6]/10 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-gray-800">Find Our Store</h3>
                    <p className="text-gray-600 text-sm">Located in El Jadida, Morocco</p>
                  </div>
                </div>
              </div>
              <div className="relative h-64 md:h-80">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.9618836297973!2d-8.534645424268843!3d33.227076573478776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda91f004cda3c9d%3A0x7aac99b84b5c084b!2sShahine%20V%C3%AAtements%20pour%20femmes!5e1!3m2!1sen!2sma!4v1754515672299!5m2!1sen!2sma"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-b-2xl"
                ></iframe>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                  <MapPin className="inline h-4 w-4 mr-1 text-[#e94491]" />
                  Shahine Vêtements pour femmes, El Jadida, Morocco
                </p>
              </div>
            </motion.div>
      </motion.div>
    </div>
  )
}