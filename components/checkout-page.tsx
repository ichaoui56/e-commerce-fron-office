// app/checkout/page.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Truck, Tag, ShoppingBag, Loader2, ArrowLeft, Package } from "lucide-react"
import { createOrder } from "@/lib/actions/orders"
import { getCartItems } from "@/lib/actions/cart" // Your actual cart actions
import type { CartItemForCheckout } from "@/lib/types"
import { toast } from "sonner"

// Shipping options constant
const shippingOptions = [
  { id: "El jadida", label: "LIVRAISON EL JADIDA", price: 20, cities: "El jadida" },
  { id: "Casablanca", label: "LIVRAISON CASABLANCA", price: 25, cities: "Casablanca" },
  { id: "autres", label: "RESTE DES VILLES", price: 35, cities: "Autres villes" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItemForCheckout[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    notes: "",
  })

  // Set default shipping to "El jadida" instead of "casablanca"
  const [selectedShipping, setSelectedShipping] = useState("El jadida")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [couponCode, setCouponCode] = useState("")
  const [showCouponField, setShowCouponField] = useState(false)

  // Load cart items on component mount
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const result = await getCartItems()
        if (result.success) {
          setCartItems(result.items)
        } else {
          toast.error(result.message || "Échec du chargement des articles du panier")
        }
      } catch (error) {
        console.error("Erreur de chargement du panier:", error)
        toast.error("Échec du chargement des articles du panier")
      } finally {
        setLoading(false)
      }
    }

    loadCartItems()
  }, [])

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  const selectedShippingOption = shippingOptions.find((option) => option.id === selectedShipping)
  const shippingCost = selectedShippingOption?.price || 0
  const total = subtotal + shippingCost

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Le nom complet est requis"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis"
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Veuillez saisir un numéro de téléphone valide"
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ville est requise"
    }

    // Add shipping validation - this should never trigger since we have a default, but good for safety
    if (!selectedShipping) {
      newErrors.shipping = "Veuillez sélectionner une option de livraison"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Veuillez saisir un code de réduction")
      return
    }
    // Implement coupon logic here
    toast.info("La fonctionnalité de coupon sera bientôt disponible")
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (cartItems.length === 0) {
      toast.error("Votre panier est vide")
      return
    }

    if (!selectedShipping) {
      toast.error("Veuillez sélectionner une option de livraison")
      return
    }

    setProcessing(true)

    try {
      const result = await createOrder({
        name: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        shippingCost: shippingCost,
        shippingOption: selectedShippingOption?.label || "",
      })

      if (result.success && result.orderRef) {
        toast.success("Commande passée avec succès !")
        // Redirect to order confirmation page
        router.push(`/order-confirmation/${result.orderRef}`)
      } else {
        toast.error(result.message || "Échec de la commande")
      }
    } catch (error) {
      console.error("Erreur de création de commande:", error)
      toast.error("Échec de la commande. Veuillez réessayer.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-[#e94491]" />
          <h2 className="text-2xl font-light text-gray-800 mb-2">Chargement de la page de paiement...</h2>
          <p className="text-gray-600">Veuillez patienter pendant que nous préparons votre commande</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-light text-gray-800 mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Il semble que vous n'avez pas ajouté de produits à votre panier. 
            Parcourez notre collection et trouvez quelque chose que vous aimez !
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-[#e94491] hover:bg-[#d63384] text-white py-3">
              <Link href="/shop">Parcourez les produits</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-[#e94491] text-[#e94491] hover:bg-[#e94491] hover:text-white py-3">
              <Link href="/cart">Voir le panier</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Beautiful Page Header */}
      <div className="relative py-16 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#e94491]/5 to-[#f472b6]/5"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full mb-6 shadow-xl">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-light text-gray-800 mb-4 tracking-wide">Paiement</h1>
          <p className="text-[#e94491] font-medium text-lg tracking-wider">TERMINEZ VOTRE COMMANDE</p>
          <div className="w-32 h-1 bg-gradient-to-r from-[#e94491] to-[#f472b6] mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#e94491] transition-colors">
              Accueil
            </Link>
            <span className="text-gray-300">›</span>
            <Link href="/shop" className="text-gray-500 hover:text-[#e94491] transition-colors">
              Boutique
            </Link>
            <span className="text-gray-300">›</span>
            <Link href="/cart" className="text-gray-500 hover:text-[#e94491] transition-colors">
              Panier
            </Link>
            <span className="text-gray-300">›</span>
            <span className="text-[#e94491] font-medium">Paiement</span>
          </nav>
        </div>
      </div>

      {/* Back to Cart Link */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-[#e94491] hover:text-[#d63384] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au panier</span>
        </Link>
      </div>

      {/* Checkout Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Coupon Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-[#e94491]" />
              <span className="text-gray-600">Avez-vous un code de réduction ?</span>
            </div>
            <button 
              onClick={() => setShowCouponField(!showCouponField)}
              className="text-[#e94491] hover:text-[#d63384] font-medium transition-colors"
            >
              {showCouponField ? 'Masquer' : 'Appliquer le code de réduction'}
            </button>
          </div>
          {showCouponField && (
            <div className="flex gap-3 max-w-md mt-4">
              <Input
                placeholder="Entrez votre code de réduction"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border-2 border-gray-200 rounded-xl focus:border-[#e94491]"
              />
              <Button 
                onClick={handleApplyCoupon}
                className="bg-[#e94491] hover:bg-[#d63384] text-white px-6 rounded-xl whitespace-nowrap"
              >
                Appliquer
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de facturation */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-light text-gray-800 mb-8 flex items-center gap-3">
                <Package className="w-6 h-6 text-[#e94491]" />
                Informations de facturation
              </h2>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`border-2 ${errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#e94491]'} rounded-xl h-12 transition-colors`}
                    placeholder="Entrez votre nom complet"
                    required
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="text-xs">⚠</span> {errors.fullName}
                  </p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`border-2 ${errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#e94491]'} rounded-xl h-12 transition-colors`}
                    placeholder="Entrez votre numéro de téléphone"
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="text-xs">⚠</span> {errors.phone}
                  </p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`border-2 ${errors.city ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#e94491]'} rounded-xl h-12 transition-colors`}
                    placeholder="Entrez votre ville"
                    required
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="text-xs">⚠</span> {errors.city}
                  </p>}
                </div>

                {/* Shipping Options - Now with enhanced mandatory styling */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="h-6 w-6 text-[#e94491]" />
                    <label className="text-lg font-medium text-gray-800">
                      Choisissez une option de livraison <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {errors.shipping && <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
                    <span className="text-xs">⚠</span> {errors.shipping}
                  </p>}
                  <div className="space-y-4">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                          selectedShipping === option.id
                            ? 'border-[#e94491] bg-gradient-to-r from-[#e94491]/5 to-[#f472b6]/5 shadow-md'
                            : 'border-gray-200 hover:border-[#e94491]/50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={(e) => {
                              setSelectedShipping(e.target.value)
                              // Clear shipping error if it exists
                              if (errors.shipping) {
                                setErrors((prev) => ({ ...prev, shipping: "" }))
                              }
                            }}
                            className="text-[#e94491] focus:ring-[#e94491] w-5 h-5"
                            required
                          />
                          <div>
                            <span className="text-gray-800 font-medium block">{option.label}</span>
                            <p className="text-sm text-gray-500 mt-1">{option.cities}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[#e94491] font-bold text-lg">{option.price} DHS</span>
                          <p className="text-xs text-gray-500">frais de livraison</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {/* Additional note about shipping being required */}
                  <p className="text-xs text-gray-500 mt-3 italic">
                    * La sélection d'une option de livraison est obligatoire pour finaliser votre commande.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <ShoppingBag className="h-6 w-6 text-[#e94491]" />
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Résumé de la commande</h2>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-medium text-gray-600 pb-3 border-b border-gray-200">
                  <span>Produit</span>
                  <span>Total</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                          src={item.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed">
                          {item.product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          <span className="text-xs text-gray-500">{item.color.name}</span>
                          <span className="text-xs text-gray-500">Couleur</span>
                          <span className="text-xs text-gray-500">Taille {item.size.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Quantité: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-800">
                          {item.subtotal.toFixed(2)} DHS
                        </span>
                        <p className="text-xs text-gray-500">
                          {item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">
                    Sous-total ({cartItems.reduce((total, item) => total + item.quantity, 0)} articles):
                  </span>
                  <span className="font-medium text-gray-800">{subtotal.toFixed(2)} DHS</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Livraison:</span>
                  <span className="font-medium text-[#e94491]">
                    {shippingCost === 0 ? 'GRATUIT' : `${shippingCost} DHS`}
                  </span>
                </div>
                <div className="flex justify-between py-4 text-xl font-bold border-t-2 border-gray-200">
                  <span className="text-[#e94491]">Total:</span>
                  <span className="text-[#e94491]">{total.toFixed(2)} DHS</span>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  💳 Méthode de paiement
                </h4>
                <p className="text-sm text-blue-700">Paiement à la livraison</p>
                <p className="text-xs text-blue-600 mt-1">
                  Payez lorsque vous recevez votre commande. Aucun paiement anticipé requis.
                </p>
              </div>

              {/* Place Order Button */}
              <Button 
                onClick={handlePlaceOrder}
                disabled={processing || cartItems.length === 0 || !selectedShipping}
                className="w-full bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white py-4 text-lg font-medium tracking-wider rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    TRAITEMENT DE LA COMMANDE...
                  </>
                ) : (
                  <>
                    🛍️ PASSER LA COMMANDE ({total.toFixed(2)} DHS)
                  </>
                )}
              </Button>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-center text-xs text-gray-600 leading-relaxed">
                  🔒 <strong>Paiement sécurisé:</strong> Vos données personnelles seront utilisées pour traiter votre commande, 
                  soutenir votre expérience sur ce site web, et pour d'autres fins décrites dans notre politique de confidentialité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}