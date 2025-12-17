import { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Target,
  Award,
  Globe,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - TravelAgencies.World",
  description:
    "Learn about TravelAgencies.World, the leading global directory for finding and comparing travel agencies worldwide. Developed by Orious Strategy.",
};

export default function AboutPage() {
  const stats = [
    { value: "500+", label: "Travel Agencies" },
    { value: "50+", label: "Cities Covered" },
    { value: "10K+", label: "Monthly Visitors" },
    { value: "4.7", label: "Average Rating" },
  ];

  const values = [
    {
      icon: Target,
      title: "Transparency",
      description:
        "We provide honest, verified information from real Google reviews to help you make informed decisions.",
    },
    {
      icon: Users,
      title: "User-First",
      description:
        "Our platform is designed with travelers in mind, making it easy to find and connect with the right agency.",
    },
    {
      icon: Award,
      title: "Quality",
      description:
        "We highlight top-rated agencies with proven track records of excellent customer service.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "From local boutique agencies to international operators, we cover destinations worldwide.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About TravelAgencies.World
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We're on a mission to make finding the perfect travel agency as easy
            as booking a flight. Your dream vacation starts with the right partner.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p>
                Finding a trustworthy travel agency shouldn't be a journey in
                itself. That's why we created TravelAgencies.World — a
                comprehensive directory that brings together the best travel
                agencies from around the globe.
              </p>
              <p>
                We understand that planning a trip involves trust. You're not just
                booking a hotel or a flight; you're investing in memories,
                experiences, and moments that matter. Our platform is designed to
                connect you with travel professionals who share that understanding.
              </p>
              <p>
                Every agency in our directory is sourced from verified Google
                Places data, complete with real customer reviews and ratings. We
                believe in transparency, which is why we showcase both the
                highlights and the honest feedback.
              </p>
              <p>
                Whether you're planning a romantic getaway, a family adventure, a
                business trip, or a once-in-a-lifetime expedition,
                TravelAgencies.World is your starting point for finding the perfect
                travel partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose Our Directory?
              </h2>
              <ul className="space-y-4">
                {[
                  "Verified agencies with real Google reviews",
                  "Easy-to-use search and filter functionality",
                  "Direct contact information for quick connections",
                  "Comprehensive coverage across multiple countries",
                  "Regular updates to ensure accuracy",
                  "Free to use, no registration required",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/agencies"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
                >
                  Browse Agencies
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Developed by Orious Strategy
              </h3>
              <p className="text-muted-foreground mb-6">
                TravelAgencies.World is proudly developed and maintained by Orious
                Strategy, a digital agency specializing in creating innovative web
                solutions and digital experiences.
              </p>
              <p className="text-muted-foreground mb-6">
                We combine cutting-edge technology with user-centered design to
                build platforms that deliver real value to our users.
              </p>
              <a
                href="https://oriousstrategy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                Visit Orious Strategy
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Travel Partner?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Browse our comprehensive directory and connect with trusted travel
            agencies today.
          </p>
          <Link
            href="/agencies"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors"
          >
            Explore Agencies
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
