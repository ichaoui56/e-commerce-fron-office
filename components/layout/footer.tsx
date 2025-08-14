"use client"

import React from "react"
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp,
  ExternalLink,
  Sparkles,
  Code,
  Palette,
  X,
  CreditCard,
  Shield,
  Truck,
  FileText,
  Lock,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [email, setEmail] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const TikTok = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M31.5 2c1.3 2.6 3.5 4.7 6.1 5.8 1.2.5 2.5.8 3.9.9V15c-2.6 0-5.2-.7-7.5-2v14.4c0 4.5-1.8 8.7-4.9 11.8-3.1 3.1-7.3 4.9-11.8 4.9s-8.7-1.8-11.8-4.9c-3.1-3.1-4.9-7.3-4.9-11.8s1.8-8.7 4.9-11.8c3.1-3.1 7.3-4.9 11.8-4.9.6 0 1.2 0 1.8.1v7.6c-.6-.2-1.2-.3-1.8-.3-4.3 0-7.8 3.5-7.8 7.8s3.5 7.8 7.8 7.8 7.8-3.5 7.8-7.8V2h6.6z" />
    </svg>
  )

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Inscription à la newsletter :", email)
    setEmail("")
  }

  const serviceClientItems = [
    {
      name: "Moyens de paiement",
      icon: CreditCard,
      content: {
        title: "Moyens de paiement disponibles",
        description: "Nous facilitons vos achats avec des options de paiement sécurisées",
        details: [
          {
            subtitle: "Paiement à la livraison",
            text: "Payez en espèces directement au livreur lors de la réception de votre commande. C'est notre seul moyen de paiement actuellement disponible.",
            highlight: "Paiement 100% sécurisé"
          },
          {
            subtitle: "Pourquoi le paiement à la livraison ?",
            text: "Cette méthode vous garantit de recevoir votre commande avant de payer, offrant ainsi une sécurité maximale pour vos achats.",
            highlight: "Zéro risque"
          }
        ]
      }
    },
    {
      name: "Garantie de remboursement",
      icon: Shield,
      content: {
        title: "Politique de remboursement",
        description: "Votre satisfaction est notre priorité absolue",
        details: [
          {
            subtitle: "Conditions de remboursement",
            text: "Vous pouvez récupérer votre argent si vous rapportez la facture avec vous et que l'étiquette est toujours en place sur le produit.",
            highlight: "Remboursement garanti"
          },
          {
            subtitle: "Documents requis",
            text: "• Facture d'achat originale\n• Produit avec étiquette intacte\n• Produit en parfait état",
            highlight: "Simple et rapide"
          },
          {
            subtitle: "Délai de retour",
            text: "Vous avez 14 jours après la réception de votre commande pour effectuer un retour.",
            highlight: "14 jours garantis"
          }
        ]
      }
    },
    {
      name: "Informations de livraison",
      icon: Truck,
      content: {
        title: "Livraison et frais de port",
        description: "Livraison rapide et fiable dans tout le Maroc",
        details: [
          {
            subtitle: "Tarifs de livraison",
            text: "• El Jadida : 20 DH\n• Casablanca : 25 DH\n• Autres villes : 35 DH",
            highlight: "Prix compétitifs"
          },
          {
            subtitle: "Délais de livraison",
            text: "• El Jadida & Casablanca : 24-48h\n• Autres villes : 2-4 jours ouvrables",
            highlight: "Livraison rapide"
          },
          {
            subtitle: "Suivi de commande",
            text: "Recevez un SMS avec le numéro de suivi dès l'expédition de votre commande.",
            highlight: "Suivi en temps réel"
          }
        ]
      }
    },
    {
      name: "Conditions générales",
      icon: FileText,
      content: {
        title: "Conditions générales d'utilisation",
        description: "Les règles qui régissent l'utilisation de notre boutique",
        details: [
          {
            subtitle: "Commandes",
            text: "Toute commande passée sur notre site constitue un contrat de vente. Nous nous réservons le droit d'annuler toute commande suspecte.",
            highlight: "Commande sécurisée"
          },
          {
            subtitle: "Prix et disponibilité",
            text: "Les prix sont indiqués en dirhams marocains (MAD) et peuvent être modifiés sans préavis. La disponibilité des produits est mise à jour régulièrement.",
            highlight: "Prix transparents"
          },
          {
            subtitle: "Responsabilité",
            text: "Nous ne pouvons être tenus responsables des dommages indirects résultant de l'utilisation de nos produits.",
            highlight: "Utilisation responsable"
          }
        ]
      }
    },
    {
      name: "Politique de confidentialité",
      icon: Lock,
      content: {
        title: "Protection de vos données personnelles",
        description: "Nous respectons votre vie privée et protégeons vos informations",
        details: [
          {
            subtitle: "Collecte des données",
            text: "Nous collectons uniquement les informations nécessaires au traitement de votre commande : nom, adresse, téléphone et email.",
            highlight: "Données minimales"
          },
          {
            subtitle: "Utilisation des données",
            text: "Vos données sont utilisées exclusivement pour le traitement et le suivi de vos commandes. Nous ne les vendons jamais à des tiers.",
            highlight: "Pas de revente"
          },
          {
            subtitle: "Sécurité",
            text: "Toutes vos données sont stockées de manière sécurisée et cryptées. Vous pouvez demander leur suppression à tout moment.",
            highlight: "Sécurité maximale"
          }
        ]
      }
    },
  ]

  const handleServiceClick = (service: any, index: any) => {
    setSelectedService(service)
    setSidebarOpen(true)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedService(null)
  }

  return (
    <>
      <footer className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 overflow-hidden">
        {/* Éléments d'arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#e94491]/5 to-[#f472b6]/3 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-500/3 to-blue-500/3 rounded-full blur-2xl"></div>
        </div>

        {/* Section Newsletter */}
        <div className="relative bg-gradient-to-r from-gray-50 to-white">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#e94491]/5 to-[#f472b6]/3"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 py-12 md:py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-[#e94491] animate-pulse" />
                <span className="text-sm font-medium text-[#e94491] uppercase tracking-wider">
                  Offres Exclusives
                </span>
                <Sparkles className="h-6 w-6 text-[#e94491] animate-pulse" />
              </div>

              <h3 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
                Recevez les dernières offres
              </h3>

              <p className="text-gray-600 mb-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Rejoignez notre communauté exclusive et recevez un{" "}
                <span className="text-[#e94491] font-semibold">coupon de 200 MAD</span>{" "}
                pour votre première expérience d'achat.
              </p>

              <div className="flex flex-col sm:flex-row justify-center max-w-lg mx-auto gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Entrez votre adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-[#e94491] focus:ring-2 focus:ring-[#e94491]/20 h-14 rounded-xl transition-all duration-300 shadow-sm outline-none"
                    required
                  />
                </div>
                <button
                  onClick={handleNewsletterSubmit}
                  className="bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white px-8 h-14 rounded-xl font-semibold tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  S'abonner <ArrowUp className="h-4 w-4 rotate-45" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal du pied de page */}
        <div className="relative py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Section Marque */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src="/shahine-logo.png"
                      alt="Logo Shahine"
                      width={140}
                      height={45}
                      className="object-contain"
                    />
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#e94491]/10 to-[#f472b6]/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  Découvrez les dernières tendances de la mode avec notre collection de vêtements et accessoires premium soigneusement sélectionnés. La qualité rencontre le style dans chaque pièce.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-[#e94491] flex-shrink-0" />
                    <span className="text-gray-600">Des questions ? Appelez-nous 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 flex-shrink-0"></div>
                    <span className="text-xl font-semibold text-[#e94491] hover:text-[#f472b6] transition-colors cursor-pointer">
                      +212 6 99 99 52 62
                    </span>
                  </div>
                </div>
              </div>

              {/* Liens rapides */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 relative">
                  Liens Rapides
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full"></div>
                </h4>
                <ul className="space-y-3">
                  {[
                    { name: "Notre histoire", link: "/about" },
                    { name: "Liste de souhaits", link: "/wishlist" },
                    { name: "Contact", link: "/contact" },
                    { name: "Boutique", link: "/shop" },
                    { name: "Panier", link: "/cart" },
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.link}
                        className="text-gray-600 hover:text-[#e94491] transition-all duration-300 flex items-center gap-2 group text-sm md:text-base"
                      >
                        <span className="w-1 h-1 bg-[#e94491] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service Client */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 relative">
                  Service Client
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full"></div>
                </h4>
                <ul className="space-y-3">
                  {serviceClientItems.map((service, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleServiceClick(service, index)}
                        className="text-gray-600 hover:text-[#e94491] transition-all duration-300 flex items-center gap-2 group text-sm md:text-base w-full text-left"
                      >
                        <service.icon className="h-4 w-4 text-[#e94491] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{service.name}</span>
                        <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & Réseaux Sociaux */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 relative">
                  Restez Connecté
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full"></div>
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#e94491] flex-shrink-0 mt-0.5" />
                    <div className="text-gray-600 text-sm md:text-base">
                      <p>Avenue Allal Al Fassi, Hay lmatar, El Jadida</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#e94491] flex-shrink-0" />
                    <a
                      href="mailto:shahinemaga@gmail.com"
                      className="text-gray-600 hover:text-[#e94491] transition-colors text-sm md:text-base"
                    >
                      shahinemaga@gmail.com
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Suivez-nous
                  </p>
                  <div className="flex gap-3">
                    {[
                      { Icon: Facebook, color: "hover:bg-[#3b5998]", href: "https://www.facebook.com/share/1FAYWxiPkj/?mibextid=wwXIfr" },
                      { Icon: Instagram, color: "hover:bg-[#e4405f]", href: "https://www.instagram.com/shahine_pyjama_maroc?utm_source=ig_web_button_share_sheet&igsh=MTF2aGo5NTEydWtvOQ==" },
                      { Icon: TikTok, color: "hover:bg-[#010101]", href: "https://www.tiktok.com/@shahine_pyjama_maroc?_t=ZS-8ysDY32Jpw7&_r=1" },
                    ].map(({ Icon, color, href }, index) => (
                      <Link
                        key={index}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
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

        {/* Barre inférieure */}
        <div className="relative border-t border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center lg:text-left">
                <p className="text-gray-500 text-sm">
                  © 2025 Shahine Store. Tous droits réservés.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={() => handleServiceClick(serviceClientItems[3], 3)}
                    className="text-gray-500 hover:text-[#e94491] transition-colors"
                  >
                    Conditions d'utilisation
                  </button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <button
                    onClick={() => handleServiceClick(serviceClientItems[4], 4)}
                    className="text-gray-500 hover:text-[#e94491] transition-colors"
                  >
                    Politique de confidentialité
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Créé avec</span>
                  <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                  <span>par</span>
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
                        Développeur Full Stack
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

        {/* Bouton retour en haut */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#e94491] to-[#f472b6] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center group"
          >
            <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        )}
      </footer>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeSidebar}
        ></div>

        {/* Sidebar content */}
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedService && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#e94491]/5 to-[#f472b6]/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full flex items-center justify-center">
                    <selectedService.icon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedService.content.title}</h2>
                </div>
                <button
                  onClick={closeSidebar}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-gray-600 mb-6 leading-relaxed">{selectedService.content.description}</p>

                <div className="space-y-6">
                  {selectedService.content.details.map((detail: any, index: any) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 text-lg">{detail.subtitle}</h3>
                        <span className="text-xs font-medium text-[#e94491] bg-[#e94491]/10 px-2 py-1 rounded-full">
                          {detail.highlight}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{detail.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Phone className="h-4 w-4 text-[#e94491]" />
                  <span>Besoin d'aide ? Contactez-nous au</span>
                  <span className="font-semibold text-[#e94491]">+212 6 99 99 52 62</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}