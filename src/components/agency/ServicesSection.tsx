"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trash2, Sparkles } from "lucide-react";

interface ServicesSectionProps {
    agencyId: string;
    isOwner: boolean;
}

interface Service {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    created_at: string;
}

export default function ServicesSection({
    agencyId,
    isOwner,
}: ServicesSectionProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchServices();
    }, [agencyId]);

    const fetchServices = async () => {
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .eq("agency_id", agencyId)
            .order("created_at", { ascending: true });

        if (data) {
            setServices(data);
        }
        setLoading(false);
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        setDeleting(serviceId);

        const { error } = await supabase
            .from("services")
            .delete()
            .eq("id", serviceId);

        if (!error) {
            setServices(services.filter((svc) => svc.id !== serviceId));
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

    if (services.length === 0) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    {isOwner
                        ? "Start showcasing your services! Click the 'Add Service' button above to get started."
                        : "This agency hasn't added any services yet. Check back soon!"}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
                <span className="text-sm text-gray-500">{services.length} {services.length === 1 ? 'service' : 'services'}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group"
                    >
                        {isOwner && (
                            <button
                                onClick={() => handleDelete(service.id)}
                                disabled={deleting === service.id}
                                className="absolute top-3 right-3 p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                title="Delete service"
                            >
                                {deleting === service.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>
                        )}

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                                {service.icon || "✨"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                    {service.name}
                                </h3>
                                {service.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {service.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
