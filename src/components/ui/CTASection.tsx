import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

interface CTASectionProps {
  variant?: "primary" | "secondary";
}

export default function CTASection({ variant = "primary" }: CTASectionProps) {
  const benefits = [
    "Access to 500+ verified travel agencies",
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
            <div className="flex flex-col sm:flex-row justify-center gap-4">
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
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-white/80">Travel Agencies</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">50+</div>
                  <div className="text-white/80">Cities Covered</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">10K+</div>
                  <div className="text-white/80">Happy Travelers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">4.7</div>
                  <div className="text-white/80">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
