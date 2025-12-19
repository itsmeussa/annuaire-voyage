import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, Building2, ArrowRight, ChevronRight } from "lucide-react";
import AgencyCard from "@/components/ui/AgencyCard";
import CTASection from "@/components/ui/CTASection";
import { filterAgencies, getAllAgencies, getUniqueCities, getUniqueCategories } from "@/lib/agencies";

interface PageProps {
  params: Promise<{ country: string }>;
}

// Country display names and SEO data
const countryData: Record<string, { name: string; emoji: string; description: string; topCities: string[] }> = {
  "Morocco": { name: "Morocco", emoji: "🇲🇦", description: "Explore Morocco with expert local agencies. From Marrakech's vibrant souks to Sahara desert adventures.", topCities: ["Casablanca", "Marrakech", "Rabat", "Fes", "Tangier", "Agadir"] },
  "France": { name: "France", emoji: "🇫🇷", description: "Discover France with top-rated travel agencies. Paris, Côte d'Azur, Alps and wine regions.", topCities: ["Paris", "Nice", "Lyon", "Marseille", "Bordeaux", "Toulouse"] },
  "United States": { name: "United States", emoji: "🇺🇸", description: "Plan your American adventure with verified US travel agencies. Coast to coast expertise.", topCities: ["New York", "Los Angeles", "Miami", "Las Vegas", "Chicago", "San Francisco"] },
  "Canada": { name: "Canada", emoji: "🇨🇦", description: "Explore Canada with trusted local agencies. From Toronto to Vancouver, Rockies to Maritimes.", topCities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton"] },
  "United Kingdom": { name: "United Kingdom", emoji: "🇬🇧", description: "Travel the UK with expert British agencies. London, Scotland, Wales and beyond.", topCities: ["London", "Edinburgh", "Manchester", "Birmingham", "Glasgow", "Liverpool"] },
  "Spain": { name: "Spain", emoji: "🇪🇸", description: "Experience Spain with local travel experts. Barcelona, Madrid, beaches and cultural treasures.", topCities: ["Barcelona", "Madrid", "Valencia", "Seville", "Malaga", "Bilbao"] },
  "United Arab Emirates": { name: "UAE", emoji: "🇦🇪", description: "Luxury travel in the UAE with premium agencies. Dubai, Abu Dhabi and desert experiences.", topCities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"] },
  "Germany": { name: "Germany", emoji: "🇩🇪", description: "Discover Germany with verified travel agencies. Berlin, Munich, Rhine Valley and more.", topCities: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart"] },
  "Italy": { name: "Italy", emoji: "🇮🇹", description: "Explore Italy with expert local agencies. Rome, Venice, Tuscany and the Amalfi Coast.", topCities: ["Rome", "Milan", "Venice", "Florence", "Naples", "Turin"] },
  "Turkey": { name: "Turkey", emoji: "🇹🇷", description: "Experience Turkey with trusted travel agencies. Istanbul, Cappadocia, Mediterranean coast.", topCities: ["Istanbul", "Antalya", "Ankara", "Izmir", "Bodrum", "Cappadocia"] },
  "Egypt": { name: "Egypt", emoji: "🇪🇬", description: "Discover Egypt with expert local agencies. Pyramids, Nile cruises, Red Sea resorts.", topCities: ["Cairo", "Alexandria", "Luxor", "Aswan", "Hurghada", "Sharm El Sheikh"] },
  "India": { name: "India", emoji: "🇮🇳", description: "Explore India with verified travel agencies. Delhi, Rajasthan, Kerala and beyond.", topCities: ["Delhi", "Mumbai", "Jaipur", "Goa", "Bangalore", "Kerala"] },
  "Australia": { name: "Australia", emoji: "🇦🇺", description: "Travel Australia with trusted agencies. Sydney, Great Barrier Reef, Outback adventures.", topCities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Gold Coast", "Cairns"] },
  "Thailand": { name: "Thailand", emoji: "🇹🇭", description: "Experience Thailand with local travel experts. Bangkok, Phuket, Chiang Mai and islands.", topCities: ["Bangkok", "Phuket", "Chiang Mai", "Pattaya", "Krabi", "Koh Samui"] },
  "Japan": { name: "Japan", emoji: "🇯🇵", description: "Discover Japan with expert travel agencies. Tokyo, Kyoto, Mount Fuji and cultural experiences.", topCities: ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Nara", "Sapporo"] },
  "Greece": { name: "Greece", emoji: "🇬🇷", description: "Explore Greece with trusted local agencies. Athens, Santorini, Mykonos and ancient wonders.", topCities: ["Athens", "Santorini", "Mykonos", "Thessaloniki", "Crete", "Rhodes"] },
  "Portugal": { name: "Portugal", emoji: "🇵🇹", description: "Travel Portugal with verified agencies. Lisbon, Porto, Algarve beaches and Madeira.", topCities: ["Lisbon", "Porto", "Faro", "Madeira", "Algarve", "Sintra"] },
  "Mexico": { name: "Mexico", emoji: "🇲🇽", description: "Experience Mexico with local travel experts. Cancun, Mexico City, Riviera Maya and culture.", topCities: ["Cancun", "Mexico City", "Playa del Carmen", "Cabo San Lucas", "Puerto Vallarta", "Tulum"] },
  "Brazil": { name: "Brazil", emoji: "🇧🇷", description: "Explore Brazil with trusted agencies. Rio de Janeiro, Amazon, beaches and carnival.", topCities: ["Rio de Janeiro", "Sao Paulo", "Salvador", "Brasilia", "Fortaleza", "Recife"] },
  "South Africa": { name: "South Africa", emoji: "🇿🇦", description: "Discover South Africa with expert agencies. Cape Town, safaris, Garden Route adventures.", topCities: ["Cape Town", "Johannesburg", "Durban", "Pretoria", "Kruger Park", "Port Elizabeth"] },
  "Others": { name: "Other Countries", emoji: "🌍", description: "Find travel agencies in countries around the world. Global coverage, local expertise.", topCities: [] },
};

export async function generateStaticParams() {
  const countries = [...new Set(getAllAgencies().map(a => a.country))].filter(Boolean);
  return countries.map((country) => ({
    country: encodeURIComponent(country),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const decodedCountry = decodeURIComponent(country);
  const agencies = filterAgencies("", "", decodedCountry, 0, "");
  const info = countryData[decodedCountry] || { name: decodedCountry, emoji: "🌍", description: `Find verified travel agencies in ${decodedCountry}.`, topCities: [] };
  
  const agencyCount = agencies.length;
  const avgRating = agencies.reduce((sum, a) => sum + (a.totalScore || 0), 0) / agencies.length || 0;
  const topCities = [...new Set(agencies.map(a => a.cityNormalized))].slice(0, 5);

  const title = `${agencyCount}+ Travel Agencies in ${info.name} ${info.emoji} | Top Rated Tour Operators`;
  const description = `Find ${agencyCount}+ verified travel agencies in ${info.name}. Top cities: ${topCities.join(", ")}. Average rating: ${avgRating.toFixed(1)}/5. Compare reviews, contact directly. Free directory.`;

  return {
    title,
    description,
    keywords: [
      `travel agencies ${info.name}`,
      `tour operators ${info.name}`,
      `${info.name} travel agents`,
      `best travel agency ${info.name}`,
      `${info.name} vacation packages`,
      `book travel ${info.name}`,
      ...topCities.map(city => `travel agency ${city}`),
      ...topCities.map(city => `${city} tour operator`),
    ],
    openGraph: {
      title: `${agencyCount}+ Travel Agencies in ${info.name}`,
      description,
      url: `https://www.travelagencies.world/agencies/country/${encodeURIComponent(decodedCountry)}`,
      type: "website",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Travel Agencies in ${info.name} ${info.emoji}`,
      description: `${agencyCount}+ verified agencies. ${topCities.slice(0, 3).join(", ")}. Compare & book directly.`,
    },
    alternates: {
      canonical: `/agencies/country/${encodeURIComponent(decodedCountry)}`,
    },
  };
}

export default async function CountryAgenciesPage({ params }: PageProps) {
  const { country } = await params;
  const decodedCountry = decodeURIComponent(country);
  const agencies = filterAgencies("", "", decodedCountry, 0, "");
  const info = countryData[decodedCountry] || { name: decodedCountry, emoji: "🌍", description: `Find verified travel agencies in ${decodedCountry}.`, topCities: [] };

  if (agencies.length === 0) {
    notFound();
  }

  // Get unique cities and categories for this country
  const cities = [...new Set(agencies.map(a => a.cityNormalized))].filter(Boolean).sort();
  const categories = [...new Set(agencies.map(a => a.category))].filter(Boolean);
  
  // Top agencies (by reviews)
  const topAgencies = [...agencies]
    .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
    .slice(0, 12);

  // Stats
  const avgRating = agencies.reduce((sum, a) => sum + (a.totalScore || 0), 0) / agencies.length || 0;
  const totalReviews = agencies.reduce((sum, a) => sum + (a.reviewsCount || 0), 0);
  const withWebsite = agencies.filter(a => a.website).length;

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Travel Agencies in ${info.name}`,
    "description": info.description,
    "url": `https://www.travelagencies.world/agencies/country/${encodeURIComponent(decodedCountry)}`,
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
      { "@type": "ListItem", "position": 3, "name": info.name, "item": `https://www.travelagencies.world/agencies/country/${encodeURIComponent(decodedCountry)}` },
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
            <span className="text-white">{info.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{info.emoji}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Travel Agencies in {info.name}
              </h1>
              <p className="text-xl text-white/80 mt-2">{agencies.length}+ verified agencies</p>
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
              <div className="text-sm text-muted-foreground">Verified Agencies</div>
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
              <div className="text-3xl font-bold text-primary">{cities.length}</div>
              <div className="text-sm text-muted-foreground">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Browse by City in {info.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {cities.slice(0, 24).map(city => {
              const cityCount = agencies.filter(a => a.cityNormalized === city).length;
              return (
                <Link
                  key={city}
                  href={`/agencies/country/${encodeURIComponent(decodedCountry)}/city/${encodeURIComponent(city)}`}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium group-hover:text-primary transition-colors">{city}</span>
                  </div>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">{cityCount}</span>
                </Link>
              );
            })}
          </div>
          {cities.length > 24 && (
            <div className="text-center mt-6">
              <Link
                href={`/agencies?country=${encodeURIComponent(decodedCountry)}`}
                className="text-primary font-medium hover:underline"
              >
                View all {cities.length} cities →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const catCount = agencies.filter(a => a.category === category).length;
              return (
                <Link
                  key={category}
                  href={`/agencies?country=${encodeURIComponent(decodedCountry)}&category=${encodeURIComponent(category)}`}
                  className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  <Building2 className="h-4 w-4" />
                  <span>{category}</span>
                  <span className="text-xs opacity-70">({catCount})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Agencies */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Rated Agencies in {info.name}</h2>
            <Link
              href={`/agencies?country=${encodeURIComponent(decodedCountry)}`}
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

      {/* CTA */}
      <CTASection country={decodedCountry} />
    </div>
  );
}
