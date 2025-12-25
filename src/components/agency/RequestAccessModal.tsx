"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Loader2, Send } from "lucide-react";

interface RequestAccessModalProps {
    agencyId: string;
    agencyTitle: string;
    hasOwner?: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RequestAccessModal({
    agencyId,
    agencyTitle,
    hasOwner = false,
    onClose,
    onSuccess,
}: RequestAccessModalProps) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Get current user
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setError("You must be logged in to request access.");
                setLoading(false);
                return;
            }

            // Submit access request (don't check if agency is unclaimed anymore)
            const { error: insertError } = await supabase
                .from("agency_access_requests")
                .insert({
                    agency_id: agencyId,
                    user_id: session.user.id,
                    user_email: session.user.email,
                    user_name: session.user.user_metadata?.full_name || session.user.email,
                    message: message.trim() || null,
                    status: "pending",
                });

            if (insertError) {
                if (insertError.code === "23505") { // Unique constraint violation
                    setError("You have already requested access to this agency.");
                } else {
                    setError("Failed to submit request. Please try again.");
                    console.error("Insert error:", insertError);
                }
                setLoading(false);
                return;
            }

            // Success!
            onSuccess();
        } catch (err) {
            console.error("Unexpected error:", err);
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slide-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-foreground">
                        {hasOwner ? "Request Ownership" : "Request Access"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-4">
                            {hasOwner ? (
                                <>
                                    You're requesting ownership of{" "}
                                    <span className="font-semibold text-foreground">{agencyTitle}</span>.
                                    This agency currently has an owner. Please explain why you should have access.
                                </>
                            ) : (
                                <>
                                    You're requesting access to manage{" "}
                                    <span className="font-semibold text-foreground">{agencyTitle}</span>.
                                </>
                            )}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Our team will review your request and notify you via email once approved.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                            Message {hasOwner ? "(Required)" : "(Optional)"}
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={hasOwner
                                ? "Explain why you should have ownership of this agency..."
                                : "Tell us why you should have access to this agency..."}
                            rows={4}
                            maxLength={500}
                            required={hasOwner}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {message.length}/500 characters
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 text-foreground rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (hasOwner && !message.trim())}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold hover:from-primary/90 hover:to-blue-500 transition-all shadow-lg shadow-primary/25 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-5 w-5" />
                                    Submit Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
