"use client";

import { useState, useEffect, Suspense } from "react";
import { X, Sparkles, ArrowRight, Rocket, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function PromoBannerContent() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isMorocco, setIsMorocco] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if viewing Morocco content
    const country = searchParams.get("country");
    const isMoroccoPage = country === "Morocco" || pathname.includes("morocco");
    setIsMorocco(isMoroccoPage);

    // Check if user has dismissed the banner
    const bannerKey = isMoroccoPage ? "promo-can-banner-dismissed" : "promo-banner-dismissed";
    const dismissed = localStorage.getItem(bannerKey);
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      // Show again after 10 minutes
      if (Date.now() - dismissedTime < 10 * 60 * 1000) {
        setIsVisible(false);
      }
    }
    // Trigger animation after mount
    setTimeout(() => setIsAnimated(true), 100);
  }, [pathname, searchParams]);

  const handleDismiss = () => {
    setIsVisible(false);
    const bannerKey = isMorocco ? "promo-can-banner-dismissed" : "promo-banner-dismissed";
    localStorage.setItem(bannerKey, Date.now().toString());
  };

  if (!isVisible) return null;

  // Morocco CAN 2025 Promo
  if (isMorocco) {
    return (
      <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-400/20 rounded-full blur-xl animate-pulse delay-300" />
        </div>

        <div className="container mx-auto px-4 py-3 relative">
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 transition-all duration-700 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
            {/* Icon and Badge */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Trophy className="h-5 w-5 text-yellow-300 animate-bounce" style={{ animationDuration: "2s" }} />
                <Sparkles className="h-3 w-3 text-yellow-200 absolute -top-1 -right-1 animate-ping" />
              </div>
              <span className="bg-yellow-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse">
                ⚽ CAN 2025 Morocco
              </span>
            </div>

            {/* Main Text */}
            <div className="text-center sm:text-left">
              <span className="font-semibold text-sm sm:text-base">
                <span className="hidden sm:inline">🇲🇦 </span>
                Site Web Agence de Voyage au Maroc
                <span className="text-yellow-300 font-bold"> 3500 DH</span> au lieu de 8000 DH
              </span>
            </div>

            {/* CTA Button */}
            <Link
              href="https://www.orioustrategy.com/promo-can-2025"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-white text-green-700 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-yellow-300 hover:text-green-900 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
            >
              Profiter de l'Offre
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute right-2 top-1/2 -translate-y-1/2 sm:relative sm:right-0 sm:top-0 sm:translate-y-0 p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default New Year Promo
  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden border-b border-purple-500/30">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iLjAzIiBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-2 relative">
        <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-6 transition-all duration-700 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          {/* Badge */}
          <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-md shadow-lg">
            <Rocket className="h-3 w-3" />
            NEW YEAR DEAL
          </span>

          {/* Main Text - Shortened for mobile */}
          <span className="text-xs sm:text-sm font-medium text-center">
            <span className="hidden sm:inline">Launch your travel agency website in 2025! </span>
            <span className="sm:hidden">Travel agency website </span>
            <span className="text-amber-400 font-bold">50% OFF</span>
            <span className="hidden sm:inline"> on professional websites</span>
          </span>

          {/* CTA Button */}
          <Link
            href="https://www.orioustrategy.com/promo-new-year"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 px-3 py-1 rounded-md text-xs sm:text-sm font-bold hover:from-amber-300 hover:to-orange-300 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
          >
            Claim Offer
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PromoBanner() {
  return (
    <Suspense fallback={null}>
      <PromoBannerContent />
    </Suspense>
  );
}
