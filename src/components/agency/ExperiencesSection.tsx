"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trash2, Calendar, MapPin, DollarSign, Clock, Users, Image as ImageIcon } from "lucide-react";

interface ExperiencesSectionProps {
    agencyId: string;
    isOwner: boolean;
}

interface Experience {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    price: number | null;
    currency: string | null;
    duration: string | null;
    max_participants: number | null;
    images: string[];
    created_at: string;
}

export default function ExperiencesSection({
    agencyId,
    isOwner,
}: ExperiencesSectionProps) {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchExperiences();
    }, [agencyId]);

    const fetchExperiences = async () => {
        const { data, error } = await supabase
            .from("experiences")
            .select("*")
            .eq("agency_id", agencyId)
            .order("created_at", { ascending: false });

        if (data) {
            setExperiences(data);
        }
        setLoading(false);
    };

    const handleDelete = async (experienceId: string) => {
        if (!confirm("Are you sure you want to delete this experience?")) return;

        setDeleting(experienceId);

        const { error } = await supabase
            .from("experiences")
            .delete()
            .eq("id", experienceId);

        if (!error) {
            setExperiences(experiences.filter((exp) => exp.id !== experienceId));
        }

        setDeleting(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (experiences.length === 0) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Experiences Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    {isOwner
                        ? "Start showcasing your amazing tours and experiences! Click the 'Add Experience' button above to get started."
                        : "This agency hasn't added any experiences yet. Check back soon!"}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Experiences & Tours</h2>
                <span className="text-sm text-gray-500">{experiences.length} {experiences.length === 1 ? 'experience' : 'experiences'}</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {experiences.map((experience) => (
                    <div
                        key={experience.id}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    >
                        {/* Image */}
                        {experience.images.length > 0 ? (
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <img
                                    src={experience.images[0]}
                                    alt={experience.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {isOwner && (
                                    <button
                                        onClick={() => handleDelete(experience.id)}
                                        disabled={deleting === experience.id}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-red-50 rounded-full transition-colors shadow-lg disabled:opacity-50"
                                        title="Delete experience"
                                    >
                                        {deleting === experience.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="relative h-56 bg-gradient-to-br from-primary/10 to-blue-100 flex items-center justify-center">
                                <ImageIcon className="w-16 h-16 text-primary/30" />
                                {isOwner && (
                                    <button
                                        onClick={() => handleDelete(experience.id)}
                                        disabled={deleting === experience.id}
                                        className="absolute top-3 right-3 p-2 bg-white text-red-600 hover:bg-red-50 rounded-full transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        {deleting === experience.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                    {experience.title}
                                </h3>
                                {experience.price && (
                                    <div className="flex-shrink-0 ml-3">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-primary">
                                                {experience.price.toFixed(0)}
                                                <span className="text-sm font-normal text-gray-500 ml-1">
                                                    {experience.currency || 'USD'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">per person</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {experience.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {experience.description}
                                </p>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {experience.location && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="truncate">{experience.location}</span>
                                    </div>
                                )}

                                {experience.duration && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="truncate">{experience.duration}</span>
                                    </div>
                                )}

                                {experience.max_participants && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Users className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span>Max {experience.max_participants} people</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                    <span>{new Date(experience.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="w-full mt-2 px-4 py-2.5 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-xl font-semibold transition-all duration-200 border border-primary/20">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
