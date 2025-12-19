import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles, Rocket } from "lucide-react";

interface CTASectionProps {
  variant?: "primary" | "secondary";
}

export default function CTASection({ variant = "primary" }: CTASectionProps) {
  const benefits = [
    "Access to 4000+ verified travel agencies",
    "Compare ratings and reviews instantly",
    "Direct contact with travel professionals",
    "Free to use, no registration required",
  ];

  if (variant === "secondary") {
    return (
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Plan Your Next Adventure?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with the best travel agencies worldwide and turn your dream
              vacation into reality.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                href="/agencies"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Find an Agency
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-foreground px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors border border-border"
              >
                Contact Us
              </Link>
            </div>

            {/* Promo Card */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl" />
              </div>
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Rocket className="h-6 w-6 text-yellow-300" />
                  <span className="bg-yellow-400 text-purple-900 text-sm font-bold px-3 py-1 rounded-full">
                    🎉 NEW YEAR 2025 SPECIAL
                  </span>
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  Own a Travel Agency? Get Your Website!
                </h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Launch a stunning, professional website for your travel agency. 
                  <span className="text-yellow-300 font-bold"> 50% OFF</span> on all website packages until January 31st!
                </p>
                <Link
                  href="https://www.orioustrategy.com/promo-new-year"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 hover:text-purple-900 transition-all hover:scale-105 shadow-lg"
                >
                  Claim Your 50% Discount
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 hero-gradient text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Journey Starts Here
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Whether you're planning a romantic getaway, family vacation, or
              business trip, our directory connects you with trusted travel
              professionals who can make it happen.
            </p>
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Browse All Agencies
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="relative space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold">4000+</div>
                  <div className="text-white/80">Travel Agencies</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">50+</div>
                  <div className="text-white/80">Countries Covered</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">100K+</div>
                  <div className="text-white/80">Happy Travelers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">4.7</div>
                  <div className="text-white/80">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Promo Card */}
            <Link
              href="https://www.orioustrategy.com/promo-new-year"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-2xl p-6 border border-white/30 hover:scale-[1.02] transition-transform cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                  🚀 NEW YEAR DEAL
                </span>
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                Travel Agency Owner? Get 50% OFF Your Website!
              </h4>
              <p className="text-white/90 text-sm mb-3">
                Professional website design to boost your bookings in 2025.
              </p>
              <span className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                Claim Offer <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
