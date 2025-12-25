"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Building2, Users, FileCheck, Briefcase, MapPin, TrendingUp } from "lucide-react";

interface DashboardStats {
    totalAgencies: number;
    claimedAgencies: number;
    unclaimedAgencies: number;
    pendingAgencies: number;
    totalUsers: number;
    adminUsers: number;
    totalServices: number;
    totalExperiences: number;
    pendingRequests: number;
}

export default function AdminStatsOverview() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);

        try {
            // Fetch all counts in parallel using head-only queries
            const [
                totalAgenciesRes,
                claimedAgenciesRes,
                unclaimedAgenciesRes,
                pendingAgenciesRes,
                totalUsersRes,
                adminUsersRes,
                servicesRes,
                experiencesRes,
                pendingRequestsRes,
            ] = await Promise.all([
                supabase.from("agencies").select("*", { count: "exact", head: true }),
                supabase.from("agencies").select("*", { count: "exact", head: true }).not("owner_id", "is", null),
                supabase.from("agencies").select("*", { count: "exact", head: true }).is("owner_id", null),
                supabase.from("agencies").select("*", { count: "exact", head: true }).eq("status", "pending"),
                supabase.from("profiles").select("*", { count: "exact", head: true }),
                supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_admin", true),
                supabase.from("services").select("*", { count: "exact", head: true }),
                supabase.from("experiences").select("*", { count: "exact", head: true }),
                supabase.from("agency_access_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
            ]);

            setStats({
                totalAgencies: totalAgenciesRes.count || 0,
                claimedAgencies: claimedAgenciesRes.count || 0,
                unclaimedAgencies: unclaimedAgenciesRes.count || 0,
                pendingAgencies: pendingAgenciesRes.count || 0,
                totalUsers: totalUsersRes.count || 0,
                adminUsers: adminUsersRes.count || 0,
                totalServices: servicesRes.count || 0,
                totalExperiences: experiencesRes.count || 0,
                pendingRequests: pendingRequestsRes.count || 0,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12 text-gray-500">
                Failed to load statistics
            </div>
        );
    }

    const statCards = [
        {
            icon: Building2,
            label: "Total Agencies",
            value: stats.totalAgencies,
            subtext: `${stats.claimedAgencies} claimed, ${stats.unclaimedAgencies} unclaimed`,
            color: "bg-blue-500",
            gradient: "from-blue-500 to-blue-600",
        },
        {
            icon: FileCheck,
            label: "Pending Approvals",
            value: stats.pendingAgencies + stats.pendingRequests,
            subtext: `${stats.pendingAgencies} agencies, ${stats.pendingRequests} requests`,
            color: "bg-yellow-500",
            gradient: "from-yellow-500 to-orange-500",
        },
        {
            icon: Users,
            label: "Total Users",
            value: stats.totalUsers,
            subtext: `${stats.adminUsers} admins, ${stats.totalUsers - stats.adminUsers} users`,
            color: "bg-green-500",
            gradient: "from-green-500 to-green-600",
        },
        {
            icon: Briefcase,
            label: "Services",
            value: stats.totalServices,
            subtext: "Total services across all agencies",
            color: "bg-purple-500",
            gradient: "from-purple-500 to-purple-600",
        },
        {
            icon: MapPin,
            label: "Experiences",
            value: stats.totalExperiences,
            subtext: "Total experiences across all agencies",
            color: "bg-pink-500",
            gradient: "from-pink-500 to-pink-600",
        },
        {
            icon: TrendingUp,
            label: "Growth Rate",
            value: "🔥 Active",
            subtext: "Platform is growing steadily",
            color: "bg-indigo-500",
            gradient: "from-indigo-500 to-indigo-600",
        },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Overview</h2>
                <p className="text-gray-600">Real-time statistics and metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02]"
                        >
                            <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 ${stat.color} rounded-xl`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {stat.label}
                                </h3>
                                <p className="text-sm text-gray-500">{stat.subtext}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Quick Access</h3>
                <p className="text-white/80 mb-4">Jump to common admin tasks</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg transition-all text-sm font-medium">
                        📊 View Reports
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg transition-all text-sm font-medium">
                        ✉️ Send Announcement
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg transition-all text-sm font-medium">
                        🔒 Security Settings
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg transition-all text-sm font-medium">
                        📈 Analytics
                    </button>
                </div>
            </div>
        </div>
    );
}
