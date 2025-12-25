"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        TravelAgencies
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin/hidden-agencies"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/admin/hidden-agencies"
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Hidden Agencies
                    </Link>

                    <Link
                        href="/admin/add-agency"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === "/admin/add-agency"
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <PlusCircle className="h-5 w-5" />
                        Add Agency
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
