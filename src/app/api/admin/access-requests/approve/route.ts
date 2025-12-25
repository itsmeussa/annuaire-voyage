import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminServer } from "@/lib/auth/admin";

export async function POST(request: NextRequest) {
    try {
        const supabase = createServerSupabaseClient();

        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();

        if (!(await isAdminServer(supabase, session))) {
            return NextResponse.json(
                { error: "Admin access required" },
                { status: 403 }
            );
        }

        const { requestId } = await request.json();

        if (!requestId) {
            return NextResponse.json(
                { error: "Request ID is required" },
                { status: 400 }
            );
        }

        // Get request details
        const { data: accessRequest, error: requestError } = await supabase
            .from("agency_access_requests")
            .select("user_id, agency_id")
            .eq("id", requestId)
            .single();

        if (requestError || !accessRequest) {
            return NextResponse.json(
                { error: "Request not found" },
                { status: 404 }
            );
        }

        // Update agency owner_id
        const { error: agencyError } = await supabase
            .from("agencies")
            .update({ owner_id: accessRequest.user_id })
            .eq("id", accessRequest.agency_id);

        if (agencyError) {
            console.error("Error updating agency:", agencyError);
            return NextResponse.json(
                { error: "Failed to update agency ownership" },
                { status: 500 }
            );
        }

        // Update request status
        const { error: updateError } = await supabase
            .from("agency_access_requests")
            .update({
                status: "approved",
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", requestId);

        if (updateError) {
            console.error("Error updating request:", updateError);
            return NextResponse.json(
                { error: "Failed to update request status" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Approve request error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
