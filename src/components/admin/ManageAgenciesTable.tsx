"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trash2, Eye, Search, Edit } from "lucide-react";

interface Agency {
    id: string;
    title: string;
    slug: string;
    city: string;
    country_code: string;
    owner_id: string | null;
    status: string;
    created_at: string;
}

export default function ManageAgenciesTable() {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [claimedCount, setClaimedCount] = useState(0);
    const [unclaimedCount, setUnclaimedCount] = useState(0);
    const pageSize = 50;
    const supabase = createClient();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchAgencies();
    }, [currentPage, debouncedSearch]);

    const fetchAgencies = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("agencies")
                .select("id, title, slug, city, country_code, owner_id, status, created_at", { count: "exact" });

            if (debouncedSearch) {
                query = query.or(`title.ilike.%${debouncedSearch}%,city.ilike.%${debouncedSearch}%,country_code.ilike.%${debouncedSearch}%`);
            }

            const { data, error, count } = await query
                .order("created_at", { ascending: false })
                .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

            if (error) throw error;
            setAgencies(data || []);
            setTotalCount(count || 0);

            // Fetch overall stats (separate query to get accurate total claimed/unclaimed)
            const { data: statsData } = await supabase
                .from("agencies")
                .select("owner_id", { count: "exact" });

            // Note: For real stats on huge data, better to use a dedicated stats table or specific count queries
            // But for ~3000 rows, we can still fetch briefly or use multiple count queries
            const { count: totalClaimed } = await supabase
                .from("agencies")
                .select("*", { count: "exact", head: true })
                .not("owner_id", "is", null);

            const { count: totalUnclaimed } = await supabase
                .from("agencies")
                .select("*", { count: "exact", head: true })
                .is("owner_id", null);

            setClaimedCount(totalClaimed || 0);
            setUnclaimedCount(totalUnclaimed || 0);

        } catch (error) {
            console.error("Error fetching agencies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingId(id);
        try {
            const response = await fetch(`/api/admin/agencies/delete?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                await fetchAgencies();
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error deleting agency:", error);
            alert("Failed to delete agency");
        }
        setDeletingId(null);
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search agencies by name, city, or country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow">
                    <div className="text-2xl font-bold text-gray-900">{totalCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Agencies</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <div className="text-2xl font-bold text-green-600">
                        {claimedCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Claimed</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <div className="text-2xl font-bold text-gray-600">
                        {unclaimedCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Unclaimed</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Agency</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Owner</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {agencies.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No agencies found
                                    </td>
                                </tr>
                            ) : (
                                agencies.map((agency) => (
                                    <tr key={agency.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{agency.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {agency.city}, {agency.country_code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${agency.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {agency.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm ${agency.owner_id ? 'text-green-600 font-medium' : 'text-gray-400'
                                                }`}>
                                                {agency.owner_id ? 'Claimed' : 'Unclaimed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <a
                                                    href={`/agencies/${agency.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Edit agency"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href={`/agencies/${agency.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="View agency"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(agency.id, agency.title)}
                                                    disabled={deletingId === agency.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete agency"
                                                >
                                                    {deletingId === agency.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                            <span className="font-medium">
                                {Math.min(currentPage * pageSize, totalCount)}
                            </span>{" "}
                            of <span className="font-medium">{totalCount.toLocaleString()}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
