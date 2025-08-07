import Hero from "@/components/hero"
import Services from "@/components/services"
import Banners from "@/components/banners"
import NewArrivalsWrapper from "@/components/new-arrivals-wrapper"
import ScrollAnimation from "@/components/scrool-animation"

export default function Home() {

  return (
    <div className="min-h-screen">

      <ScrollAnimation delay={0} duration={0.5} once={true} className="">
        <Hero />
      </ScrollAnimation>

      <ScrollAnimation delay={0.5} duration={0.5} once={true} className="">
        <Services />
      </ScrollAnimation>

      <ScrollAnimation delay={0.5} duration={0.5} once={true} className="">
        <Banners />
      </ScrollAnimation>

      <ScrollAnimation delay={1} duration={0.5} once={true} className="">
        <NewArrivalsWrapper />
      </ScrollAnimation>
    </div>
  )
}
