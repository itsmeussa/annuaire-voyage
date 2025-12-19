import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Globe,
  CheckCircle,
  Plane,
  Hotel,
  Camera,
  HelpCircle,
} from "lucide-react";
import AgencyCard from "@/components/ui/AgencyCard";
import CTASection from "@/components/ui/CTASection";
import {
  getFeaturedAgencies,
  getUniqueCities,
  getAllAgencies,
  getUniqueCountries,
} from "@/lib/agencies";

// FAQ data for SEO
const faqData = [
  {
    question: "How do I find a reliable travel agency?",
    answer: "Use TravelAgencies.World to compare 4000+ verified travel agencies with real Google reviews. Filter by location, rating, and specialty to find the perfect match for your travel needs."
  },
  {
    question: "Are the travel agencies on this directory verified?",
    answer: "Yes, all 4000+ agencies in our directory are sourced from Google Maps with authentic reviews and ratings. We display real contact information and customer feedback."
  },
  {
    question: "How can I contact a travel agency?",
    answer: "Each agency listing includes direct contact information including phone numbers, websites, and Google Maps links. You can reach out directly without any intermediary."
  },
  {
    question: "Is it free to use TravelAgencies.World?",
    answer: "Yes, our directory is completely free to use for travelers. Browse, compare, and contact travel agencies at no cost."
  },
  {
    question: "What countries do you cover?",
    answer: "We cover 4000+ travel agencies in 50+ countries including Morocco, France, USA, Canada, UK, Spain, Netherlands, Malaysia, United Arab Emirates and many more. Our database is continuously growing."
  },
  {
    question: "How do I choose the best travel agency for my trip?",
    answer: "Consider the agency's rating, number of reviews, location, and specialization. Read customer reviews and compare multiple agencies before making your decision."
  },
  {
    question: "Which cities have the most travel agencies?",
    answer: "Our directory features agencies in major cities worldwide including Casablanca (400+), New York (50+), Toronto (45+), Ottawa (85+), and many more destinations."
  },
  {
    question: "Can I find travel agencies without a website?",
    answer: "Yes, use our website filter to find agencies with or without websites. Many excellent local agencies rely on phone bookings and walk-ins."
  }
];

export default function Home() {
  const featuredAgencies = getFeaturedAgencies(6);
  const cities = getUniqueCities().slice(0, 8);
  const countries = getUniqueCountries();
  const totalAgencies = getAllAgencies().length;

  // JSON-LD for homepage
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "TravelAgencies.World - Find the Best Travel Agencies Worldwide",
    description: "Discover and compare top-rated travel agencies around the world. Find trusted partners for your next adventure with verified reviews, ratings, and direct contact information.",
    url: "https://travelagencies.world",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalAgencies,
      itemListElement: featuredAgencies.slice(0, 6).map((agency, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TravelAgency",
          name: agency.title,
          url: `https://travelagencies.world/agencies/${agency.slug}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: agency.cityNormalized,
            addressCountry: agency.country
          },
          aggregateRating: agency.totalScore ? {
            "@type": "AggregateRating",
            ratingValue: agency.totalScore,
            reviewCount: agency.reviewsCount || 1,
            bestRating: 5,
            worstRating: 1
          } : undefined
        }
      }))
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://travelagencies.world"
      }
    ]
  };

  const features = [
    {
      icon: Shield,
      title: "Verified Agencies",
      description:
        "All agencies are verified with real reviews and ratings from Google.",
    },
    {
      icon: Star,
      title: "Top Rated",
      description:
        "Find the highest-rated travel agencies with proven track records.",
    },
    {
      icon: Clock,
      title: "Instant Contact",
      description:
        "Connect directly with agencies via phone, website, or Google Maps.",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description:
        "Browse agencies from multiple countries and destinations worldwide.",
    },
  ];

  const services = [
    {
      icon: Plane,
      title: "Flight Bookings",
      description: "Find agencies that specialize in flight reservations and airfare deals.",
    },
    {
      icon: Hotel,
      title: "Hotel & Accommodation",
      description: "Discover experts in hotel bookings and accommodation packages.",
    },
    {
      icon: Camera,
      title: "Tour Packages",
      description: "Connect with tour operators offering guided tours and experiences.",
    },
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="text-white py-20 md:py-32 relative overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/travellogos/background.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in-down">
              <Globe className="h-4 w-4 animate-pulse-slow" />
              <span className="text-sm font-medium">
                {totalAgencies}+ Travel Agencies Worldwide
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
              Find the Perfect <br />
              <span className="text-yellow-300 animate-pulse-slow">Travel Agency</span> for Your
              Adventure
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
              Browse our comprehensive directory of verified travel agencies.
              Compare ratings, read reviews, and connect directly with trusted
              travel professionals.
            </p>

            {/* Search Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-4 md:p-6 max-w-3xl mx-auto animate-scale-in delay-300 hover:bg-white/15 transition-all duration-500">
              <form
                action="/agencies"
                method="get"
                className="flex flex-col md:flex-row gap-4"
              >
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search by agency name or location..."
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all text-white placeholder:text-white/50"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary/90 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
                >
                  <Search className="h-5 w-5" />
                  Search
                </button>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 stagger-children">
              <div className="text-center hover:scale-110 transition-transform cursor-default">
                <div className="text-3xl md:text-4xl font-bold">
                  {totalAgencies}+
                </div>
                <div className="text-white/70">Agencies</div>
              </div>
              <div className="text-center hover:scale-110 transition-transform cursor-default">
                <div className="text-3xl md:text-4xl font-bold">50+</div>
                <div className="text-white/70">Cities</div>
              </div>
              <div className="text-center hover:scale-110 transition-transform cursor-default">
                <div className="text-3xl md:text-4xl font-bold">4.5</div>
                <div className="text-white/70">Avg Rating</div>
              </div>
              <div className="text-center hover:scale-110 transition-transform cursor-default">
                <div className="text-3xl md:text-4xl font-bold">10K+</div>
                <div className="text-white/70">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Directory?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make finding the right travel agency easy, transparent, and
              reliable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-all duration-300 hover:shadow-lg hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agencies */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured Travel Agencies
              </h2>
              <p className="text-lg text-muted-foreground">
                Top-rated agencies with excellent reviews and proven track
                records.
              </p>
            </div>
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline group"
            >
              View All Agencies
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {featuredAgencies.map((agency, index) => (
              <div key={agency.id} className="hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <AgencyCard agency={agency} featured />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Services Can You Find?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our directory includes agencies offering a wide range of travel services.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-muted/50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by City
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore travel agencies in popular destinations around the world.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
            {cities.map((city, index) => (
              <Link
                key={city}
                href={`/agencies?city=${encodeURIComponent(city)}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{city}</h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline group"
            >
              View All Destinations
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Finding your ideal travel agency is simple and straightforward.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Search & Filter",
                description:
                  "Use our powerful search to find agencies by location, rating, or specialty.",
              },
              {
                step: "2",
                title: "Compare & Review",
                description:
                  "View detailed profiles, ratings, and reviews to make an informed decision.",
              },
              {
                step: "3",
                title: "Contact Directly",
                description:
                  "Reach out via phone, website, or Google Maps to start planning your trip.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about finding the right travel agency
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection variant="primary" />

      {/* Trust Badges */}
      <section className="py-12 bg-white border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Verified Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Real Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Trusted by Travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free to Use</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
