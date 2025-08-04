import { ChevronRight, ChevronLeft } from "lucide-react"

const pinkBannerItems = [
  "NEW SUMMER COLLECTION",
  "LIMITED EDITION DROPS",
  "FASHION THAT MOVES YOU",
  "ELEVATE YOUR STYLE",
  "DESIGNED FOR YOU",
]

const beigeBannerItems = [
  "UP TO 50% OFF SALE",
  "TRENDING NOW",
  "FREE SHIPPING ON ORDERS $50+",
  "SUSTAINABLE FABRICS",
  "MADE TO LAST",
]

export default function Banners() {
  return (
    <section>
      <div className="bg-[#f472b6] mt-10 text-white py-4 overflow-hidden">
        <div className="flex items-center gap-8 animate-marquee-left whitespace-nowrap">
          {/* Repeat items multiple times for seamless loop */}
          {Array.from({ length: 4 }, (_, repeatIndex) =>
            pinkBannerItems.map((item, index) => (
              <div key={`${repeatIndex}-${index}`} className="flex items-center gap-2 text-xl font-bold">
                <span>{item}</span>
                <ChevronLeft className="h-4 w-4" />
              </div>
            )),
          )}
        </div>
      </div>
      <div className="bg-[#e6d7c3] text-gray-700 py-4 overflow-hidden">
        <div className="flex items-center gap-8 animate-marquee-right whitespace-nowrap">
          {/* Repeat items multiple times for seamless loop */}
          {Array.from({ length: 4 }, (_, repeatIndex) =>
            beigeBannerItems.map((item, index) => (
              <div key={`${repeatIndex}-${index}`} className="flex items-center gap-2 text-xl font-semibold">
                <ChevronRight className="h-4 w-4" />
                <span>{item}</span>
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  )
}
