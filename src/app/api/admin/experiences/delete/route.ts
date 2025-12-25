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
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Experience ID is required" },
                { status: 400 }
            );
        }

        // Delete the experience
        const { error } = await supabase
            .from("experiences")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting experience:", error);
            return NextResponse.json(
                { error: "Failed to delete experience" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete experience error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
