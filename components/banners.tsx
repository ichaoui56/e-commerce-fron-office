import { ChevronRight, ChevronLeft } from "lucide-react"

const pinkBannerItems = [
  "NOUVELLE COLLECTION D'ÉTÉ",
  "LANCEMENTS EN ÉDITION LIMITÉE",
  "LA MODE QUI VOUS ANIME",
  "ÉLEVEZ VOTRE STYLE",
  "CONÇU POUR VOUS",
]

const beigeBannerItems = [
  "JUSQU'À 50% DE RÉDUCTION",
  "TENDANCE ACTUELLE",
  "LIVRAISON GRATUITE POUR LES COMMANDES DE 50$ ET PLUS",
  "TISSUS DURABLES",
  "FAIT POUR DURER",
]

export default function Banners() {
  return (
    <section>
      {/* Pink Banner */}
      <div className="bg-[#f472b6] mt-6 text-white py-2 sm:py-3 md:py-4 overflow-hidden">
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 animate-marquee-left whitespace-nowrap">
          {Array.from({ length: 4 }, (_, repeatIndex) =>
            pinkBannerItems.map((item, index) => (
              <div
                key={`${repeatIndex}-${index}`}
                className="flex items-center gap-1 text-sm sm:text-base md:text-xl font-semibold"
              >
                <span>{item}</span>
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            )),
          )}
        </div>
      </div>

      {/* Beige Banner */}
      <div className="bg-[#e6d7c3] text-gray-700 py-2 sm:py-3 md:py-4 overflow-hidden">
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 animate-marquee-right whitespace-nowrap">
          {Array.from({ length: 4 }, (_, repeatIndex) =>
            beigeBannerItems.map((item, index) => (
              <div
                key={`${repeatIndex}-${index}`}
                className="flex items-center gap-1 text-sm sm:text-base md:text-xl font-medium"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{item}</span>
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  )
}
