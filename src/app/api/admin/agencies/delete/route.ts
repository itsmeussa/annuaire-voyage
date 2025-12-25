import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminServer } from "@/lib/auth/admin";

export async function DELETE(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const agencyId = searchParams.get("id");

        if (!agencyId) {
            return NextResponse.json(
                { error: "Agency ID is required" },
                { status: 400 }
            );
        }

        // Delete the agency (cascade will delete related data)
        const { error } = await supabase
            .from("agencies")
            .delete()
            .eq("id", agencyId);

        if (error) {
            console.error("Error deleting agency:", error);
            return NextResponse.json(
                { error: "Failed to delete agency" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete agency error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
