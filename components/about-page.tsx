"use client"

import Image from "next/image"
import Link from "next/link"
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

export default function AboutPage() {
  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "10K+", label: "Products Sold", icon: ShoppingBag },
    { number: "15+", label: "Countries Served", icon: Globe },
    { number: "99%", label: "Satisfaction Rate", icon: Star },
  ]

  const values = [
    {
      icon: Heart,
      title: "Passion for Fashion",
      description:
        "We live and breathe fashion, constantly seeking the latest trends and timeless pieces that make you feel confident and beautiful.",
    },
    {
      icon: Award,
      title: "Quality First",
      description:
        "Every item in our collection is carefully selected for its quality, craftsmanship, and attention to detail.",
    },
    {
      icon: Users,
      title: "Customer Focused",
      description:
        "Your satisfaction is our priority. We're committed to providing exceptional service and support at every step.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "From Morocco to the world, we bring fashion-forward pieces to customers across the globe.",
    },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & Creative Director",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      description:
        "With over 15 years in fashion, Sarah leads our creative vision and ensures every piece meets our high standards.",
    },
    {
      name: "Ahmed Benali",
      role: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      description:
        "Ahmed ensures smooth operations and timely delivery, making sure your shopping experience is seamless.",
    },
    {
      name: "Maria Rodriguez",
      role: "Head of Design",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      description: "Maria brings creativity and innovation to our collections, always staying ahead of fashion trends.",
    },
  ]

  const milestones = [
    { year: "2018", title: "Founded", description: "Shahine was born with a vision to democratize fashion" },
    { year: "2019", title: "First Store", description: "Opened our flagship store in Casablanca" },
    { year: "2021", title: "Online Launch", description: "Launched our e-commerce platform" },
    { year: "2023", title: "Global Expansion", description: "Started shipping worldwide" },
    { year: "2024", title: "50K Customers", description: "Reached 50,000 happy customers milestone" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Beautiful Page Header */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://portotheme.com/html/molla/assets/images/page-header-bg.jpg"
            alt="Pattern Background"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e94491]/20 to-[#f472b6]/20"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full mb-6 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-light text-gray-800 mb-4 tracking-wide">About Shahine</h1>
          <p className="text-[#e94491] font-normal text-lg tracking-wider">OUR STORY</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e94491] to-[#f472b6] mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#e94491] transition-colors">
              Home
            </Link>
            <span className="text-gray-300">›</span>
            <span className="text-[#e94491]">About</span>
          </nav>
        </div>
      </div>

      {/* Hero Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-[#e94491] font-medium">
              <Sparkles className="h-5 w-5" />
              <span>Since 2018</span>
            </div>
            <h2 className="text-4xl font-light text-gray-800 leading-tight">
              Redefining Fashion, <br />
              <span className="text-[#e94491]">One Style at a Time</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Born from a passion for accessible luxury fashion, Shahine has grown from a small boutique dream into a
              global fashion destination. We believe that great style shouldn't be exclusive – it should be for
              everyone.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our journey began in the vibrant streets of Casablanca, where we discovered the perfect blend of
              traditional craftsmanship and contemporary design. Today, we continue to honor that heritage while
              embracing innovation and sustainability.
            </p>
            <Link href="/shop">
              <Button className="bg-gradient-to-r from-[#e94491] to-[#f472b6] hover:from-[#d63384] hover:to-[#e94491] text-white px-8 py-3 rounded-xl font-semibold tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Shahine Store"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-2xl blur-3xl opacity-30"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-[#e94491]/10 to-[#f472b6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-[#e94491]" />
                </div>
                <div className="text-3xl font-light text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-light text-gray-800">Our Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              To make high-quality, fashionable clothing accessible to everyone, regardless of their budget or location.
              We strive to create a shopping experience that's not just about buying clothes, but about discovering your
              personal style and feeling confident in your own skin.
            </p>
            <div className="flex items-center gap-2 text-[#e94491] font-medium">
              <CheckCircle className="h-5 w-5" />
              <span>Accessible luxury fashion for all</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-light text-gray-800">Our Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              To become the world's most trusted and beloved fashion destination, known for our commitment to quality,
              sustainability, and customer satisfaction. We envision a future where fashion is both beautiful and
              responsible, where every purchase makes a positive impact.
            </p>
            <div className="flex items-center gap-2 text-purple-500 font-medium">
              <TrendingUp className="h-5 w-5" />
              <span>Leading the future of fashion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from selecting products to serving our customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#e94491]/10 to-[#f472b6]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-6 w-6 text-[#e94491]" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{value.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-800 mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind Shahine who work tirelessly to bring you the best fashion experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h4>
                <p className="text-[#e94491] font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to global reach - here's how we've grown over the years
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#e94491] to-[#f472b6] rounded-full"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                      <div className="text-2xl font-light text-[#e94491] mb-2">{milestone.year}</div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{milestone.title}</h4>
                      <p className="text-gray-600 text-sm">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-light mb-4">Ready to Join Our Fashion Journey?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
            Discover our latest collections and become part of the Shahine family. Experience fashion that speaks to
            your soul.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#e94491] transition-all duration-300 px-8 py-3 rounded-xl font-semibold"
              >
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#e94491] transition-all duration-300 px-8 py-3 rounded-xl font-semibold"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
