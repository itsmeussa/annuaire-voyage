"use client";

import { useState } from "react";
import { Shield, Building2, FileCheck, Briefcase, MapPin, Users, BarChart3 } from "lucide-react";
import AccessRequestsTable from "./AccessRequestsTable";
import AgencySubmissionsTable from "./AgencySubmissionsTable";
import ManageAgenciesTable from "./ManageAgenciesTable";
import ManageServicesTable from "./ManageServicesTable";
import ManageExperiencesTable from "./ManageExperiencesTable";
import UsersManagementTable from "./UsersManagementTable";
import AdminStatsOverview from "./AdminStatsOverview";

type TabType = "dashboard" | "access-requests" | "submissions" | "agencies" | "services" | "experiences" | "users";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>("dashboard");

    const tabs = [
        { id: "dashboard" as TabType, label: "Dashboard", icon: BarChart3 },
        { id: "access-requests" as TabType, label: "Access Requests", icon: FileCheck },
        { id: "submissions" as TabType, label: "Agency Submissions", icon: Building2 },
        { id: "agencies" as TabType, label: "Manage Agencies", icon: Building2 },
        { id: "services" as TabType, label: "Manage Services", icon: Briefcase },
        { id: "experiences" as TabType, label: "Manage Experiences", icon: MapPin },
        { id: "users" as TabType, label: "Users", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary rounded-xl">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <p className="text-gray-600">Manage all aspects of TravelAgencies.World</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id
                                        ? "border-primary text-primary bg-primary/5"
                                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="transition-all">
                    {activeTab === "dashboard" && <AdminStatsOverview />}
                    {activeTab === "access-requests" && <AccessRequestsTable />}
                    {activeTab === "submissions" && <AgencySubmissionsTable />}
                    {activeTab === "agencies" && <ManageAgenciesTable />}
                    {activeTab === "services" && <ManageServicesTable />}
                    {activeTab === "experiences" && <ManageExperiencesTable />}
                    {activeTab === "users" && <UsersManagementTable />}
                </div>
            </div>
        </div>
    );
}
