import Hero from "@/components/hero"
import Services from "@/components/services"
import NewArrivals from "@/components/new-arrivals"
import Banners from "@/components/banners"
import { getFeaturedProducts } from "@/lib/actions/products"

export default function Home() {

  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <Banners />
      <NewArrivals/>
    </div>
  )
}
