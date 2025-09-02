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
    { id: "all", name: "Toutes les questions", icon: HelpCircle, count: 24 },
    { id: "orders", name: "Commandes et achats", icon: ShoppingCart, count: 8 },
    { id: "shipping", name: "Expédition et livraison", icon: Truck, count: 6 },
    { id: "payments", name: "Paiements et facturation", icon: CreditCard, count: 5 },
    { id: "returns", name: "Retours et échanges", icon: RotateCcw, count: 5 },
  ]

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "Comment passer une commande ?",
      answer:
        "Pour passer une commande, parcourez simplement notre collection, sélectionnez les articles souhaités, choisissez la taille et la couleur, ajoutez-les au panier et procédez au paiement. Vous devrez fournir les informations d'expédition et les détails de paiement pour finaliser votre achat.",
      category: "orders",
    },
    {
      id: 2,
      question: "Quels moyens de paiement acceptez-vous ?",
      answer:
        "Nous acceptons toutes les principales cartes de crédit (Visa, Mastercard, American Express), PayPal, Apple Pay et les virements bancaires. Tous les paiements sont traités de manière sécurisée via notre système de paiement crypté.",
      category: "payments",
    },
    {
      id: 3,
      question: "Combien de temps prend l'expédition ?",
      answer:
        "L'expédition standard prend 3 à 5 jours ouvrables au Maroc. L'expédition express est disponible en 1 à 2 jours ouvrables. L'expédition internationale prend 7 à 14 jours ouvrables selon la destination.",
      category: "shipping",
    },
    {
      id: 4,
      question: "Puis-je retourner ou échanger des articles ?",
      answer:
        "Oui ! Nous offrons une politique de retour de 30 jours pour les articles non portés, dans leur état d'origine avec les étiquettes attachées. Les échanges sont gratuits et les retours sont traités dans les 5 à 7 jours ouvrables suivant la réception de vos articles.",
      category: "returns",
    },
    {
      id: 5,
      question: "Comment suivre ma commande ?",
      answer:
        "Une fois votre commande expédiée, vous recevrez un numéro de suivi par e-mail. Vous pouvez également suivre votre commande en vous connectant à votre compte et en visitant la section 'Mes commandes'.",
      category: "orders",
    },
    {
      id: 6,
      question: "Proposez-vous la livraison internationale ?",
      answer:
        "Oui, nous livrons dans le monde entier ! Les frais de livraison internationale varient selon la destination et sont calculés au moment du paiement. Veuillez noter que des droits de douane et des taxes peuvent s'appliquer en fonction de votre pays.",
      category: "shipping",
    },
    {
      id: 7,
      question: "Et si mon article ne me va pas ?",
      answer:
        "Nous offrons des échanges gratuits pour différentes tailles dans les 30 jours. Veuillez consulter notre guide des tailles avant de commander. Si vous n'êtes pas sûr de la taille, notre service client se fera un plaisir de vous aider.",
      category: "returns",
    },
    {
      id: 8,
      question: "Mes informations de paiement sont-elles sécurisées ?",
      answer:
        "Nous utilisons un cryptage SSL standard de l'industrie pour protéger vos informations de paiement. Nous ne stockons jamais les détails de votre carte de crédit sur nos serveurs et toutes les transactions sont traitées via des passerelles de paiement sécurisées.",
      category: "payments",
    },
    {
      id: 9,
      question: "Quelle est votre politique de retour ?",
      answer:
        "Nous offrons une garantie de remboursement de 30 jours sur tous nos produits. Si vous n'êtes pas satisfait, vous pouvez retourner l'article pour un remboursement complet. Veuillez consulter notre page Retours pour plus de détails.",
      category: "returns",
    },
    {
      id: 10,
      question: "Comment utiliser un code de réduction ?",
      answer:
        "Vous pouvez appliquer votre code de réduction au moment du paiement. Il y aura un champ pour entrer votre code, et la réduction sera appliquée à votre total avant que vous ne confirmiez le paiement.",
      category: "orders",
    },
    {
      id: 11,
      question: "Puis-je modifier ou annuler ma commande ?",
      answer:
        "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa passation. Passé ce délai, votre commande aura peut-être déjà été traitée et expédiée. Veuillez contacter immédiatement notre équipe de support pour obtenir de l'aide.",
      category: "orders",
    },
    {
      id: 12,
      question: "Quels sont les frais de livraison ?",
      answer:
        "Les frais de livraison dépendent de votre emplacement et du mode de livraison que vous choisissez. La livraison standard est gratuite pour les commandes de plus de 500 DHS au Maroc. Vous pouvez voir le coût exact de la livraison au moment du paiement.",
      category: "shipping",
    },
    {
      id: 13,
      question: "Que faire si je reçois un article endommagé ?",
      answer:
        "Nous sommes vraiment désolés d'apprendre cela ! Veuillez contacter notre service client dans les 48 heures suivant la réception de votre commande avec des photos de l'article endommagé. Nous organiserons un remplacement ou un remboursement complet.",
      category: "returns",
    },
    {
      id: 14,
      question: "Y a-t-il des frais cachés ?",
      answer:
        "Non, le prix que vous voyez au moment du paiement est le prix final. Nous croyons en une tarification transparente. Toutes les taxes applicables sont incluses dans le prix affiché.",
      category: "payments",
    },
    {
      id: 15,
      question: "Comment trouver ma taille ?",
      answer:
        "Nous avons un guide des tailles détaillé sur chaque page de produit. Vous pouvez également contacter notre service client pour des conseils de taille personnalisés. Nous sommes heureux de vous aider à trouver la coupe parfaite !",
      category: "orders",
    },
    {
      id: 16,
      question: "Combien de temps faut-il pour traiter un retour ?",
      answer:
        "Une fois que nous recevons votre article retourné, il faut généralement 5 à 7 jours ouvrables pour traiter le retour et émettre un remboursement ou un échange. Vous serez averti par e-mail une fois le processus terminé.",
      category: "returns",
    },
    {
      id: 17,
      question: "Proposez-vous des cartes-cadeaux ?",
      answer:
        "Oui, nous proposons des cartes-cadeaux électroniques de différentes valeurs. Elles constituent le cadeau parfait et peuvent être utilisées pour n'importe quel article de notre boutique. Vous pouvez les acheter directement sur notre site Web.",
      category: "orders",
    },
    {
      id: 18,
      question: "Comment puis-je contacter le service client ?",
      answer:
        "Vous pouvez nous joindre par e-mail à support@shahine.com, par téléphone au +212 523 123 456, ou via notre formulaire de contact sur le site. Notre équipe est disponible 24h/24 et 7j/7 pour vous aider.",
      category: "orders",
    },
    {
      id: 19,
      question: "Mon colis est retardé, que dois-je faire ?",
      answer:
        "Nous nous excusons pour le désagrément. Veuillez vérifier le numéro de suivi pour les dernières mises à jour. Si le retard est important, veuillez contacter notre support et nous enquêterons auprès du transporteur.",
      category: "shipping",
    },
    {
      id: 20,
      question: "Puis-je utiliser plusieurs codes de réduction sur une seule commande ?",
      answer:
        "Actuellement, notre système n'autorise qu'un seul code de réduction par commande. Vous pouvez choisir d'utiliser celui qui vous offre la meilleure réduction.",
      category: "payments",
    },
    {
      id: 21,
      question: "Les couleurs des produits sont-elles fidèles aux photos ?",
      answer:
        "Nous nous efforçons d'afficher les couleurs des produits aussi précisément que possible. Cependant, les couleurs peuvent varier en fonction des paramètres de votre moniteur. De légères variations peuvent se produire.",
      category: "orders",
    },
    {
      id: 22,
      question: "Quand les articles en rupture de stock seront-ils réapprovisionnés ?",
      answer:
        "Nous réapprovisionnons les articles populaires régulièrement. Vous pouvez vous inscrire pour être averti par e-mail sur la page du produit afin d'être le premier informé de son retour en stock.",
      category: "orders",
    },
    {
      id: 23,
      question: "Quels sont les délais de livraison pendant les vacances ?",
      answer:
        "Pendant les périodes de vacances chargées, les délais de livraison peuvent être légèrement plus longs que d'habitude. Nous vous recommandons de passer vos commandes à l'avance. Toutes les mises à jour seront affichées sur notre site Web.",
      category: "shipping",
    },
    {
      id: 24,
      question: "Comment est calculée la TVA ?",
      answer:
        "La taxe sur la valeur ajoutée (TVA) est incluse dans le prix de nos produits, conformément à la réglementation marocaine. Le prix que vous voyez est le prix final que vous payez.",
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
      icon: MessageCircle,
      title: "Disponibilité du chat en direct",
      description: "Notre équipe est en ligne et prête à vous aider 24/7.",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      icon: Clock,
      title: "Temps de réponse moyen",
      description: "Nous répondons généralement en moins de 15 minutes.",
      iconColor: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      icon: Star,
      title: "Évaluation du support client",
      description: "98% de nos clients qualifient notre support d'excellent.",
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
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
            Vos questions, nos réponses
          </motion.h1>
          <motion.p 
            className="text-[#e94491] font-normal text-lg tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            AIDE & FAQ
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
              Accueil
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
          whileHover={{ y: -3 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-light text-gray-800">Comment pouvons-nous vous aider ?</h2>
            <p className="text-gray-600">Veuillez essayer un autre terme de recherche ou parcourir les catégories ci-dessous.</p>
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
              placeholder="Rechercher des questions..."
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
                Catégories
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
                  <span className="font-semibold text-gray-800">Besoin d'aide ?</span>
                </motion.div>
                <motion.p 
                  className="text-sm text-gray-600 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Vous ne trouvez pas ce que vous cherchez ?
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link href="/contact">
                    <Button className="w-full bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white rounded-xl transform hover:-translate-y-1 transition-all duration-300">
                      Contacter le support
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
                    {activeCategory === "all" ? "Toutes les questions" : categories.find((c) => c.id === activeCategory)?.name}
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
                        Aucun résultat trouvé pour
                      </motion.h3>
                      <motion.p 
                        className="text-gray-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        Essayez d'ajuster votre recherche ou de parcourir les différentes catégories.
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