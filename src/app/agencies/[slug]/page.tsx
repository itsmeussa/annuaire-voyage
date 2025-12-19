import { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Globe,
  ExternalLink,
  Star,
  Users,
  ArrowLeft,
  Share2,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import CTASection from "@/components/ui/CTASection";
import AgencyCard from "@/components/ui/AgencyCard";
import { getAgencyBySlug, getAllAgencies, filterAgencies } from "@/lib/agencies";

// Dynamic import for map component (no SSR)
const FastAgencyMap = dynamic(() => import("@/components/ui/FastAgencyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-muted rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const agencies = getAllAgencies();
  return agencies.map((agency) => ({
    slug: agency.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agency = getAgencyBySlug(slug);

  if (!agency) {
    return {
      title: "Agency Not Found",
    };
  }

  const ratingText = agency.totalScore ? ` ⭐ ${agency.totalScore}/5` : "";
  const reviewText = agency.reviewsCount ? ` (${agency.reviewsCount.toLocaleString()} reviews)` : "";
  const locationText = `${agency.cityNormalized}, ${agency.country}`;
  
  // Create a rich, SEO-optimized description
  const metaDescription = `${agency.title} - Verified ${agency.category} in ${locationText}.${ratingText}${reviewText} Book tours, flights, hotels & travel packages. Contact: ${agency.phone || "Available on request"}. ${agency.website ? "Official website available." : ""}`;
  
  // Create comprehensive title
  const metaTitle = `${agency.title} | ${agency.category} in ${locationText} - Reviews & Contact`;

  return {
    title: metaTitle,
    description: metaDescription.slice(0, 160),
    keywords: [
      agency.title,
      `${agency.category} ${agency.cityNormalized}`,
      `travel agency ${agency.cityNormalized}`,
      `tour operator ${agency.cityNormalized}`,
      `${agency.cityNormalized} travel agent`,
      `best travel agency ${agency.country}`,
      `${agency.category} ${agency.country}`,
      `book travel ${agency.cityNormalized}`,
      `${agency.cityNormalized} tours`,
      `${agency.country} travel agency`,
      agency.street ? `travel agency near ${agency.street}` : null,
    ].filter(Boolean) as string[],
    openGraph: {
      title: `${agency.title} - ${agency.category} in ${locationText}`,
      description: metaDescription.slice(0, 200),
      type: "website",
      url: `https://www.travelagencies.world/agencies/${agency.slug}`,
      siteName: "TravelAgencies.World",
      locale: "en_US",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${agency.title} - ${agency.category} in ${locationText}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${agency.title} - ${agency.category}`,
      description: metaDescription.slice(0, 150),
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: `https://www.travelagencies.world/agencies/${agency.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "business:contact_data:street_address": agency.street || "",
      "business:contact_data:locality": agency.cityNormalized,
      "business:contact_data:country_name": agency.country,
      "business:contact_data:phone_number": agency.phone || "",
      "business:contact_data:website": agency.website || "",
      "geo.region": agency.countryCode || "",
      "geo.placename": agency.cityNormalized,
    },
  };
}

export default async function AgencyPage({ params }: PageProps) {
  const { slug } = await params;
  const agency = getAgencyBySlug(slug);

  if (!agency) {
    notFound();
  }

  // Get similar agencies from the same city
  const similarAgencies = filterAgencies("", agency.cityNormalized, "", 0, "")
    .filter((a) => a.id !== agency.id)
    .slice(0, 3);

  // Enhanced JSON-LD Schema for rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `https://www.travelagencies.world/agencies/${agency.slug}`,
    name: agency.title,
    description: agency.description || `${agency.title} is a verified ${agency.category?.toLowerCase() || "travel agency"} located in ${agency.cityNormalized}, ${agency.country}. Contact them for tours, travel packages, and vacation planning.`,
    image: "https://www.travelagencies.world/og-image.jpg",
    logo: "https://www.travelagencies.world/travellogos/travelagencies-text-blue-white-nbackground.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: agency.street || "",
      addressLocality: agency.cityNormalized,
      addressRegion: agency.state || agency.cityNormalized,
      addressCountry: {
        "@type": "Country",
        name: agency.country,
        ...(agency.countryCode && { identifier: agency.countryCode }),
      },
    },
    geo: agency.location ? {
      "@type": "GeoCoordinates",
      latitude: agency.location.lat,
      longitude: agency.location.lng,
    } : undefined,
    telephone: agency.phone,
    url: agency.website || `https://www.travelagencies.world/agencies/${agency.slug}`,
    mainEntityOfPage: `https://www.travelagencies.world/agencies/${agency.slug}`,
    sameAs: agency.website ? [agency.website, agency.url] : [agency.url],
    priceRange: "$$",
    paymentAccepted: "Cash, Credit Card, Debit Card, Bank Transfer",
    currenciesAccepted: "USD, EUR, GBP, MAD",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    aggregateRating: agency.totalScore
      ? {
          "@type": "AggregateRating",
          ratingValue: agency.totalScore,
          reviewCount: agency.reviewsCount || 1,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    areaServed: [
      {
        "@type": "Country",
        name: agency.country,
      },
      {
        "@type": "City",
        name: agency.cityNormalized,
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Travel Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Tour Packages",
            description: `Guided tours and vacation packages in ${agency.country}`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Flight Bookings",
            description: "Domestic and international flight reservations",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hotel Reservations",
            description: "Hotel and accommodation bookings worldwide",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Visa Assistance",
            description: "Visa application support and processing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Travel Insurance",
            description: "Comprehensive travel insurance coverage",
          },
        },
      ],
    },
    knowsAbout: [
      "Travel Planning",
      "Tour Packages",
      "Flight Bookings",
      "Hotel Reservations",
      agency.cityNormalized,
      agency.country,
    ],
    slogan: `Your trusted ${agency.category?.toLowerCase() || "travel partner"} in ${agency.cityNormalized}`,
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.travelagencies.world",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Agencies",
        item: "https://www.travelagencies.world/agencies",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: agency.country,
        item: `https://www.travelagencies.world/agencies?country=${encodeURIComponent(agency.country)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: agency.cityNormalized,
        item: `https://www.travelagencies.world/agencies?city=${encodeURIComponent(agency.cityNormalized)}`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: agency.title,
        item: `https://www.travelagencies.world/agencies/${agency.slug}`,
      },
    ],
  };

  // FAQ Schema for additional rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How can I contact ${agency.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: agency.phone 
            ? `You can contact ${agency.title} by calling ${agency.phone}${agency.website ? ` or visiting their website at ${agency.website}` : ""}.`
            : `You can find ${agency.title} on Google Maps or visit their location at ${agency.street || agency.cityNormalized}, ${agency.country}.`,
        },
      },
      {
        "@type": "Question",
        name: `Where is ${agency.title} located?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${agency.title} is located in ${agency.street ? `${agency.street}, ` : ""}${agency.cityNormalized}, ${agency.country}.`,
        },
      },
      {
        "@type": "Question",
        name: `What services does ${agency.title} offer?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${agency.title} offers travel services including tour packages, flight bookings, hotel reservations, visa assistance, travel insurance, and airport transfers.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the rating of ${agency.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: agency.totalScore 
            ? `${agency.title} has a rating of ${agency.totalScore}/5 based on ${agency.reviewsCount?.toLocaleString() || "multiple"} customer reviews.`
            : `${agency.title} is a verified travel agency in ${agency.cityNormalized}. Check their Google listing for the latest reviews.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Header */}
      <section className="relative text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(https://picsum.photos/seed/${agency.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000}/1920/600)` 
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-blue-600/85 to-primary/90" />
        {/* Additional decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/agencies" className="hover:text-white transition-colors">
              Agencies
            </Link>
            <span>/</span>
            <span className="text-white">{agency.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="animate-fade-in-up">
              {agency.featured && (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold mb-4">
                  <Star className="h-4 w-4 fill-yellow-900" />
                  Featured Agency
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                {agency.title}
              </h1>
              <p className="text-xl text-white/90 mb-6 drop-shadow-md">
                {agency.category} in {agency.cityNormalized}, {agency.country}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <StarRating rating={agency.totalScore} size="lg" />
                  {agency.totalScore && (
                    <span className="font-bold text-lg">{agency.totalScore}</span>
                  )}
                </div>
                {agency.reviewsCount && (
                  <span className="flex items-center gap-2 text-white/80">
                    <Users className="h-5 w-5" />
                    {agency.reviewsCount.toLocaleString()} reviews
                  </span>
                )}
                <span className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-5 w-5" />
                  {agency.cityNormalized}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-200">
              {agency.phone && (
                <a
                  href={`tel:${agency.phone}`}
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>
              )}
              {agency.website && (
                <a
                  href={agency.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  <Globe className="h-5 w-5" />
                  Visit Website
                </a>
              )}
              <a
                href={agency.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                <ExternalLink className="h-5 w-5" />
                View on Google
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-8 animate-fade-in-up hover:shadow-xl transition-all">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  About {agency.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {agency.description}
                </p>
              </div>

              {/* Map Location */}
              {agency.location?.lat && agency.location?.lng && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-8 animate-fade-in-up delay-100 hover:shadow-xl transition-all">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    Location
                  </h2>
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    <FastAgencyMap
                      agencies={[agency]}
                      height="300px"
                      maxMarkers={1}
                      minimal={true}
                    />
                  </div>
                  {agency.street && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground font-medium">{agency.street}, {agency.cityNormalized}, {agency.country}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Services */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-8 animate-fade-in-up delay-200 hover:shadow-xl transition-all">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  Our Services
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "Flight Bookings", icon: "✈️" },
                    { name: "Hotel Reservations", icon: "🏨" },
                    { name: "Tour Packages", icon: "🗺️" },
                    { name: "Visa Assistance", icon: "📋" },
                    { name: "Travel Insurance", icon: "🛡️" },
                    { name: "Airport Transfers", icon: "🚗" },
                  ].map((service, index) => (
                    <div
                      key={service.name}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100/50 hover:border-primary/30 hover:shadow-md transition-all animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <span className="font-medium text-foreground">{service.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gradient-to-r from-primary via-blue-600 to-primary text-white rounded-2xl p-8 animate-fade-in-up delay-300">
                <h2 className="text-2xl font-bold mb-8 text-center">
                  Why Choose {agency.title}?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Trusted & Verified</h3>
                    <p className="text-white/80 text-sm">
                      Google-verified with real customer reviews
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Quick Response</h3>
                    <p className="text-white/80 text-sm">
                      Fast and efficient service
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Expert Team</h3>
                    <p className="text-white/80 text-sm">
                      Experienced travel professionals
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sticky top-24 animate-slide-in-right">
                <div className="text-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Contact Information
                  </h3>
                </div>

                <div className="space-y-4">
                  {agency.street && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Address</p>
                        <p className="text-muted-foreground text-sm">
                          {agency.street}
                          <br />
                          {agency.cityNormalized}, {agency.country}
                        </p>
                      </div>
                    </div>
                  )}

                  {agency.phone && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Phone</p>
                        <a
                          href={`tel:${agency.phone}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {agency.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {agency.website && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                      <Globe className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Website</p>
                        <a
                          href={agency.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm break-all"
                        >
                          {agency.website.replace(/^https?:\/\//, "").slice(0, 30)}...
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {agency.phone && (
                    <a
                      href={`tel:${agency.phone}`}
                      className="block w-full text-center bg-gradient-to-r from-primary to-blue-600 text-white py-4 rounded-xl font-bold hover:from-primary/90 hover:to-blue-500 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02]"
                    >
                      📞 Call Now
                    </a>
                  )}

                  <a
                    href={agency.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-white border-2 border-primary text-primary py-3.5 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Agencies */}
      {similarAgencies.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-3 animate-fade-in-up">
                Similar Agencies in {agency.cityNormalized}
              </h2>
              <p className="text-muted-foreground">Discover more trusted travel agencies near you</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 stagger-children">
              {similarAgencies.map((a, index) => (
                <div key={a.id} className="hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                  <AgencyCard agency={a} />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href={`/agencies?city=${agency.cityNormalized}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-primary/90 hover:to-blue-500 transition-all shadow-lg shadow-primary/25 hover:shadow-xl"
              >
                View All Agencies in {agency.cityNormalized}
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection variant="secondary" country={agency.country} />
    </>
  );
}
