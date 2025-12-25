import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { MapPin, Globe, ArrowRight } from "lucide-react";
import { getAllAgencies } from "@/lib/agencies";

// Force dynamic rendering to avoid build timeout
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Destinations.meta' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: "https://www.travelagencies.world/destinations",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: "/destinations",
    },
  };
}

export default async function DestinationsPage({ params: { locale } }: { params: { locale: string } }) {
  const agencies = await getAllAgencies();
  const totalAgencies = agencies.length;
  const t = await getTranslations({ locale, namespace: 'Destinations' });

  // Efficiently count agencies per country and city in a single pass
  const countryCount = new Map<string, number>();
  const cityCount = new Map<string, number>();

  agencies.forEach((agency) => {
    if (agency.country) {
      countryCount.set(agency.country, (countryCount.get(agency.country) || 0) + 1);
    }
    if (agency.cityNormalized) {
      cityCount.set(agency.cityNormalized, (cityCount.get(agency.cityNormalized) || 0) + 1);
    }
  });

  // Convert maps to sorted arrays
  const countryData = Array.from(countryCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const cityData = Array.from(cityCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const countries = countryData.map(c => c.name);
  const cities = cityData.map(c => c.name);

  // Structured data for destinations page
  const destinationsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Travel Agency Destinations",
    description: `Browse ${totalAgencies}+ travel agencies across ${countries.length} countries and ${cities.length} cities worldwide.`,
    url: "https://travelagencies.world/destinations",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: countries.length,
      itemListElement: countryData.slice(0, 10).map((country, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Country",
          name: country.name,
          url: `https://travelagencies.world/agencies?country=${encodeURIComponent(country.name)}`,
        },
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://travelagencies.world",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: "https://travelagencies.world/destinations",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-muted/30">
        {/* Hero */}
        <section className="hero-gradient text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t('hero.subtitle', { count: totalAgencies, countries: countries.length })}
            </p>
          </div>
        </section>

        {/* Countries */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {t('countries.title')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {countryData.map((country) => (
                <Link
                  key={country.name}
                  href={`/agencies?country=${encodeURIComponent(country.name)}`}
                  className="bg-muted/50 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
                  title={`${t('countries.count', { count: country.count })} in ${country.name}`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {country.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('countries.count', { count: country.count })}
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
              {t('cities.title')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cityData.slice(0, 16).map((city) => (
                <Link
                  key={city.name}
                  href={`/agencies?city=${encodeURIComponent(city.name)}`}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-border group"
                  title={`${t('cities.count', { count: city.count })} in ${city.name}`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('cities.count', { count: city.count })}
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
                  {t('cities.viewAll', { count: cities.length })}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('seo.title')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('seo.p1')}
              </p>
              <p className="text-muted-foreground mb-4">
                {t('seo.p2')}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              {t('cta.button', { count: totalAgencies })}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
