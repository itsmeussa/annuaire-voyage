import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Target,
  Award,
  Globe,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About TravelAgencies.World | #1 Free Travel Agency Directory Worldwide",
  description:
    "Discover TravelAgencies.World - the world's largest free directory with 2670+ verified travel agencies across 50+ countries. CAN 2025 Morocco travel specialists. Find trusted agencies in Casablanca, Marrakech, Paris, New York, Toronto & more.",
  keywords: [
    "about TravelAgencies.World",
    "travel agency directory",
    "free travel agency listing",
    "verified travel agencies",
    "CAN 2025 travel agencies",
    "Morocco travel directory",
    "international travel agents",
    "tour operator directory",
  ],
  openGraph: {
    title: "About TravelAgencies.World | World's #1 Free Travel Agency Directory",
    description: "Learn about the world's largest free travel agency directory with 2670+ verified agencies in 50+ countries. CAN 2025 Morocco specialists.",
    url: "https://www.travelagencies.world/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About TravelAgencies.World",
    description: "World's largest free travel agency directory - 2670+ verified agencies in 50+ countries.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const stats = [
    { value: "3800+", label: "Travel Agencies" },
    { value: "50+", label: "Countries Covered" },
    { value: "10K+", label: "Monthly Visitors" },
    { value: "4.5", label: "Average Rating" },
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

  // Structured data for About page
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About TravelAgencies.World",
    description: "Learn about the world's largest free travel agency directory with 2670+ verified agencies.",
    url: "https://www.travelagencies.world/about",
    mainEntity: {
      "@type": "Organization",
      name: "TravelAgencies.World",
      description: "Free global directory of verified travel agencies",
      numberOfEmployees: "2-10",
      foundingDate: "2024"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.travelagencies.world"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://www.travelagencies.world/about"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
                Our Story
              </h2>
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="prose prose-lg mx-auto text-slate-600">
                  <blockquote className="text-2xl md:text-3xl font-medium text-slate-900 border-l-4 border-primary pl-6 mb-10 not-italic leading-relaxed">
                    "We believe travel is the only thing you buy that makes you richer. But in a world dominated by cold algorithms, the human touch was fading away."
                  </blockquote>

                  <p className="mb-6 leading-relaxed">
                    We've all been there: the late-night anxiety, wondering if that "perfect" hotel is real, or if there's actually a person to call when things don't go as planned. You aren't just booking a flight or a room; <span className="text-slate-900 font-medium">you are investing in your precious time, your family's memories, and your own dreams.</span>
                  </p>

                  <p className="mb-6 leading-relaxed">
                    That's why we built <span className="text-primary font-bold">TravelAgencies.World</span>. Not as another faceless booking engine, but as a bridge back to trust. We wanted to shine a light on the dedicated experts—the passionate travel agents—who turn good trips into life-changing experiences.
                  </p>

                  <p className="leading-relaxed">
                    Every agency here is more than a listing; it's a verified partner with a track record of care. Because we know that the most beautiful journeys aren't just about where you go, but <strong>who you trust to guide you there.</strong>
                  </p>
                </div>
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

        {/* Team Section */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Meet the Creators
              </h2>
              <p className="text-lg text-slate-600">
                The passionate minds utilizing technology to revolutionize the travel industry.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Oussama */}
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                      <Image
                        src="/travellogos/ous.jfif"
                        alt="Oussama Mounajjim"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 text-center mb-1">
                    Oussama Mounajjim
                  </h3>
                  <p className="text-primary font-medium text-center mb-4">AI Engineer | Data Scientist</p>
                  <p className="text-slate-600 text-center mb-6">
                    Driving the technical vision and ensuring a seamless, high-performance experience for travelers and agencies alike.
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="https://www.linkedin.com/in/oussama-mounajjim/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white rounded-full font-medium hover:bg-[#006396] transition-colors shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              {/* Zakaria */}
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                      <Image
                        src="/travellogos/zak.jfif"
                        alt="Zakaria Kharoufi"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 text-center mb-1">
                    Zakaria Kharoufi
                  </h3>
                  <p className="text-indigo-600 font-medium text-center mb-4">Storyteller & Creative Director</p>
                  <p className="text-slate-600 text-center mb-6">
                    Crafting intuitive digital experiences and building the robust architecture that powers our global directory.
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="https://www.linkedin.com/in/zakaria-kharoufi-9595671ba/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white rounded-full font-medium hover:bg-[#006396] transition-colors shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
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
                  Built for Excellence
                </h3>
                <p className="text-muted-foreground mb-6">
                  TravelAgencies.World is proudly developed and maintained by Orious
                  Strategy, a digital agency specializing in creating innovative web
                  solutions and digital experiences.
                </p>
                <p className="text-muted-foreground mb-6">
                  We combine cutting-edge technology with user-centered design to
                  build platforms that deliver real value to everyone.
                </p>
                <a
                  href="https://orioustrategy.com"
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
    </>
  );
}
