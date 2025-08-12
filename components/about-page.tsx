"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Users,
  Award,
  Globe,
  Sparkles,
  Target,
  Eye,
  TrendingUp,
  ShoppingBag,
  Star,
  CheckCircle,
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

export default function AboutPage() {
  const stats = [
    { number: "50K+", label: "Clients Satisfaits", icon: Users },
    { number: "10K+", label: "Produits Vendus", icon: ShoppingBag },
    { number: "15+", label: "Pays Desservis", icon: Globe },
    { number: "99%", label: "Taux de Satisfaction", icon: Star },
  ]

  const values = [
    {
      icon: Heart,
      title: "Passion pour la Mode",
      description:
        "Nous vivons et respirons la mode, à la recherche constante des dernières tendances et des pièces intemporelles pour que vous vous sentiez en confiance et magnifique.",
    },
    {
      icon: Award,
      title: "La Qualité d'Abord",
      description:
        "Chaque article de notre collection est soigneusement sélectionné pour sa qualité, son savoir-faire et son souci du détail.",
    },
    {
      icon: Users,
      title: "Centré sur le Client",
      description:
        "Votre satisfaction est notre priorité. Nous nous engageons à fournir un service et un soutien exceptionnels à chaque étape.",
    },
    {
      icon: Globe,
      title: "Portée Mondiale",
      description: "Du Maroc au monde entier, nous proposons des pièces avant-gardistes à nos clients du monde entier.",
    },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "Fondatrice & Directrice Créative",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      description:
        "Avec plus de 15 ans d'expérience dans la mode, Sarah dirige notre vision créative et s'assure que chaque pièce répond à nos normes élevées.",
    },
    {
      name: "Ahmed Benali",
      role: "Responsable des Opérations",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      description:
        "Ahmed assure le bon déroulement des opérations et une livraison ponctuelle, garantissant une expérience d'achat fluide.",
    },
    {
      name: "Maria Rodriguez",
      role: "Responsable du Design",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      description: "Maria apporte créativité et innovation à nos collections, toujours à la pointe des tendances de la mode.",
    },
  ]

  const milestones = [
    { year: "2018", title: "Fondation", description: "Shahine est née avec la vision de démocratiser la mode" },
    { year: "2019", title: "Premier Magasin", description: "Ouverture de notre magasin phare à Casablanca" },
    { year: "2021", title: "Lancement en Ligne", description: "Lancement de notre plateforme e-commerce" },
    { year: "2023", title: "Expansion Mondiale", description: "Début des livraisons à l'international" },
    { year: "2024", title: "50K Clients", description: "Atteint le jalon de 50 000 clients satisfaits" },
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
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            className="text-5xl font-light text-gray-800 mb-4 tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            À Propos de Shahine
          </motion.h1>
          <motion.p 
            className="text-[#e94491] font-normal text-lg tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            NOTRE HISTOIRE
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
            <span className="text-[#e94491]">À Propos</span>
          </nav>
        </div>
      </motion.div>

      {/* Hero Story Section */}
      <motion.div 
        className="container mx-auto px-4 py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-6"
            variants={fadeInLeft}
          >
            <motion.div 
              className="inline-flex items-center gap-2 text-[#e94491] font-medium"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-5 w-5" />
              <span>Depuis 2018</span>
            </motion.div>
            <motion.h2 
              className="text-4xl font-light text-gray-800 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Redéfinir la mode, <br />
              <span className="text-[#e94491]">Un style à la fois</span>
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Née d'une passion pour la mode de luxe accessible, Shahine est passée d'un petit rêve de boutique à une
              destination de mode mondiale. Nous croyons qu'un grand style ne devrait pas être exclusif – il devrait être pour
              tout le monde.
            </motion.p>
            <motion.p 
              className="text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Notre voyage a commencé dans les rues animées de Casablanca, où nous avons découvert le mélange parfait de
              l'artisanat traditionnel et du design contemporain. Aujourd'hui, nous continuons d'honorer cet héritage tout en
              adoptant l'innovation et la durabilité.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white px-8 py-3 rounded-xl font-semibold tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                  Découvrir la collection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative"
            variants={fadeInRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Shahine Store"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </motion.div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-2xl blur-3xl opacity-30"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-3xl opacity-20"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="bg-white py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto px-4">
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

      {/* Mission & Vision */}
      <motion.div 
        className="container mx-auto px-4 py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            variants={fadeInLeft}
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-light text-gray-800">Notre Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Rendre les vêtements de haute qualité et à la mode accessibles à tous, quel que soit leur budget ou leur emplacement.
              Nous nous efforçons de créer une expérience d'achat qui ne consiste pas seulement à acheter des vêtements, mais à découvrir votre
              style personnel et à vous sentir en confiance dans votre propre peau.
            </p>
            <div className="flex items-center gap-2 text-[#e94491] font-medium">
              <CheckCircle className="h-5 w-5" />
              <span>Mode de luxe accessible pour tous</span>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            variants={fadeInRight}
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-light text-gray-800">Notre Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Devenir la destination de mode la plus fiable et la plus appréciée au monde, connue pour notre engagement envers la qualité,
              la durabilité et la satisfaction du client. Nous envisageons un avenir où la mode est à la fois belle et
              responsable, où chaque achat a un impact positif.
            </p>
            <div className="flex items-center gap-2 text-purple-500 font-medium">
              <TrendingUp className="h-5 w-5" />
              <span>Mener l'avenir de la mode</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div 
        className="bg-gradient-to-r from-gray-50 to-white py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-4">Nos Valeurs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ces principes fondamentaux guident tout ce que nous faisons, de la sélection des produits au service de nos clients
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                variants={scaleIn}
                whileHover={{ y: -10 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#e94491]/10 to-[#f472b6]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-6 w-6 text-[#e94491]" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{value.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      {/* CTA Section */}
      <motion.div 
        className="container mx-auto px-4 py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div 
          className="bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-2xl shadow-2xl p-12 text-center text-white"
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2 
            className="text-3xl font-light mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Prêt(e) à Rejoindre Notre Aventure Mode ?
          </motion.h2>
          <motion.p 
            className="text-white/90 mb-8 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Découvrez nos dernières collections et rejoignez la famille Shahine. Vivez une mode qui parle à votre âme.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/shop">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#e94491] transition-all duration-300 px-8 py-3 rounded-xl font-semibold"
              >
                Acheter Maintenant
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#e94491] transition-all duration-300 px-8 py-3 rounded-xl font-semibold"
              >
                Contactez-nous
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}