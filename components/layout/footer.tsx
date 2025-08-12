"use client"

import type React from "react"

import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  PinIcon as Pinterest,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp,
  ExternalLink,
  Sparkles,
  Code,
  Palette,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <footer className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 overflow-hidden">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#e94491]/5 to-[#f472b6]/3 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-500/3 to-blue-500/3 rounded-full blur-2xl"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative bg-gradient-to-r from-gray-50 to-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/blurry-houseplants.png"
            alt="Abstract background of plants"
            fill
            className="object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e94491]/5 to-[#f472b6]/3"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-[#e94491] animate-pulse" />
              <span className="text-sm font-medium text-[#e94491] uppercase tracking-wider">Offres Exclusives</span>
              <Sparkles className="h-6 w-6 text-[#e94491] animate-pulse" />
            </div>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
              Recevez les dernières offres
            </h3>

            <p className="text-gray-600 mb-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Rejoignez notre communauté exclusive et recevez un <span className="text-[#e94491] font-semibold">coupon de 200 MAD</span>{" "}
              pour votre première expérience d'achat
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row justify-center max-w-lg mx-auto gap-4"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Entrez votre adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-[#e94491] focus:ring-[#e94491] h-14 rounded-xl transition-all duration-300 shadow-sm"
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white px-8 h-14 rounded-xl font-semibold tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Subscribe <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src="/shahine-logo.png"
                    alt="Shahine Logo"
                    width={140}
                    height={45}
                    className="object-contain"
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#e94491]/10 to-[#f472b6]/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                Discover the latest trends in fashion with our curated collection of premium clothing and accessories.
                Quality meets style in every piece.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-[#e94491] flex-shrink-0" />
                  <span className="text-gray-600">Got Questions? Call us 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex-shrink-0"></div>
                  <span className="text-xl font-semibold text-[#e94491] hover:text-[#f472b6] transition-colors cursor-pointer">
                    +0123 456 789
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 relative">
                Liens Rapides
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Notre histoire", href: "/about" },
                  { name: "Carrières", href: "/careers" },
                  { name: "Presse", href: "/press" },
                  { name: "Blog", href: "/blog" },
                  { name: "Contact", href: "/contact" },
                  { name: "Guide des tailles", href: "/size-guide" },
                  { name: "Suivre ma commande", href: "/track" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#e94491] transition-all duration-300 flex items-center gap-2 group text-sm md:text-base"
                    >
                      <span className="w-1 h-1 bg-[#e94491] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 relative">
                Customer Service
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Payment Methods", href: "/payments" },
                  { name: "Money-back Guarantee", href: "/guarantee" },
                  { name: "Returns & Exchanges", href: "/returns" },
                  { name: "Shipping Info", href: "/shipping" },
                  { name: "Terms & Conditions", href: "/terms" },
                  { name: "Privacy Policy", href: "/privacy" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#e94491] transition-all duration-300 flex items-center gap-2 group text-sm md:text-base"
                    >
                      <span className="w-1 h-1 bg-[#e94491] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 relative">
                Stay Connected
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full"></div>
              </h4>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#e94491] flex-shrink-0 mt-0.5" />
                  <div className="text-gray-600 text-sm md:text-base">
                    <p>123 Fashion Street</p>
                    <p>Casablanca, Morocco 20000</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#e94491] flex-shrink-0" />
                  <a
                    href="mailto:info@shahine.com"
                    className="text-gray-600 hover:text-[#e94491] transition-colors text-sm md:text-base"
                  >
                    info@shahine.com
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { Icon: Facebook, color: "hover:bg-[#3b5998]", href: "#" },
                    { Icon: Twitter, color: "hover:bg-[#1da1f2]", href: "#" },
                    { Icon: Instagram, color: "hover:bg-[#e4405f]", href: "#" },
                    { Icon: Youtube, color: "hover:bg-[#ff0000]", href: "#" },
                    { Icon: Pinterest, color: "hover:bg-[#bd081c]", href: "#" },
                  ].map(({ Icon, color, href }, index) => (
                    <Link
                      key={index}
                      href={href}
                      className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 ${color} hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 border border-gray-200 hover:border-transparent shadow-sm hover:shadow-md`}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Developer Credit */}
      <div className="relative border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center lg:text-left">
              <p className="text-gray-500 text-sm">© 2024 Shahine Store. Tous droits réservés.</p>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/terms" className="text-gray-500 hover:text-[#e94491] transition-colors">
                  Conditions d'utilisation
                </Link>
                <div className="w-px h-4 bg-gray-300"></div>
                <Link href="/privacy" className="text-gray-500 hover:text-[#e94491] transition-colors">
                  Politique de confidentialité
                </Link>
              </div>
            </div>

            {/* Developer Credit */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Crafted with</span>
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <span>by</span>
              </div>

              <Link
                href="https://i-chaoui.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 hover:from-[#e94491]/5 hover:to-[#f472b6]/5 hover:border-[#e94491]/30 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full flex items-center justify-center">
                      <Code className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  </div>

                  <div className="text-left">
                    <p className="text-gray-800 font-semibold text-sm group-hover:text-[#e94491] transition-colors">
                      Ilyas Chaoui
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                      Full Stack Developer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Palette className="h-3 w-3 text-[#e94491] group-hover:rotate-12 transition-transform duration-300" />
                  <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-[#e94491] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#e94491] to-[#f472b6] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
        >
          <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}
    </footer>
  )
}
