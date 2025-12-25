"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Loader2, Sparkles } from "lucide-react";

interface AddServiceModalProps {
    agencyId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddServiceModal({
    agencyId,
    onClose,
    onSuccess,
}: AddServiceModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("✈️");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const commonIcons = [
        "✈️", "🗺️", "🏨", "🚗", "🎫", "🏖️", "⛰️", "🏛️",
        "🍴", "📸", "🎒", "🧳", "🚢", "🚁", "🎿", "🏊"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { error: insertError } = await supabase.from("services").insert({
                agency_id: agencyId,
                name,
                description: description || null,
                icon,
            });

            if (insertError) throw insertError;

            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error("Error adding service:", err);
            setError(err.message || "Failed to add service");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Add Service</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Icon Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icon
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {commonIcons.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setIcon(emoji)}
                                    className={`text-2xl p-2 rounded-lg border-2 transition-all ${icon === emoji
                                            ? "border-primary bg-primary/10"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Service Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Airport Transfer"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed description of this service..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !name}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Add Service
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
