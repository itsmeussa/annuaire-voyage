import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Redirect if not admin
    if (!(await isAdmin(session))) {
        redirect("/");
    }

    return <AdminDashboard />;
}
