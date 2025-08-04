import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const heroCards = [
  {
    title: "FLIP FLOP",
    subtitle: "SUMMER SALE -70% OFF",
    buttonText: "SHOP NOW",
    imageUrl: "https://portotheme.com/html/molla/assets/images/demos/demo-7/banners/banner-3.jpg",
    alt: "Man in summer shirt",
    bgColor: "bg-[#e6d7c3]",
    position: "start",
  },
  {
    title: "ACCESSORIES",
    subtitle: "2019 WINTER UP TO 50% OFF",
    buttonText: "SHOP NOW",
    imageUrl: "https://portotheme.com/html/molla/assets/images/demos/demo-7/banners/banner-4.jpg",
    alt: "Elegant silk scarf",
    bgColor: "bg-gray-200",
    position: "center",
  },
  {
    title: "NEW IN",
    subtitle: "WOMEN'S SPORTSWEAR",
    buttonText: "SHOP NOW",
    imageUrl: "https://portotheme.com/html/molla/assets/images/demos/demo-7/banners/banner-5.jpg",
    alt: "Woman in sportswear",
    bgColor: "bg-gray-300",
    position: "end",
  },
]

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col">
      {/* Main Hero Card */}
      <div className="flex-1 relative bg-black bg-opacity-20 min-h-[60vh]">
        <Image
          src="https://img.freepik.com/photos-gratuite/portrait-femme-debout-mur-gris-bras-croises-regarder-appareil-photo_23-2148169320.jpg?t=st=1753834339~exp=1753837939~hmac=17709b6602804b4a715ae1477d0c6166b37e199b9b2413896d74e8f4e5263427&w=1800"
          alt="Woman in denim outfit"
          fill
          className="object-cover z-0"
        />
        <div className="relative z-10 flex items-center justify-center h-full min-h-[60vh]">
          <div className="text-center text-white">
            <p className="text-sm font-light mb-2 tracking-wider">NEW COLLECTION</p>
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wide">SHOP WOMEN'S</h1>
            <Button
              variant="outline"
              className="bg-transparent font-light border-b-2 border-white text-white hover:bg-white hover:text-black transition-colors duration-300 px-8 py-3 text-sm font-light tracking-wider"
            >
              DISCOVER NOW
            </Button>
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
                href="#"
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
