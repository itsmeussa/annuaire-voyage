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
} from "lucide-react";
import AgencyCard from "@/components/ui/AgencyCard";
import CTASection from "@/components/ui/CTASection";
import {
  getFeaturedAgencies,
  getUniqueCities,
  getAllAgencies,
} from "@/lib/agencies";

export default function Home() {
  const featuredAgencies = getFeaturedAgencies(6);
  const cities = getUniqueCities().slice(0, 8);
  const totalAgencies = getAllAgencies().length;

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

  // Structured data for the home page
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TravelAgencies.World",
    url: "https://travelagencies.world",
    description: "Find the best travel agencies worldwide. Compare ratings, read reviews, and connect with trusted travel professionals.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://travelagencies.world/agencies?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TravelAgencies.World",
    url: "https://travelagencies.world",
    logo: "https://travelagencies.world/logo.png",
    description: "World's largest directory of verified travel agencies",
    sameAs: [
      "https://www.instagram.com/travelagenciesworld",
      "https://www.facebook.com/travelagenciesworld"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+33-7-45-07-56-68",
      contactType: "customer service",
      availableLanguage: ["English", "French"]
    }
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Travel Agency Directory",
    description: `Browse ${totalAgencies}+ verified travel agencies worldwide`,
    url: "https://travelagencies.world",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalAgencies,
      itemListElement: featuredAgencies.map((agency, index) => ({
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
          }
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-32 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/3 rounded-full blur-3xl" />
        </div>
        
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
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-3xl mx-auto animate-scale-in delay-300 hover:shadow-3xl transition-shadow duration-500">
              <form
                action="/agencies"
                method="get"
                className="flex flex-col md:flex-row gap-4"
              >
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search by agency name or location..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 btn-glow hover:scale-105"
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

      {/* FAQ Section for SEO */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Common questions about finding and choosing travel agencies
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How do I find the best travel agency for my trip?",
                answer: "Use our directory to compare travel agencies by location, ratings, and reviews. Look for agencies with high ratings (4.5+), many positive reviews, and experience in your destination. You can filter by city, country, and specialty to find the perfect match."
              },
              {
                question: "Are the travel agencies on TravelAgencies.World verified?",
                answer: "Yes, all agencies in our directory are real businesses with verified information sourced from Google Maps. We display authentic ratings and reviews from actual customers to help you make informed decisions."
              },
              {
                question: "How can I contact a travel agency?",
                answer: "Each agency listing includes direct contact information such as phone numbers, websites, and links to their Google Maps location. You can reach out directly to discuss your travel plans and get quotes."
              },
              {
                question: "What types of travel agencies are listed?",
                answer: "Our directory includes various types of travel agencies: general tour operators, adventure travel specialists, luxury travel agencies, honeymoon planners, family vacation experts, and destination-specific agencies for Morocco, France, Spain, and many other countries."
              },
              {
                question: "Is it free to use TravelAgencies.World?",
                answer: "Yes, TravelAgencies.World is completely free for travelers. You can browse, search, compare, and contact any travel agency in our directory at no cost."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I find the best travel agency for my trip?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use our directory to compare travel agencies by location, ratings, and reviews. Look for agencies with high ratings (4.5+), many positive reviews, and experience in your destination. You can filter by city, country, and specialty to find the perfect match."
                }
              },
              {
                "@type": "Question",
                name: "Are the travel agencies on TravelAgencies.World verified?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, all agencies in our directory are real businesses with verified information sourced from Google Maps. We display authentic ratings and reviews from actual customers to help you make informed decisions."
                }
              },
              {
                "@type": "Question",
                name: "How can I contact a travel agency?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Each agency listing includes direct contact information such as phone numbers, websites, and links to their Google Maps location. You can reach out directly to discuss your travel plans and get quotes."
                }
              },
              {
                "@type": "Question",
                name: "What types of travel agencies are listed?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Our directory includes various types of travel agencies: general tour operators, adventure travel specialists, luxury travel agencies, honeymoon planners, family vacation experts, and destination-specific agencies for Morocco, France, Spain, and many other countries."
                }
              },
              {
                "@type": "Question",
                name: "Is it free to use TravelAgencies.World?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, TravelAgencies.World is completely free for travelers. You can browse, search, compare, and contact any travel agency in our directory at no cost."
                }
              }
            ]
          })
        }}
      />
    </>
  );
}
