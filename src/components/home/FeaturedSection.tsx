"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Loader2 } from "lucide-react";
import AgencyCard from "@/components/ui/AgencyCard";
import { Agency } from "@/types";

interface FeaturedSectionProps {
    initialAgencies: Agency[];
}

// Haversine formula for distance
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function FeaturedSection({ initialAgencies }: FeaturedSectionProps) {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [sortedAgencies, setSortedAgencies] = useState<Agency[]>([]);

    // Initial sort (server-side like) or fallback if no location
    useEffect(() => {
        // Default: Sort by Featured first, then highest Score
        const defaultSort = [...initialAgencies].sort((a, b) => {
            if (a.featured !== b.featured) return a.featured ? -1 : 1;
            return (b.totalScore || 0) - (a.totalScore || 0);
        }).slice(0, 6);
        setSortedAgencies(defaultSort);

        // Try to get location automatically
        detectLocation();
    }, [initialAgencies]);

    const detectLocation = () => {
        if (!navigator.geolocation) return;

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                setUserLocation(loc);

                // Calculate distances and sort
                const agenciesWithDist = initialAgencies.map(agency => {
                    let distance = Infinity;
                    if (agency.location?.lat && agency.location?.lng) {
                        distance = calculateDistance(
                            loc.lat,
                            loc.lng,
                            agency.location.lat,
                            agency.location.lng
                        );
                    }
                    return { ...agency, distance };
                });

                // Filter out agencies with no location (distance Infinity) unless we want to keep them at bottom?
                // Let's keep them but put them last.

                // Sort: Featured First -> Distance ASC
                const sorted = agenciesWithDist.sort((a, b) => {
                    // 1. Featured priority
                    if (a.featured !== b.featured) {
                        return a.featured ? -1 : 1;
                    }
                    // 2. Distance priority (only if both have valid location)
                    if (a.distance !== b.distance) {
                        return a.distance - b.distance;
                    }
                    // 3. Fallback to score
                    return (b.totalScore || 0) - (a.totalScore || 0);
                });

                setSortedAgencies(sorted.slice(0, 6)); // Take top 6
                setIsLocating(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationError("Could not access location. Showing top rated agencies.");
                setIsLocating(false);
            },
            { timeout: 10000, maximumAge: 600000 } // 10 sec timeout, 10 min cache
        );
    };

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                            Featured Travel Agencies
                            {isLocating && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                            {userLocation && <MapPin className="w-6 h-6 text-green-600 animate-bounce" />}
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            {userLocation
                                ? "Showing the best agencies nearest to you."
                                : "Top-rated agencies with excellent reviews and proven track records."}
                        </p>
                        {locationError && <p className="text-sm text-amber-600 mt-1">{locationError}</p>}
                        {!userLocation && !isLocating && (
                            <button
                                onClick={detectLocation}
                                className="text-primary text-sm font-medium hover:underline mt-2 flex items-center gap-1"
                            >
                                <MapPin className="w-3 h-3" /> Use my location to find nearby agencies
                            </button>
                        )}
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
                    {sortedAgencies.map((agency, index) => (
                        <div key={agency.id} className="hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                            <AgencyCard agency={agency} featured={agency.featured} />
                            {/* Optional: Show distance badge if location is active */}
                            {(agency as any).distance !== undefined && (agency as any).distance !== Infinity && (
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-full shadow-sm text-slate-700 z-10">
                                    {((agency as any).distance).toFixed(1)} km away
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
