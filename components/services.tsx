import { Rocket, RefreshCw, Info, Headset } from "lucide-react"

const serviceItems = [
  { icon: Rocket, title: "Free Shipping", description: "orders $50 or more" },
  { icon: RefreshCw, title: "Free Returns", description: "within 30 days" },
  { icon: Info, title: "Get 20% Off 1 Item", description: "When you sign up" },
  { icon: Headset, title: "We Support", description: "24/7 amazing services" },
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
