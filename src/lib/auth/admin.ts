import { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Check if the current user is an admin (client-side)
 */
export async function isAdmin(session: Session | null): Promise<boolean> {
    if (!session) return false;

    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();

        if (error || !data) return false;

        return data.is_admin === true;
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}

/**
 * Check if the current user is an admin (server-side - for API routes)
 * Pass the supabase client from the API route
 */
export async function isAdminServer(supabase: SupabaseClient, session: Session | null): Promise<boolean> {
    if (!session) return false;

    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();

        if (error || !data) return false;

        return data.is_admin === true;
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}

/**
 * Throw error if user is not admin
 */
export async function requireAdmin(session: Session | null): Promise<void> {
    const adminStatus = await isAdmin(session);
    if (!adminStatus) {
        throw new Error("Admin access required");
    }
}
