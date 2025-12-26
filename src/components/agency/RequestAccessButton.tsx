"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { KeyRound, Loader2 } from "lucide-react";
import RequestAccessModal from "./RequestAccessModal";

interface RequestAccessButtonProps {
    agencyId: string;
    agencyTitle: string;
    hasOwner?: boolean;
    existingRequest?: {
        status: string;
        created_at: string;
    } | null;
}

export default function RequestAccessButton({
    agencyId,
    agencyTitle,
    hasOwner = false,
    existingRequest,
}: RequestAccessButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleRequestAccess = async () => {
        setLoading(true);

        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            // Redirect to signup with return URL
            const returnUrl = encodeURIComponent(window.location.pathname);
            router.push(`/auth/signup?redirect=${returnUrl}`);
            setLoading(false);
            return;
        }

        // Show modal for authenticated users
        setShowModal(true);
        setLoading(false);
    };

    if (existingRequest) {
        const statusConfig = {
            pending: {
                text: "Access Requested",
                color: "bg-yellow-100 text-yellow-800 border-yellow-300",
                icon: "⏳",
            },
            approved: {
                text: "Access Approved",
                color: "bg-green-100 text-green-800 border-green-300",
                icon: "✅",
            },
            rejected: {
                text: "Request Rejected",
                color: "bg-red-100 text-red-800 border-red-300",
                icon: "❌",
            },
        };

        const config = statusConfig[existingRequest.status as keyof typeof statusConfig] || statusConfig.pending;

        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${config.color}`}>
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                        <p className="font-semibold">{config.text}</p>
                        <p className="text-sm opacity-80 mt-1">
                            Requested on {new Date(existingRequest.created_at).toLocaleDateString()}
                        </p>
                        {existingRequest.status === "pending" && (
                            <p className="text-xs mt-1 opacity-70">
                                We'll review your request and notify you via email.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
                <div className="text-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4">
                        <KeyRound className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                        {hasOwner ? "Request Ownership" : "Claim This Agency"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        {hasOwner ? (
                            <>
                                This agency is currently claimed. If you believe you should have ownership of{" "}
                                <span className="font-semibold">{agencyTitle}</span>, you can request access.
                                We'll review your request and contact you.
                            </>
                        ) : (
                            <>
                                Are you the owner of <span className="font-semibold">{agencyTitle}</span>?
                                Request access to manage your agency's profile, add services, and share experiences.
                            </>
                        )}
                    </p>
                    <button
                        onClick={handleRequestAccess}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-primary/90 hover:to-blue-500 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                <KeyRound className="h-5 w-5" />
                                Request {hasOwner ? "Ownership" : "Access"}
                            </>
                        )}
                    </button>
                    <p className="text-xs text-muted-foreground mt-4">
                        ✓ Quick approval process • ✓ No credit card required • ✓ Secure verification
                    </p>
                </div>
            </div>

            {showModal && (
                <RequestAccessModal
                    agencyId={agencyId}
                    agencyTitle={agencyTitle}
                    hasOwner={hasOwner}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        window.location.reload(); // Refresh to show updated status
                    }}
                />
            )}
        </>
    );
}
