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
                { error: "Service ID is required" },
                { status: 400 }
            );
        }

        // Delete the service
        const { error } = await supabase
            .from("services")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting service:", error);
            return NextResponse.json(
                { error: "Failed to delete service" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete service error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
