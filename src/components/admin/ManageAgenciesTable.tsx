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

    const [showTrash, setShowTrash] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchAgencies();
    }, [currentPage, debouncedSearch, showTrash]); // Re-fetch when trash mode toggles

    const fetchAgencies = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("agencies")
                .select("id, title, slug, city, country_code, owner_id, status, created_at, deleted_at", { count: "exact" });

            // Filter based on Trash mode
            if (showTrash) {
                query = query.not("deleted_at", "is", null);
            } else {
                query = query.is("deleted_at", null);
            }

            if (debouncedSearch) {
                query = query.or(`title.ilike.%${debouncedSearch}%,city.ilike.%${debouncedSearch}%,country_code.ilike.%${debouncedSearch}%`);
            }

            const { data, error, count } = await query
                .order(showTrash ? "deleted_at" : "created_at", { ascending: false })
                .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

            if (error) throw error;
            setAgencies(data || []);
            setTotalCount(count || 0);

            // Fetch overall stats
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

    const handleRestore = async (id: string) => {
        console.log("Restore clicked for:", id);
        // Removed confirm to prevent browser blocking
        // if (!confirm("Restore this agency?")) return;

        try {
            const response = await fetch(`/api/admin/agencies/restore?id=${id}`, { method: "POST" });
            console.log("Restore response:", response.status);

            if (response.ok) {
                // Remove from trash list immediately
                setAgencies(prev => prev.filter(a => a.id !== id));
                setTotalCount(prev => prev - 1);
            } else {
                const data = await response.json();
                console.error("Restore failed:", data);
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error restoring:", error);
            alert("Failed to restore agency");
        }
    };

    const handleDelete = async (id: string, title: string) => {
        // If in trash, maybe Permanent Delete? For now, stick to soft delete or add permanent logic later.
        // Assuming this function is for soft delete from main list.

        console.log("Delete clicked for:", id, title);

        // TEMPORARY: Removed confirm to debug potential blocking issue
        /* 
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            console.log("Delete cancelled by user");
            return;
        }
        */

        console.log("Delete confirmed (auto). Sending request...");
        setDeletingId(id);

        try {
            const response = await fetch(`/api/admin/agencies/delete?id=${id}`, {
                method: "DELETE",
            });
            console.log("Response received:", response.status, response.statusText);

            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok) {
                // Remove from local state immediately to avoid refetch delay check
                setAgencies(prev => prev.filter(a => a.id !== id));
                setTotalCount(prev => prev - 1);
                console.log("Agency deleted from state");
            } else {
                console.error("Delete failed:", data.error);
                alert(`Failed to delete agency: ${data.error}`);
            }
        } catch (error) {
            console.error("Error deleting agency:", error);
            alert("An unexpected error occurred while deleting the agency.");
        } finally {
            setDeletingId(null);
        }
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
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search agencies by name, city, or country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Trash Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg ml-4">
                    <button
                        onClick={() => setShowTrash(false)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!showTrash ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setShowTrash(true)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${showTrash ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Trash
                    </button>
                </div>
            </div>

            {/* Stats */}
            {!showTrash && (
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
            )}
            {showTrash && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6 text-red-800 text-sm">
                    <strong>Trash Bin:</strong> Items here are permanently deleted after 24 hours.
                </div>
            )}

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
                                        {showTrash ? "No deleted agencies found" : "No agencies found"}
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
                                                {showTrash ? (
                                                    <button
                                                        onClick={() => handleRestore(agency.id)}
                                                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium transition-colors"
                                                    >
                                                        Restore
                                                    </button>
                                                ) : (
                                                    <>
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
                                                    </>
                                                )}
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
