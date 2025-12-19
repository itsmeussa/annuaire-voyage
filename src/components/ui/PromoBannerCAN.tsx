"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

export default function PromoBannerCAN() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("promo-can-banner-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      // Show again after 24 hours
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        setIsVisible(false);
      }
    }
    // Trigger animation after mount
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("promo-can-banner-dismissed", Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-400/20 rounded-full blur-xl animate-pulse delay-300" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg animate-bounce" style={{ animationDuration: "3s" }} />
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
