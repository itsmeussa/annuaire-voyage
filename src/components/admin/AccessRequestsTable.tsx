"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface AccessRequest {
    id: string;
    user_id: string;
    user_email: string;
    user_name: string;
    message: string | null;
    status: string;
    created_at: string;
    reviewed_at: string | null;
    agency_id: string;
    agency_title: string;
    agency_slug: string;
    has_owner: boolean;
}

export default function AccessRequestsTable() {
    const [requests, setRequests] = useState<AccessRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("agency_access_requests")
            .select(`
                *,
                agencies!inner(
                    title,
                    slug,
                    owner_id
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching requests:", error);
        } else {
            const formatted = (data || []).map((req: any) => ({
                id: req.id,
                user_id: req.user_id,
                user_email: req.user_email,
                user_name: req.user_name,
                message: req.message,
                status: req.status,
                created_at: req.created_at,
                reviewed_at: req.reviewed_at,
                agency_id: req.agency_id,
                agency_title: req.agencies.title,
                agency_slug: req.agencies.slug,
                has_owner: req.agencies.owner_id !== null,
            }));
            setRequests(formatted);
        }
        setLoading(false);
    };

    const handleApprove = async (requestId: string) => {
        setProcessingId(requestId);
        try {
            const response = await fetch("/api/admin/access-requests/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId }),
            });

            if (response.ok) {
                await fetchRequests(); // Refresh the list
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error approving request:", error);
            alert("Failed to approve request");
        }
        setProcessingId(null);
    };

    const handleReject = async (requestId: string) => {
        setProcessingId(requestId);
        try {
            const response = await fetch("/api/admin/access-requests/reject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId }),
            });

            if (response.ok) {
                await fetchRequests(); // Refresh the list
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error rejecting request:", error);
            alert("Failed to reject request");
        }
        setProcessingId(null);
    };

    const filteredRequests = requests.filter(req => {
        if (filter === "all") return true;
        return req.status === filter;
    });

    const getStatusBadge = (status: string) => {
        const configs = {
            pending: { icon: Clock, color: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "Pending" },
            approved: { icon: CheckCircle, color: "bg-green-100 text-green-800 border-green-300", label: "Approved" },
            rejected: { icon: XCircle, color: "bg-red-100 text-red-800 border-red-300", label: "Rejected" },
        };
        const config = configs[status as keyof typeof configs] || configs.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
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
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-6">
                {["all", "pending", "approved", "rejected"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f
                                ? "bg-primary text-white shadow-lg"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === "pending" && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-500 text-white text-xs">
                                {requests.filter(r => r.status === "pending").length}
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
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No {filter !== "all" ? filter : ""} requests found
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <>
                                        <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{req.agency_title}</div>
                                                    <a
                                                        href={`/agencies/${req.agency_slug}`}
                                                        target="_blank"
                                                        className="text-sm text-primary hover:underline"
                                                    >
                                                        View Agency →
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{req.user_name}</div>
                                                    <div className="text-sm text-gray-500">{req.user_email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(req.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-medium ${req.has_owner ? "text-orange-600" : "text-green-600"}`}>
                                                    {req.has_owner ? "Ownership Request" : "Claim Request"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {req.message && (
                                                        <button
                                                            onClick={() => setExpandedRow(expandedRow === req.id ? null : req.id)}
                                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                            title="View message"
                                                        >
                                                            {expandedRow === req.id ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                    {req.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(req.id)}
                                                                disabled={processingId === req.id}
                                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 flex items-center gap-1"
                                                            >
                                                                {processingId === req.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle className="w-4 h-4" />
                                                                )}
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(req.id)}
                                                                disabled={processingId === req.id}
                                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-1"
                                                            >
                                                                {processingId === req.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="w-4 h-4" />
                                                                )}
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {req.status !== "pending" && (
                                                        <span className="text-sm text-gray-500">
                                                            {req.reviewed_at && `on ${new Date(req.reviewed_at).toLocaleDateString()}`}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedRow === req.id && req.message && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                                    <div className="max-w-2xl">
                                                        <div className="text-sm font-semibold text-gray-700 mb-2">Message:</div>
                                                        <div className="text-sm text-gray-600 whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200">
                                                            {req.message}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
