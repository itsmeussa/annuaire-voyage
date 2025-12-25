"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import RequestAccessButton from "./RequestAccessButton";

interface UnclaimedAgencyCheckProps {
    agencyId: string;
}

interface Agency {
    owner_id: string | null;
    title: string;
}

interface AccessRequest {
    status: string;
    created_at: string;
}

export default function UnclaimedAgencyCheck({ agencyId }: UnclaimedAgencyCheckProps) {
    const [agency, setAgency] = useState<Agency | null>(null);
    const [accessRequest, setAccessRequest] = useState<AccessRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        checkAgencyStatus();
    }, [agencyId]);

    const checkAgencyStatus = async () => {
        try {
            // Fetch agency owner status
            const { data: agencyData, error: agencyError } = await supabase
                .from("agencies")
                .select("owner_id, title")
                .eq("id", agencyId)
                .single();

            if (agencyError) {
                console.error("Error fetching agency:", agencyError);
                setLoading(false);
                return;
            }

            setAgency(agencyData);

            // Check if current user is the owner
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setLoading(false);
                return;
            }

            // If current user is the owner, don't show request button
            if (agencyData.owner_id === session.user.id) {
                setIsCurrentUserOwner(true);
                setLoading(false);
                return;
            }

            // Check if current user has an access request
            const { data: requestData, error: requestError } = await supabase
                .from("agency_access_requests")
                .select("status, created_at")
                .eq("agency_id", agencyId)
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!requestError && requestData) {
                setAccessRequest(requestData);
            }

            setLoading(false);
        } catch (err) {
            console.error("Unexpected error:", err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    // Don't show anything if current user is the owner
    if (!agency || isCurrentUserOwner) {
        return null;
    }

    // Show request access button for all agencies (claimed or unclaimed)
    return (
        <RequestAccessButton
            agencyId={agencyId}
            agencyTitle={agency.title}
            existingRequest={accessRequest}
            hasOwner={agency.owner_id !== null}
        />
    );
}
