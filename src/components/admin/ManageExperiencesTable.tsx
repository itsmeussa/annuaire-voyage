"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trash2, Search } from "lucide-react";

interface Experience {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    agency_id: string;
    agency_title: string;
    created_at: string;
}

export default function ManageExperiencesTable() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
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
        fetchExperiences();
    }, [currentPage, debouncedSearch]);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("experiences")
                .select(`
                    *,
                    agencies!inner(title)
                `, { count: "exact" });

            if (debouncedSearch) {
                query = query.or(`title.ilike.%${debouncedSearch}%,agencies.title.ilike.%${debouncedSearch}%`);
            }

            const { data, error, count } = await query
                .order("created_at", { ascending: false })
                .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

            if (error) throw error;

            const formatted = (data || []).map((e: any) => ({
                ...e,
                agency_title: e.agencies.title,
            }));
            setExperiences(formatted);
            setTotalCount(count || 0);
        } catch (error) {
            console.error("Error fetching experiences:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete experience "${title}"?`)) return;

        setDeletingId(id);
        try {
            const response = await fetch(`/api/admin/experiences/delete?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                await fetchExperiences();
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error deleting experience:", error);
            alert("Failed to delete experience");
        }
        setDeletingId(null);
    };

    const filteredExperiences = experiences.filter((e) => {
        const query = searchQuery.toLowerCase();
        return (
            e.title.toLowerCase().includes(query) ||
            e.agency_title.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search experiences..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white p-4 rounded-xl shadow mb-6">
                <div className="text-2xl font-bold text-gray-900">{totalCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Experiences</div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Experience</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Agency</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredExperiences.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No experiences found
                                    </td>
                                </tr>
                            ) : (
                                filteredExperiences.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {exp.image_url && (
                                                    <img
                                                        src={exp.image_url}
                                                        alt={exp.title}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                )}
                                                <div className="font-semibold text-gray-900">{exp.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">{exp.agency_title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 max-w-md truncate">
                                                {exp.description || "No description"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => handleDelete(exp.id, exp.title)}
                                                    disabled={deletingId === exp.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === exp.id ? (
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
