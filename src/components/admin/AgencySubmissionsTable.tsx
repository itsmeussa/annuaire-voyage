"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface AgencySubmission {
    id: string;
    title: string;
    slug: string;
    city: string;
    country_code: string;
    status: string;
    owner_id: string | null;
    created_at: string;
}

export default function AgencySubmissionsTable() {
    const [submissions, setSubmissions] = useState<AgencySubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("agencies")
            .select("id, title, slug, city, country_code, status, owner_id, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching submissions:", error);
        } else {
            setSubmissions(data || []);
        }
        setLoading(false);
    };

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            const { error } = await supabase
                .from("agencies")
                .update({ status: "approved" })
                .eq("id", id);

            if (error) throw error;
            await fetchSubmissions();
        } catch (error) {
            console.error("Error approving:", error);
            alert("Failed to approve");
        }
        setProcessingId(null);
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        try {
            const { error } = await supabase
                .from("agencies")
                .update({ status: "rejected" })
                .eq("id", id);

            if (error) throw error;
            await fetchSubmissions();
        } catch (error) {
            console.error("Error rejecting:", error);
            alert("Failed to reject");
        }
        setProcessingId(null);
    };

    const filteredSubmissions = submissions.filter(s => {
        if (filter === "all") return true;
        return s.status === filter;
    });

    const getStatusBadge = (status: string) => {
        const configs = {
            pending: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Pending" },
            approved: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Approved" },
            rejected: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Rejected" },
        };
        const config = configs[status as keyof typeof configs] || configs.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <Icon className="w-4 h-4" />
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {["all", "pending", "approved", "rejected"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 border hover:bg-gray-50"
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === "pending" && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-500 text-white text-xs">
                                {submissions.filter(s => s.status === "pending").length}
                            </span>
                        )}
                    </button>
                ))}
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
                            {filteredSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No {filter !== "all" ? filter : ""} submissions
                                    </td>
                                </tr>
                            ) : (
                                filteredSubmissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold">{sub.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {sub.city}, {sub.country_code}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {sub.owner_id ? "Claimed" : "Unclaimed"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {sub.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(sub.id)}
                                                            disabled={processingId === sub.id}
                                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                                                        >
                                                            {processingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(sub.id)}
                                                            disabled={processingId === sub.id}
                                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                                                        >
                                                            {processingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
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
            </div>
        </div>
    );
}
