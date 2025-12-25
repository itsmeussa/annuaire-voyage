"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Shield, ShieldCheck, ShieldOff, Search } from "lucide-react";

interface User {
    id: string;
    email: string;
    full_name: string | null;
    is_admin: boolean | null;
    created_at: string;
    last_sign_in_at: string | null;
}

export default function UsersManagementTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching users:", error);
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    const toggleAdmin = async (userId: string, currentStatus: boolean) => {
        setUpdatingId(userId);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ is_admin: !currentStatus })
                .eq("id", userId);

            if (error) throw error;
            await fetchUsers();
        } catch (error) {
            console.error("Error updating admin status:", error);
            alert("Failed to update admin status");
        }
        setUpdatingId(null);
    };

    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.email.toLowerCase().includes(query) ||
            user.full_name?.toLowerCase().includes(query)
        );
    });

    const adminCount = users.filter(u => u.is_admin === true).length;
    const regularUsersCount = users.length - adminCount;

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
                        placeholder="Search users by email or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow">
                    <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <div className="text-2xl font-bold text-primary">{adminCount}</div>
                    <div className="text-sm text-gray-600">Admins</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow">
                    <div className="text-2xl font-bold text-gray-600">{regularUsersCount}</div>
                    <div className="text-sm text-gray-600">Regular Users</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">
                                                {user.full_name || "No name"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_admin ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                                    <Shield className="w-4 h-4" />
                                                    User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => toggleAdmin(user.id, user.is_admin || false)}
                                                    disabled={updatingId === user.id}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${user.is_admin
                                                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                                                            : "bg-primary/10 text-primary hover:bg-primary/20"
                                                        }`}
                                                >
                                                    {updatingId === user.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : user.is_admin ? (
                                                        <>
                                                            <ShieldOff className="w-4 h-4 inline mr-1" />
                                                            Revoke Admin
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldCheck className="w-4 h-4 inline mr-1" />
                                                            Make Admin
                                                        </>
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
            </div>
        </div>
    );
}
