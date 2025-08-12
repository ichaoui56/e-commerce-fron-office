import { Rocket, RefreshCw, Info, Headset } from "lucide-react"

const serviceItems = [
  { icon: Rocket, title: "Livraison Gratuite", description: "Pour les commandes de 50 $ et plus" },
  { icon: RefreshCw, title: "Retours Gratuits", description: "Sous 30 jours" },
  { icon: Info, title: "-20% sur un article", description: "Lors de votre inscription" },
  { icon: Headset, title: "Support Client", description: "Service exceptionnel 24/7" },
]

export default function Services() {
  return (
    <section className="bg-[#f9f9f9] border-y border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 justify-center lg:justify-start">
              <item.icon className="h-8 w-8 text-gray-700 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
