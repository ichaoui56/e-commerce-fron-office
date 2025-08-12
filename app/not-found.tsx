"use client"


import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Home, 
  ShoppingBag, 
  ArrowLeft, 
  Sparkles, 
  Heart,
  Star,
  MapPin,
  ChevronRight
} from 'lucide-react';


export default function LocalizedNotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  interface FloatingElement {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
  }
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Generate floating elements
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
    setFloatingElements(elements);
  }, []);

  const popularPages = [
    { name: "Nouveautés", href: "/shop/new", icon: Sparkles },
    { name: "Articles en Solde", href: "/shop/sale", icon: Star },
    { name: "Liste de Souhaits", href: "/wishlist", icon: Heart },
    { name: "À Propos de Nous", href: "/about", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-[#e94491]/20 to-[#f472b6]/15 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            left: '10%',
            top: '20%',
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-l from-purple-400/10 to-blue-400/10 rounded-full blur-2xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            right: '10%',
            bottom: '20%',
          }}
        />

        {/* Floating particles */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute w-2 h-2 bg-[#e94491]/30 rounded-full animate-pulse"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          />
        ))}

        {/* Geometric shapes */}
        <div className="absolute top-20 left-20 w-4 h-4 border-2 border-[#e94491]/40 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-32 right-32 w-6 h-6 border-2 border-[#f472b6]/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-10 w-3 h-3 bg-[#e94491]/50 transform rotate-45 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated 404 Number */}
          <div className="relative mb-8">
            <div className="text-9xl md:text-[12rem] lg:text-[14rem] font-light text-transparent bg-gradient-to-r from-[#e94491] via-[#f472b6] to-[#e94491] bg-clip-text bg-300% animate-pulse">
              404
            </div>
            <div className="absolute inset-0 text-9xl md:text-[12rem] lg:text-[14rem] font-light text-[#e94491]/10 blur-sm transform scale-110">
              404
            </div>
            
            {/* Decorative elements around 404 */}
            <div className="absolute -top-8 -left-8 w-16 h-16 border-4 border-[#e94491]/30 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
            <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-[#e94491]/20 to-[#f472b6]/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 -right-16 w-8 h-8 border-2 border-[#f472b6]/40 transform rotate-45 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight leading-tight mb-4 animate-fade-in-up">
              Oups ! Page Introuvable
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Il semble que vous ayez pris un mauvais virage. La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <div className="inline-flex items-center gap-2 text-[#e94491] font-medium">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-sm tracking-wider uppercase">Erreur : 404</span>
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => window.history.back()}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e94491] to-[#f472b6] text-white rounded-xl font-semibold tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Retour
            </button>
            
            <a 
              href="/"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#e94491] border-2 border-[#e94491] rounded-xl font-semibold tracking-wider hover:bg-[#e94491] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Page d'Accueil
            </a>
            
            <a 
              href="/shop"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-gray-700 border-2 border-gray-300 rounded-xl font-semibold tracking-wider hover:border-[#e94491] hover:text-[#e94491] transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Acheter Maintenant
            </a>
          </div>

          {/* Help Text */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#e94491] to-[#f472b6] rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-white animate-pulse" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Besoin d'Aide ?</h4>
            </div>
            <p className="text-gray-600 text-center leading-relaxed">
              Si vous cherchez quelque chose de spécifique, essayez notre recherche ci-dessus ou parcourez nos catégories. 
              Notre service client est également là pour vous aider à trouver exactement ce dont vous avez besoin.
            </p>
            <div className="flex justify-center mt-6">
              <a 
                href="/contact"
                className="inline-flex items-center gap-2 text-[#e94491] hover:text-[#d63384] font-medium transition-colors duration-300"
              >
                Contacter le Support
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Decorative Quote */}
          <div className="mt-12 text-center">
            <blockquote className="text-lg md:text-xl text-gray-500 italic font-light">
              "Chaque grand voyage dans la mode commence par un simple pas... 
              <br className="hidden md:block" />
              même si c'est dans la mauvaise direction !"
            </blockquote>
            <div className="w-16 h-1 bg-gradient-to-r from-[#e94491] to-[#f472b6] mx-auto mt-4 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Additional floating animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .bg-300% {
          background-size: 300% 300%;
          animation: gradient-shift 3s ease-in-out infinite;
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      {/* Interactive sparkles that follow cursor */}
      <div 
        className="fixed w-4 h-4 pointer-events-none z-20 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      >
        <div className="w-full h-full bg-[#e94491]/50 rounded-full animate-ping"></div>
      </div>
    </div>
  );
}