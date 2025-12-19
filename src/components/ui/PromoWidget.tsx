import Link from "next/link";
import { ArrowRight, Sparkles, Rocket, Gift } from "lucide-react";

export default function PromoWidget() {
  return (
    <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-xl p-5 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-pink-400/20 rounded-full blur-xl" />
      </div>

      <div className="relative">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="h-4 w-4 text-yellow-300" />
          <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-0.5 rounded-full">
            NEW YEAR 2025
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold mb-2 leading-tight">
          Own a Travel Agency?
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <Gift className="h-5 w-5 text-yellow-300" />
          <span className="text-2xl font-bold text-yellow-300">50% OFF</span>
        </div>

        <p className="text-white/90 text-sm mb-4 leading-relaxed">
          Get a stunning professional website to grow your business in 2025!
        </p>

        {/* Features */}
        <ul className="text-xs text-white/80 space-y-1 mb-4">
          <li className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-300" />
            Modern responsive design
          </li>
          <li className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-300" />
            SEO optimized
          </li>
          <li className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-300" />
            Fast delivery
          </li>
        </ul>

        {/* CTA */}
        <Link
          href="https://www.orioustrategy.com/promo-new-year"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-white text-purple-700 py-2.5 rounded-lg text-sm font-bold hover:bg-yellow-300 hover:text-purple-900 transition-all hover:scale-[1.02]"
        >
          Claim Offer
          <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="text-white/60 text-xs text-center mt-2">
          Limited time • Ends Jan 31
        </p>
      </div>
    </div>
  );
}
