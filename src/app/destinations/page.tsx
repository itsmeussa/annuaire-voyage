import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Globe, ArrowRight } from "lucide-react";
import {
  getUniqueCities,
  getUniqueCountries,
  filterAgencies,
} from "@/lib/agencies";

export const metadata: Metadata = {
  title: "Destinations - Browse Travel Agencies by Location",
  description:
    "Explore our travel agency directory by destination. Find trusted travel agencies in cities and countries around the world.",
};

export default function DestinationsPage() {
  const cities = getUniqueCities();
  const countries = getUniqueCountries();

  // Get agency count per city
  const cityData = cities.map((city) => ({
    name: city,
    count: filterAgencies("", city, "", 0, "").length,
  })).sort((a, b) => b.count - a.count);

  // Get agency count per country
  const countryData = countries.map((country) => ({
    name: country,
    count: filterAgencies("", "", country, 0, "").length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Destinations
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Find travel agencies in your desired destination. Browse by country
            or city to discover trusted local experts.
          </p>
        </div>
      </section>

      {/* Countries */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Browse by Country
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {countryData.map((country) => (
              <Link
                key={country.name}
                href={`/agencies?country=${encodeURIComponent(country.name)}`}
                className="bg-muted/50 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {country.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {country.count} agencies
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Popular Cities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cityData.slice(0, 16).map((city) => (
              <Link
                key={city.name}
                href={`/agencies?city=${encodeURIComponent(city.name)}`}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-border group"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {city.count} agencies
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {cityData.length > 16 && (
            <div className="text-center mt-8">
              <Link
                href="/agencies"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                View All Cities
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Can't Find Your Destination?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Use our advanced search to find travel agencies anywhere in the world.
          </p>
          <Link
            href="/agencies"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Search All Agencies
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
