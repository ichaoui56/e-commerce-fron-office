"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
    // Handle form submission
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Store",
      details: ["123 Fashion Street", "Casablanca, Morocco 20000"],
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+212 522 123 456", "+212 661 234 567"],
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
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-light text-gray-800 mb-4 tracking-wide">Contact Us</h1>
          <p className="text-[#e94491] font-normal text-lg tracking-wider">GET IN TOUCH</p>
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
            <span className="text-[#e94491]">Contact</span>
          </nav>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
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
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full flex items-center justify-center">
                <Send className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-gray-800">Send us a Message</h2>
                <p className="text-gray-600 text-sm">We'd love to hear from you</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Your Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Subject *</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] h-12 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Message *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="border-2 border-gray-200 rounded-xl focus:border-[#e94491] min-h-[120px] transition-colors"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white py-4 text-lg font-normal tracking-wider rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Store Information */}
          <div className="space-y-8">
            {/* Store Image */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Shahine Store Interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="h-5 w-5" />
                    <span className="font-semibold">Shahine Fashion Store</span>
                  </div>
                  <p className="text-sm opacity-90">Experience fashion like never before</p>
                </div>
              </div>
            </div>

            {/* Store Features */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-light text-gray-800">Why Choose Us</h3>
                  <p className="text-gray-600 text-sm">What makes us special</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {storeFeatures.map((feature, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-[#e94491] transition-colors duration-300">
                        <feature.icon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Headphones className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-semibold">24/7 Customer Support</h3>
                  <p className="text-white/90 text-sm">We're here to help you anytime</p>
                </div>
              </div>
              <p className="text-white/90 mb-6 leading-relaxed">
                Our dedicated support team is available around the clock to assist you with any questions or concerns.
                Get instant help through our multiple channels.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#e94491] transition-all duration-300"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Live Chat
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#e94491] transition-all duration-300"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
