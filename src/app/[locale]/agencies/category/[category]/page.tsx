import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, Building2, ArrowRight, ChevronRight, Users, Globe2 } from "lucide-react";
import AgencyCard from "@/components/ui/AgencyCard";
import CTASection from "@/components/ui/CTASection";
import { filterAgencies, getAllAgencies, getUniqueCategories } from "@/lib/agencies";

interface PageProps {
  params: Promise<{ category: string }>;
}

// Category descriptions for SEO
const categoryDescriptions: Record<string, { title: string; description: string; icon: string }> = {
  "Travel agency": {
    title: "Travel Agencies",
    description: "Full-service travel agencies offering comprehensive travel planning, booking, and consultation services for all destinations.",
    icon: "✈️"
  },
  "Tour operator": {
    title: "Tour Operators",
    description: "Specialized tour operators creating and managing organized tours, packages, and group travel experiences.",
    icon: "🗺️"
  },
  "Tourist attraction": {
    title: "Tourist Attractions",
    description: "Popular tourist destinations, landmarks, and attractions with booking and visitor services.",
    icon: "🏛️"
  },
  "Travel Agent": {
    title: "Travel Agents",
    description: "Professional travel agents providing personalized travel advice, booking assistance, and trip planning.",
    icon: "👤"
  },
  "Tourism": {
    title: "Tourism Services",
    description: "General tourism service providers including guides, transportation, and local experience operators.",
    icon: "🌍"
  },
  "Corporate travel agency": {
    title: "Corporate Travel Agencies",
    description: "Business travel specialists handling corporate accounts, meetings, incentives, and conferences.",
    icon: "💼"
  },
  "Destination management company": {
    title: "DMCs",
    description: "Destination management companies providing local expertise, event planning, and ground handling services.",
    icon: "🎯"
  },
  "Adventure travel agency": {
    title: "Adventure Travel Agencies",
    description: "Adventure travel specialists organizing trekking, safaris, extreme sports, and outdoor expeditions.",
    icon: "🏔️"
  },
};

export async function generateStaticParams() {
  const categories = await getUniqueCategories();
  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const { agencies } = await filterAgencies("", "", "", 0, decodedCategory, "all", false, 1, 10000);
  const info = categoryDescriptions[decodedCategory] || {
    title: decodedCategory,
    description: `Find verified ${decodedCategory.toLowerCase()} worldwide.`,
    icon: "🌐"
  };

  if (agencies.length === 0) {
    return { title: "Category Not Found" };
  }

  const agencyCount = agencies.length;
  const topCountries = [...new Set(agencies.map(a => a.country))].slice(0, 5);
  const avgRating = agencies.reduce((sum, a) => sum + (a.totalScore || 0), 0) / agencies.length || 0;

  const title = `${agencyCount}+ ${info.title} Worldwide | Find & Compare`;
  const description = `${info.description} Browse ${agencyCount}+ verified listings in ${topCountries.join(", ")} & more. Average rating: ${avgRating.toFixed(1)}/5. Compare reviews, contact directly.`;

  return {
    title,
    description,
    keywords: [
      decodedCategory,
      `best ${decodedCategory.toLowerCase()}`,
      `${decodedCategory.toLowerCase()} near me`,
      `top ${decodedCategory.toLowerCase()}`,
      `verified ${decodedCategory.toLowerCase()}`,
      ...topCountries.map(c => `${decodedCategory.toLowerCase()} ${c}`),
    ],
    openGraph: {
      title: `${agencyCount}+ ${info.title} Worldwide`,
      description,
      url: `https://www.travelagencies.world/agencies/category/${encodeURIComponent(decodedCategory)}`,
      type: "website",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `/agencies/category/${encodeURIComponent(decodedCategory)}`,
    },
  };
}

export default async function CategoryAgenciesPage({ params }: PageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const { agencies } = await filterAgencies("", "", "", 0, decodedCategory, "all", false, 1, 10000);
  const info = categoryDescriptions[decodedCategory] || {
    title: decodedCategory,
    description: `Find verified ${decodedCategory.toLowerCase()} worldwide.`,
    icon: "🌐"
  };

  if (agencies.length === 0) {
    notFound();
  }

  // Get unique countries for this category
  const countries = [...new Set(agencies.map(a => a.country))].filter(Boolean).sort();
  const countryCounts = countries.map(c => ({
    country: c,
    count: agencies.filter(a => a.country === c).length
  })).sort((a, b) => b.count - a.count);

  // Top agencies by reviews
  const topAgencies = [...agencies]
    .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
    .slice(0, 12);

  // Stats
  const avgRating = agencies.reduce((sum, a) => sum + (a.totalScore || 0), 0) / agencies.length || 0;
  const totalReviews = agencies.reduce((sum, a) => sum + (a.reviewsCount || 0), 0);

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": info.title,
    "description": info.description,
    "url": `https://www.travelagencies.world/agencies/category/${encodeURIComponent(decodedCategory)}`,
    "numberOfItems": agencies.length,
    "itemListElement": topAgencies.slice(0, 10).map((agency, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "TravelAgency",
        "name": agency.title,
        "url": `https://www.travelagencies.world/agencies/${agency.slug}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": agency.cityNormalized,
          "addressCountry": agency.country,
        },
        ...(agency.totalScore && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": agency.totalScore,
            "reviewCount": agency.reviewsCount || 1,
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
      { "@type": "ListItem", "position": 3, "name": info.title, "item": `https://www.travelagencies.world/agencies/category/${encodeURIComponent(decodedCategory)}` },
    ]
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/agencies" className="hover:text-white">Agencies</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{info.title}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{info.icon}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">{info.title}</h1>
              <p className="text-xl text-white/80 mt-2">{agencies.length}+ verified worldwide</p>
            </div>
          </div>
          <p className="text-lg text-white/80 max-w-3xl mt-4">{info.description}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{agencies.length}</div>
              <div className="text-sm text-muted-foreground">Total Agencies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                {avgRating.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{totalReviews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                <Globe2 className="h-6 w-6" />
                {countries.length}
              </div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Browse {info.title} by Country</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {countryCounts.slice(0, 24).map(({ country, count }) => (
              <Link
                key={country}
                href={`/agencies?category=${encodeURIComponent(decodedCategory)}&country=${encodeURIComponent(country)}`}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium group-hover:text-primary transition-colors truncate">{country}</span>
                </div>
                <span className="text-xs bg-muted px-2 py-1 rounded-full">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Agencies */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Rated {info.title}</h2>
            <Link
              href={`/agencies?category=${encodeURIComponent(decodedCategory)}`}
              className="text-primary font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topAgencies.map(agency => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Other Categories</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(categoryDescriptions)
              .filter(([cat]) => cat !== decodedCategory)
              .map(([cat, catInfo]) => (
                <Link
                  key={cat}
                  href={`/agencies/category/${encodeURIComponent(cat)}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                >
                  <span>{catInfo.icon}</span>
                  <span>{catInfo.title}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
}
