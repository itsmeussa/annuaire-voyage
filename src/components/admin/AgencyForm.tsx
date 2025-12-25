"use client";

import { useState } from "react";
import { Loader2, Plus, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AgencyForm() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        category: "Travel Agency",
        city: "",
        country: "",
        website: "",
        phone: "",
        street: "",
        description: "",
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const slug = `${generateSlug(formData.title)}-${Date.now()}`;

            // Basic normalization - in a real app, use a proper mapping service or library
            const cityNormalized = formData.city.trim();
            const countryNormalized = formData.country.trim();

            const { error: insertError } = await supabase.from("agencies").insert({
                title: formData.title,
                slug: slug,
                category_name: formData.category,
                category_normalized: formData.category,
                city: formData.city,
                city_normalized: cityNormalized,
                country_code: "XX", // Placeholder, ideally fetch from a country list
                country_normalized: countryNormalized,
                website: formData.website,
                phone: formData.phone,
                street: formData.street,
                description: formData.description,
                total_score: 0,
                reviews_count: 0,
                featured: false,
            });

            if (insertError) throw insertError;

            setSuccess(true);
            setFormData({
                title: "",
                category: "Travel Agency",
                city: "",
                country: "",
                website: "",
                phone: "",
                street: "",
                description: "",
            });

            // Refresh router directly to update any lists
            router.refresh();

            // Optional: Redirect to list or stay
            // router.push("/admin/hidden-agencies");
        } catch (err: any) {
            console.error("Error adding agency:", err);
            setError(err.message || "Failed to add agency");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center gap-2 mb-6 text-gray-800">
                <Plus className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">New Agency Details</h2>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm border border-green-100">
                    Agency added successfully!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. Dream Travels Morocco"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    >
                        <option value="Travel Agency">Travel Agency</option>
                        <option value="Tour Operator">Tour Operator</option>
                        <option value="Tourism Agency">Tourism Agency</option>
                        <option value="Adventure Tours">Adventure Tours</option>
                    </select>
                </div>

                {/* Website */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="https://example.com"
                    />
                </div>

                {/* City */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. Casablanca"
                    />
                </div>

                {/* Country */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. Morocco"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="+212 6..."
                    />
                </div>

                {/* Street Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="123 Avenue..."
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                        placeholder="Brief description about the agency..."
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Add Agency
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
