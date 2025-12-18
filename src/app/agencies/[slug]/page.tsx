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
const AgencyMap = dynamic(() => import("@/components/ui/AgencyMap"), {
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
  const reviewText = agency.reviewsCount ? ` (${agency.reviewsCount} reviews)` : "";
  
  const seoDescription = `${agency.title} - ${agency.category} in ${agency.cityNormalized}, ${agency.country}.${ratingText}${reviewText} Contact: ${agency.phone || "Available on request"}. ${agency.description?.slice(0, 120) || ""}`;

  return {
    title: `${agency.title} | ${agency.category} in ${agency.cityNormalized}, ${agency.country}`,
    description: seoDescription,
    keywords: [
      agency.title,
      `${agency.category} ${agency.cityNormalized}`,
      `travel agency ${agency.cityNormalized}`,
      `${agency.category} ${agency.country}`,
      `tour operator ${agency.cityNormalized}`,
      `vacation packages ${agency.country}`,
      agency.cityNormalized,
      agency.country,
    ],
    openGraph: {
      title: `${agency.title} | Best ${agency.category} in ${agency.cityNormalized}`,
      description: seoDescription,
      type: "website",
      url: `https://travelagencies.world/agencies/${agency.slug}`,
      siteName: "TravelAgencies.World",
      locale: "en_US",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${agency.title} - Travel Agency`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${agency.title} | ${agency.category} in ${agency.cityNormalized}`,
      description: seoDescription,
    },
    alternates: {
      canonical: `/agencies/${agency.slug}`,
    },
    robots: {
      index: true,
      follow: true,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `https://travelagencies.world/agencies/${agency.slug}`,
    name: agency.title,
    description: agency.description,
    image: "/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: agency.street,
      addressLocality: agency.cityNormalized,
      addressCountry: agency.country,
    },
    telephone: agency.phone,
    url: agency.website || `https://travelagencies.world/agencies/${agency.slug}`,
    sameAs: agency.website ? [agency.website] : undefined,
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    aggregateRating: agency.totalScore
      ? {
          "@type": "AggregateRating",
          ratingValue: agency.totalScore,
          reviewCount: agency.reviewsCount || 1,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
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
        name: "Agencies",
        item: "https://travelagencies.world/agencies",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: agency.title,
        item: `https://travelagencies.world/agencies/${agency.slug}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/agencies" className="hover:text-primary">
              Agencies
            </Link>
            <span>/</span>
            <span className="text-foreground">{agency.title}</span>
          </nav>
        </div>
      </div>

      {/* Agency Header */}
      <section className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Link
            href="/agencies"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all agencies
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="animate-fade-in-up">
              {agency.featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  <Star className="h-4 w-4 fill-primary" />
                  Featured Agency
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {agency.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {agency.category} in {agency.cityNormalized}, {agency.country}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <StarRating rating={agency.totalScore} size="lg" />
                {agency.reviewsCount && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {agency.reviewsCount} reviews
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 animate-fade-in-up delay-200">
              {agency.phone && (
                <a
                  href={`tel:${agency.phone}`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all hover-glow btn-glow"
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
                  className="inline-flex items-center gap-2 bg-muted text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted/80 transition-all hover:shadow-md"
                >
                  <Globe className="h-5 w-5" />
                  Visit Website
                </a>
              )}
              <a
                href={agency.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-muted text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted/80 transition-all hover:shadow-md"
              >
                <ExternalLink className="h-5 w-5" />
                View on Google
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-xl border border-border p-6 animate-fade-in-up hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  About {agency.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {agency.description}
                </p>
              </div>

              {/* Map Location */}
              {agency.location?.lat && agency.location?.lng && (
                <div className="bg-white rounded-xl border border-border p-6 animate-fade-in-up delay-100 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </h2>
                  <AgencyMap
                    agencies={[agency]}
                    center={[agency.location.lat, agency.location.lng]}
                    zoom={15}
                    height="300px"
                    showFullscreenControl={true}
                  />
                  {agency.street && (
                    <p className="mt-4 text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {agency.street}, {agency.cityNormalized}, {agency.country}
                    </p>
                  )}
                </div>
              )}

              {/* Services */}
              <div className="bg-white rounded-xl border border-border p-6 animate-fade-in-up delay-200 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Our Services
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Flight Bookings",
                    "Hotel Reservations",
                    "Tour Packages",
                    "Visa Assistance",
                    "Travel Insurance",
                    "Airport Transfers",
                  ].map((service, index) => (
                    <div
                      key={service}
                      className="flex items-center gap-2 text-muted-foreground animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-white rounded-xl border border-border p-6 animate-fade-in-up delay-300 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Why Choose Us
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center group">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Trusted & Verified</h3>
                    <p className="text-sm text-muted-foreground">
                      Google-verified with real customer reviews
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Quick Response</h3>
                    <p className="text-sm text-muted-foreground">
                      Fast and efficient service
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Expert Team</h3>
                    <p className="text-sm text-muted-foreground">
                      Experienced travel professionals
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-border p-6 sticky top-24 animate-slide-in-right hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {agency.street && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground text-sm">
                          {agency.street}
                          <br />
                          {agency.cityNormalized}, {agency.country}
                        </p>
                      </div>
                    </div>
                  )}

                  {agency.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a
                          href={`tel:${agency.phone}`}
                          className="text-primary hover:underline text-sm"
                        >
                          {agency.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {agency.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a
                          href={agency.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm break-all"
                        >
                          {agency.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="my-6" />

                {agency.phone && (
                  <a
                    href={`tel:${agency.phone}`}
                    className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-md btn-glow mb-3"
                  >
                    Call Now
                  </a>
                )}

                <a
                  href={agency.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-muted text-foreground py-3 rounded-lg font-semibold hover:bg-muted/80 transition-all hover:shadow-md"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Agencies */}
      {similarAgencies.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6 animate-fade-in-up">
              Similar Agencies in {agency.cityNormalized}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 stagger-children">
              {similarAgencies.map((a, index) => (
                <div key={a.id} className="hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                  <AgencyCard agency={a} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection variant="secondary" />
    </>
  );
}
