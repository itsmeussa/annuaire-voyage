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

        // Update request status to rejected
        const { error: updateError } = await supabase
            .from("agency_access_requests")
            .update({
                status: "rejected",
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", requestId);

        if (updateError) {
            console.error("Error rejecting request:", updateError);
            return NextResponse.json(
                { error: "Failed to reject request" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reject request error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
