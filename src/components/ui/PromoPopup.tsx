"use client";

import { useState, useEffect, Suspense } from "react";
import { X, Sparkles, ArrowRight, Rocket, Trophy, Gift, Star, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function PromoPopupContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMorocco, setIsMorocco] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if viewing Morocco content
    const country = searchParams.get("country");
    const isMoroccoPage = country === "Morocco" || pathname.includes("morocco");
    setIsMorocco(isMoroccoPage);

    // Check if user has dismissed the popup
    const popupKey = isMoroccoPage ? "promo-can-popup-dismissed" : "promo-popup-dismissed";
    const dismissed = localStorage.getItem(popupKey);
    
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      // Show again after 12 hours
      if (Date.now() - dismissedTime < 12 * 60 * 60 * 1000) {
        return;
      }
    }

    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  const handleDismiss = () => {
    setIsVisible(false);
    const popupKey = isMorocco ? "promo-can-popup-dismissed" : "promo-popup-dismissed";
    localStorage.setItem(popupKey, Date.now().toString());
  };

  if (!isVisible) return null;

  // Morocco CAN 2025 Promo Popup
  if (isMorocco) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-md bg-gradient-to-br from-green-600 via-emerald-700 to-green-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-400/20 rounded-full blur-3xl" />
            <div className="absolute top-4 right-16 text-4xl animate-bounce" style={{ animationDuration: "2s" }}>⚽</div>
            <div className="absolute bottom-4 left-4 text-3xl">🇲🇦</div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="relative p-8 text-center text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-green-900 px-4 py-1.5 rounded-full text-sm font-bold mb-4 animate-pulse">
              <Trophy className="h-4 w-4" />
              OFFRE SPÉCIALE CAN 2025
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-2">
              Site Web pour Agence de Voyage
            </h3>

            {/* Price */}
            <div className="mb-4">
              <span className="text-yellow-300 line-through text-lg">8000 DH</span>
              <div className="text-5xl font-black text-white">3 500 DH</div>
              <span className="text-green-200 text-sm">Seulement 1000 DH d'avance</span>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <Zap className="h-4 w-4 text-yellow-300" />
                <span>Livraison 5 jours</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <Star className="h-4 w-4 text-yellow-300" />
                <span>Design Pro</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <Gift className="h-4 w-4 text-yellow-300" />
                <span>SEO inclus</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span>Hébergement 1 an</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="https://www.orioustrategy.com/promo-can-2025"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="inline-flex items-center justify-center gap-2 w-full bg-white text-green-700 px-6 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 hover:text-green-900 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Réserver Maintenant
              <ArrowRight className="h-5 w-5" />
            </Link>

            <p className="text-green-200 text-xs mt-4">
              Offre valable jusqu'au 21 décembre 2025
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default New Year Promo Popup
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-4 right-16 text-4xl animate-bounce" style={{ animationDuration: "2s" }}>🎉</div>
          <div className="absolute bottom-4 left-4 text-3xl">🚀</div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="relative p-8 text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4 animate-pulse">
            <Rocket className="h-4 w-4" />
            NEW YEAR 2025 OFFER
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-2">
            Professional Travel Agency Website
          </h3>

          {/* Price */}
          <div className="mb-4">
            <span className="text-pink-300 line-through text-lg">€1500</span>
            <div className="text-5xl font-black text-white">€590</div>
            <span className="text-purple-200 text-sm">€100 deposit only • 3-day delivery</span>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span>3-Day Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Star className="h-4 w-4 text-yellow-300" />
              <span>Modern Design</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Gift className="h-4 w-4 text-yellow-300" />
              <span>Full SEO Setup</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>1 Year Hosting</span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="https://www.orioustrategy.com/promo-new-year"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDismiss}
            className="inline-flex items-center justify-center gap-2 w-full bg-white text-purple-700 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-400 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Reserve Your Slot
            <ArrowRight className="h-5 w-5" />
          </Link>

          <p className="text-purple-200 text-xs mt-4">
            Limited spots available • Offer ends January 31, 2025
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PromoPopup() {
  return (
    <Suspense fallback={null}>
      <PromoPopupContent />
    </Suspense>
  );
}
