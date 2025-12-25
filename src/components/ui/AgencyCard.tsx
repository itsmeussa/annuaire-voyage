import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Globe, ExternalLink, Users, Star, Map } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { Agency } from "@/types";

interface AgencyCardProps {
  agency: Agency;
  featured?: boolean;
}

// Generate a consistent image ID based on the agency
function getAgencyImage(agency: Agency): string {
  // Use a hash of the agency id to get consistent but varied images
  // Use the agency id (or slug) directly as seed to ensure uniqueness
  return `https://picsum.photos/seed/${agency.id}/400/200`;
}

export default function AgencyCard({ agency, featured = false }: AgencyCardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl border ${featured ? "border-primary/30 shadow-xl shadow-primary/10 ring-1 ring-primary/20" : "border-gray-100 shadow-lg shadow-gray-200/50"
        } overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group`}
    >
      {featured && (
        <div className="bg-gradient-to-r from-primary via-blue-500 to-primary text-white text-xs font-semibold px-3 py-2 text-center flex items-center justify-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-white" />
          Featured Agency
        </div>
      )}

      {/* Image */}
      <Link href={`/agencies/${agency.slug}`} className="block relative h-40 overflow-hidden">
        <Image
          src={getAgencyImage(agency)}
          alt={`${agency.title} - ${agency.country}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm font-medium">
          <MapPin className="h-4 w-4" />
          {agency.country}
        </div>
      </Link>

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <Link href={`/agencies/${agency.slug}`}>
              <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-2 group-hover:text-primary">
                {agency.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {agency.category}
            </p>
          </div>
          {agency.website && (
            <a
              href={agency.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Visit website"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3 mb-3">
          <StarRating rating={agency.totalScore} />
          {agency.reviewsCount && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              {agency.reviewsCount.toLocaleString()} reviews
            </span>
          )}
        </div>

        {/* Location - City & Street */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
          <span className="line-clamp-2">
            {agency.cityNormalized}
            {agency.street && <span className="block text-xs opacity-75">{agency.street}</span>}
          </span>
        </div>

        {/* Contact */}
        <div className="flex flex-wrap gap-2 mb-4">
          {agency.phone && (
            <a
              href={`tel:${agency.phone}`}
              className="flex items-center gap-1.5 text-sm bg-muted px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-md"
            >
              <Phone className="h-3 w-3" />
              Call
            </a>
          )}
          {agency.website && (
            <a
              href={agency.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm bg-muted px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-md"
            >
              <Globe className="h-3 w-3" />
              Website
            </a>
          )}
          {agency.url && (
            <a
              href={agency.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-md"
              title="View on Google Maps"
            >
              <Map className="h-3 w-3" />
              Maps
            </a>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/agencies/${agency.slug}`}
          className="block w-full text-center bg-gradient-to-r from-primary to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
