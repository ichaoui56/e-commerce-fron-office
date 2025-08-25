import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const heroCards = [
  {
    title: "TONGS",
    subtitle: "SOLDES D'ÉTÉ -70% DE RÉDUCTION",
    buttonText: "ACHETER MAINTENANT",
    imageUrl: "hero-img1.jpeg",
    alt: "Man in summer shirt",
    bgColor: "bg-[#e6d7c3]",
    position: "start",
    link: "/shop/kids",
  },
  {
    title: "ACCESSOIRES",
    subtitle: "HIVER 2019 JUSQU'À -50%",
    buttonText: "ACHETER MAINTENANT",
    imageUrl: "hero-img2.jpeg",
    alt: "Elegant silk scarf",
    bgColor: "bg-gray-200",
    position: "center",
    link: "/shop/homme",
  },
  {
    title: "NOUVEAUTÉS",
    subtitle: "VÊTEMENTS DE SPORT FEMME",
    buttonText: "ACHETER MAINTENANT",
    imageUrl: "hero-img3.jpeg",
    alt: "Woman in sportswear",
    bgColor: "bg-gray-300",
    position: "end",
    link: "/shop/pyjamas",
  },
]

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col">
      {/* Main Hero Card */}
      <div className="flex-1 relative bg-black bg-opacity-20 min-h-[60vh]">
        <Image
          src="https://i.ibb.co/SX34mm51/Whats-App-Image-2025-08-09-at-17-27-30.jpg"
          alt="Woman in denim outfit"
          fill
          className="object-cover z-0"
        />
        <div className="relative z-10 flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-center text-white">
            <p className="text-sm font-light mb-2 tracking-wider">NOUVELLE COLLECTION</p>
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wide">BOUTIQUE FEMME</h1>
            <Link
              href="/shop">
              <Button
                variant="outline"
                className="bg-transparent font-light border-b-2 border-white text-white hover:bg-white hover:text-black transition-colors duration-300 px-8 py-3 text-sm font-light tracking-wider"
              >
                DÉCOUVRIR MAINTENANT
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Three Cards Row */}
      <div className="flex-1 grid grid-cols-1 gap-2 md:grid-cols-3">
        {heroCards.map((card, index) => (
          <div key={index} className={`relative mt-2 overflow-hidden ${card.bgColor} group`}>
            <Image src={card.imageUrl || "/placeholder.svg"} alt={card.alt} fill className="object-cover z-0" />
            <div className="relative z-10 flex flex-col justify-center items-center text-center h-full p-8 bg-black bg-opacity-10">
              <p className="text-xs font-light text-white mb-2 tracking-wider">{card.title}</p>
              <h3 className="text-lg md:text-xl font-light text-white mb-4 tracking-wide leading-tight">
                {card.subtitle}
              </h3>
              <Link
                href={card.link}
                className="text-xs font-light text-white border-b-2 border-white pb-1 hover:text-black hover:border-black transition-colors duration-300 tracking-wider"
              >
                {card.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
