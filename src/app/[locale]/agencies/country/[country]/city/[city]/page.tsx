import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, Building2, ArrowRight, ChevronRight, Phone, Globe } from "lucide-react";
import AgencyCard from "@/components/ui/AgencyCard";
import CTASection from "@/components/ui/CTASection";
import { filterAgencies, getAllAgencies } from "@/lib/agencies";

interface PageProps {
  params: Promise<{ country: string; city: string }>;
}

export async function generateStaticParams() {
  const agencies = await getAllAgencies();
  const countryCityPairs = new Map<string, Set<string>>();

  agencies.forEach(agency => {
    if (agency.country && agency.cityNormalized) {
      if (!countryCityPairs.has(agency.country)) {
        countryCityPairs.set(agency.country, new Set());
      }
      countryCityPairs.get(agency.country)!.add(agency.cityNormalized);
    }
  });

  const params: { country: string; city: string }[] = [];
  countryCityPairs.forEach((cities, country) => {
    cities.forEach(city => {
      params.push({
        country: encodeURIComponent(country),
        city: encodeURIComponent(city),
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, city } = await params;
  const decodedCountry = decodeURIComponent(country);
  const decodedCity = decodeURIComponent(city);
  const { agencies } = await filterAgencies("", decodedCity, decodedCountry, 0, "", "all", 1, 10000);

  if (agencies.length === 0) {
    return { title: "City Not Found" };
  }

  const agencyCount = agencies.length;
  const avgRating = agencies.reduce((sum, a) => sum + (a.totalScore || 0), 0) / agencies.length || 0;
  const categories = [...new Set(agencies.map(a => a.category))].filter(Boolean).slice(0, 3);

  const title = `${agencyCount}+ Travel Agencies in ${decodedCity}, ${decodedCountry} | Local Tour Operators`;
  const description = `Find ${agencyCount}+ verified travel agencies in ${decodedCity}, ${decodedCountry}. Average rating: ${avgRating.toFixed(1)}/5. Specialties: ${categories.join(", ")}. Compare reviews, get quotes. Free directory.`;

  return {
    title,
    description,
    keywords: [
      `travel agency ${decodedCity}`,
      `tour operator ${decodedCity}`,
      `${decodedCity} travel agent`,
      `best travel agency ${decodedCity}`,
      `${decodedCity} vacation packages`,
      `${decodedCity} tours`,
      `book travel ${decodedCity}`,
      `${decodedCity} ${decodedCountry} travel`,
      `travel agencies near ${decodedCity}`,
      ...categories.map(cat => `${cat} ${decodedCity}`),
    ],
    openGraph: {
      title: `${agencyCount}+ Travel Agencies in ${decodedCity}`,
      description,
      url: `https://www.travelagencies.world/agencies/country/${encodeURIComponent(decodedCountry)}/city/${encodeURIComponent(decodedCity)}`,
      type: "website",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Travel Agencies in ${decodedCity}`,
      description: `${agencyCount}+ verified agencies. ${avgRating.toFixed(1)}/5 avg rating. Compare & book directly.`,
    },
    alternates: {
      canonical: `/agencies/country/${encodeURIComponent(decodedCountry)}/city/${encodeURIComponent(decodedCity)}`,
    },
  };
}

export default async function CityAgenciesPage({ params }: PageProps) {
  const { country, city } = await params;
  const decodedCountry = decodeURIComponent(country);
  const decodedCity = decodeURIComponent(city);
  const { agencies } = await filterAgencies("", decodedCity, decodedCountry, 0, "", "all", 1, 10000);

  if (agencies.length === 0) {
    notFound();
  }

  // Get unique categories for this city
  const categories = [...new Set(agencies.map(a => a.category))].filter(Boolean);

  // Sort agencies by reviews and rating
  const sortedAgencies = [...agencies].sort((a, b) => {
    const scoreA = (a.totalScore || 0) * 100 + (a.reviewsCount || 0);
    const scoreB = (b.totalScore || 0) * 100 + (b.reviewsCount || 0);
    return scoreB - scoreA;
  });

  // Stats
  const avgRating = agencies.reduce((sum, a) => sum + (a.totalScore || 0), 0) / agencies.length || 0;
  const totalReviews = agencies.reduce((sum, a) => sum + (a.reviewsCount || 0), 0);
  const withWebsite = agencies.filter(a => a.website).length;
  const withPhone = agencies.filter(a => a.phone).length;

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Travel Agencies in ${decodedCity}, ${decodedCountry}`,
    "description": `Find ${agencies.length}+ verified travel agencies in ${decodedCity}. Compare reviews and contact directly.`,
    "url": `https://www.travelagencies.world/agencies/country/${encodeURIComponent(decodedCountry)}/city/${encodeURIComponent(decodedCity)}`,
    "numberOfItems": agencies.length,
    "itemListElement": sortedAgencies.slice(0, 10).map((agency, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "TravelAgency",
        "name": agency.title,
        "url": `https://www.travelagencies.world/agencies/${agency.slug}`,
        "telephone": agency.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": agency.street,
          "addressLocality": agency.cityNormalized,
          "addressCountry": agency.country,
        },
        ...(agency.totalScore && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": agency.totalScore,
            "reviewCount": agency.reviewsCount || 1,
            "bestRating": 5,
            "worstRating": 1,
          }
        }),
      }
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.travelagencies.world" },
      { "@type": "ListItem", "position": 2, "name": "Agencies", "item": "https://www.travelagencies.world/agencies" },
      { "@type": "ListItem", "position": 3, "name": decodedCountry, "item": `https://www.travelagencies.world/agencies/country/${encodeURIComponent(decodedCountry)}` },
      { "@type": "ListItem", "position": 4, "name": decodedCity, "item": `https://www.travelagencies.world/agencies/country/${encodeURIComponent(decodedCountry)}/city/${encodeURIComponent(decodedCity)}` },
    ]
  };

  // Local Business Schema for the city
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Travel Agencies in ${decodedCity}`,
    "description": `Directory of ${agencies.length}+ verified travel agencies in ${decodedCity}, ${decodedCountry}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": decodedCity,
      "addressCountry": decodedCountry,
    },
    "areaServed": {
      "@type": "City",
      "name": decodedCity,
    },
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />

      {/* Hero */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/agencies" className="hover:text-white">Agencies</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/agencies/country/${encodeURIComponent(decodedCountry)}`} className="hover:text-white">{decodedCountry}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{decodedCity}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-10 w-10 text-white/80" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Travel Agencies in {decodedCity}
              </h1>
              <p className="text-xl text-white/80 mt-1">{decodedCountry} • {agencies.length}+ verified agencies</p>
            </div>
          </div>
          <p className="text-lg text-white/80 max-w-3xl mt-4">
            Find and compare {agencies.length}+ verified travel agencies in {decodedCity}. Read real Google reviews, compare ratings, and contact agencies directly. All listings are free to browse.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{agencies.length}</div>
              <div className="text-sm text-muted-foreground">Agencies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                {avgRating.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{totalReviews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                <Phone className="h-5 w-5" />
                {withPhone}
              </div>
              <div className="text-sm text-muted-foreground">With Phone</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                <Globe className="h-5 w-5" />
                {withWebsite}
              </div>
              <div className="text-sm text-muted-foreground">With Website</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-6 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Filter by type:</span>
            {categories.map(category => {
              const catCount = agencies.filter(a => a.category === category).length;
              return (
                <Link
                  key={category}
                  href={`/agencies?city=${encodeURIComponent(decodedCity)}&country=${encodeURIComponent(decodedCountry)}&category=${encodeURIComponent(category)}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-sm"
                >
                  <Building2 className="h-3 w-3" />
                  <span>{category}</span>
                  <span className="text-xs opacity-70">({catCount})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Agencies */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Agencies in {decodedCity}</h2>
            <Link
              href={`/agencies?city=${encodeURIComponent(decodedCity)}&country=${encodeURIComponent(decodedCountry)}`}
              className="text-primary font-medium hover:underline flex items-center gap-1"
            >
              Advanced Filters <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAgencies.map(agency => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        </div>
      </section>

      {/* Related Cities */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Other Cities in {decodedCountry}</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/agencies/country/${encodeURIComponent(decodedCountry)}`}
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            >
              View All Cities in {decodedCountry}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection country={decodedCountry} />
    </div>
  );
}
