import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

        const { searchParams } = new URL(request.url);
        const agencyId = searchParams.get("id");

        if (!agencyId) {
            return NextResponse.json(
                { error: "Agency ID is required" },
                { status: 400 }
            );
        }

        // Use ADMIN client to RESTORE (set deleted_at to NULL)
        const adminSupabase = createAdminClient();
        const { error } = await adminSupabase
            .from("agencies")
            .update({ deleted_at: null })
            .eq("id", agencyId);

        if (error) {
            console.error("RESTORE ERROR:", error);
            return NextResponse.json(
                { error: `Restore failed: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Restore agency error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
