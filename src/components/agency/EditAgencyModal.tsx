"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Loader2, MapPin, Phone, Globe, Building, FileText, Map, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/lib/countries";

interface EditAgencyModalProps {
    agencyId: string;
    agencySlug: string;
    onClose: () => void;
}

export default function EditAgencyModal({
    agencyId,
    agencySlug,
    onClose,
}: EditAgencyModalProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        street: "",
        city: "",
        state: "",
        country_code: "",
        phone: "",
        email: "",
        website: "",
        category_name: "",
        google_maps_url: "",
        latitude: "",
        longitude: "",
    });

    useEffect(() => {
        fetchAgency();
    }, [agencyId]);

    const fetchAgency = async () => {
        const { data, error } = await supabase
            .from("agencies")
            .select("*")
            .eq("id", agencyId)
            .single();

        if (data) {
            setFormData({
                title: data.title || "",
                description: data.description || "",
                street: data.street || "",
                city: data.city || "",
                state: data.state || "",
                country_code: data.country_code || "",
                phone: data.phone || "",
                email: data.email || "",
                website: data.website || "",
                category_name: data.category_name || "",
                google_maps_url: data.url || "",
                latitude: data.latitude?.toString() || "",
                longitude: data.longitude?.toString() || "",
            });
        }
        setLoading(false);
    };

    const extractCoordsFromMapsUrl = (url: string) => {
        // Try to extract coordinates from Google Maps URL
        // Format: https://maps.google.com/?q=lat,lng or https://www.google.com/maps/@lat,lng
        try {
            const patterns = [
                /@(-?\d+\.\d+),(-?\d+\.\d+)/,  // @lat,lng
                /q=(-?\d+\.\d+),(-?\d+\.\d+)/,  // q=lat,lng
                /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // !3dlat!4dlng
            ];

            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) {
                    return {
                        latitude: match[1],
                        longitude: match[2],
                    };
                }
            }
        } catch (e) {
            console.error("Error extracting coords:", e);
        }
        return null;
    };

    const handleMapsUrlChange = (url: string) => {
        setFormData({ ...formData, google_maps_url: url });

        // Auto-extract coordinates
        const coords = extractCoordsFromMapsUrl(url);
        if (coords) {
            setFormData(prev => ({
                ...prev,
                google_maps_url: url,
                latitude: coords.latitude,
                longitude: coords.longitude,
            }));
        }
    };

    const handleGenerateAIDescription = async () => {
        if (!formData.title || !formData.category_name) {
            setError("Agency name and category are required to generate a description.");
            return;
        }

        setGenerating(true);
        setError(null);
        try {
            const response = await fetch("/api/admin/agencies/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    category: formData.category_name,
                    location: `${formData.city}, ${formData.country_code}`,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setFormData(prev => ({ ...prev, description: data.description }));
            } else {
                throw new Error(data.error || "Failed to generate AI description");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from("agencies")
                .update({
                    title: formData.title,
                    description: formData.description,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    country_code: formData.country_code,
                    phone: formData.phone,
                    email: formData.email,
                    website: formData.website,
                    category_name: formData.category_name,
                    url: formData.google_maps_url,
                    latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                    longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                    city_normalized: formData.city.toLowerCase().trim(),
                    country_normalized: COUNTRIES.find((c: any) => c.code === formData.country_code)?.name.toLowerCase() || formData.country_code.toLowerCase(),
                    category_normalized: formData.category_name.toLowerCase().trim(),
                })
                .eq("id", agencyId);

            if (updateError) throw updateError;

            router.refresh();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to update agency");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900">Edit Agency</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Building className="w-5 h-5 text-primary" />
                                Basic Information
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Agency Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.category_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category_name: e.target.value })
                                    }
                                    placeholder="e.g., Tour operator, Travel agency"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Description
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleGenerateAIDescription}
                                        disabled={generating || !formData.title || !formData.category_name}
                                        className="text-xs flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors disabled:opacity-50 font-medium"
                                    >
                                        {generating ? (
                                            <>
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Drafting...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-3 h-3" />
                                                Assist with AI
                                            </>
                                        )}
                                    </button>
                                </div>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={4}
                                    placeholder="Tell us about your agency, services, and what makes you special..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Location
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.street}
                                    onChange={(e) =>
                                        setFormData({ ...formData, street: e.target.value })
                                    }
                                    placeholder="123 Main St"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData({ ...formData, city: e.target.value })
                                        }
                                        placeholder="Paris"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State/Region
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) =>
                                            setFormData({ ...formData, state: e.target.value })
                                        }
                                        placeholder="Île-de-France"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.country_code}
                                    onChange={(e) =>
                                        setFormData({ ...formData, country_code: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                >
                                    <option value="">Select a country</option>
                                    {COUNTRIES.map((country: any) => (
                                        <option key={country.code} value={country.code}>
                                            {country.flag} {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Map className="w-4 h-4" />
                                    Google Maps Link
                                </label>
                                <input
                                    type="url"
                                    value={formData.google_maps_url}
                                    onChange={(e) => handleMapsUrlChange(e.target.value)}
                                    placeholder="https://maps.google.com/?q=..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Paste your Google Maps link here - coordinates will be extracted automatically
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.latitude}
                                        onChange={(e) =>
                                            setFormData({ ...formData, latitude: e.target.value })
                                        }
                                        placeholder="48.8566"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.longitude}
                                        onChange={(e) =>
                                            setFormData({ ...formData, longitude: e.target.value })
                                        }
                                        placeholder="2.3522"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-primary" />
                                Contact Information
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    placeholder="+33 1 23 45 67 89"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder="contact@agency.com"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) =>
                                        setFormData({ ...formData, website: e.target.value })
                                    }
                                    placeholder="https://www.example.com"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
