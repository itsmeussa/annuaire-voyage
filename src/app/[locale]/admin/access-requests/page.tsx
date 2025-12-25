import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminServer } from "../../../lib/auth/admin";
import AccessRequestsTable from "@/components/admin/AccessRequestsTable";
import { Shield } from "lucide-react";

export default async function AdminAccessRequestsPage() {
    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Redirect if not admin
    if (!(await isAdminServer(supabase, session))) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary rounded-xl">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                    </div>
                    <p className="text-gray-600">Manage agency access requests</p>
                </div>

                {/* Table */}
                <AccessRequestsTable />
            </div>
        </div>
    );
}
