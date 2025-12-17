import Link from "next/link";
import { MapPin, Phone, Globe, ExternalLink, Users, Star } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { Agency } from "@/types";

interface AgencyCardProps {
  agency: Agency;
  featured?: boolean;
}

export default function AgencyCard({ agency, featured = false }: AgencyCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border ${
        featured ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20" : "border-border"
      } overflow-hidden transition-all duration-300 hover:shadow-xl group`}
    >
      {featured && (
        <div className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground text-xs font-semibold px-3 py-1.5 text-center flex items-center justify-center gap-1">
          <Star className="h-3 w-3 fill-white" />
          Featured Agency
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
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
        <div className="flex items-center gap-3 mb-4">
          <StarRating rating={agency.totalScore} />
          {agency.reviewsCount && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              {agency.reviewsCount} reviews
            </span>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <span className="line-clamp-2">
              {agency.cityNormalized}, {agency.country}
              {agency.street && <span className="block text-xs">{agency.street}</span>}
            </span>
          </div>
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
        </div>

        {/* CTA */}
        <Link
          href={`/agencies/${agency.slug}`}
          className="block w-full text-center bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 hover:shadow-md btn-glow"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
