"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Edit, Plus, Loader2, Sparkles } from "lucide-react";
import EditAgencyModal from "./EditAgencyModal";
import AddExperienceModal from "./AddExperienceModal";
import AddServiceModal from "./AddServiceModal";
import ExperiencesSection from "./ExperiencesSection";
import ServicesSection from "./ServicesSection";

interface ManageAgencyProps {
    agencyId: string;
    agencySlug: string;
}

export default function ManageAgency({ agencyId, agencySlug }: ManageAgencyProps) {
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        checkOwnership();
    }, [agencyId]);

    const checkOwnership = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            setLoading(false);
            return;
        }

        // Check if user is admin
        const isAdmin = session.user.email === "admin@example.com";

        if (isAdmin) {
            setIsOwner(true);
            setLoading(false);
            return;
        }

        // Check if user owns this agency
        const { data: agency } = await supabase
            .from("agencies")
            .select("owner_id")
            .eq("id", agencyId)
            .single();

        if (agency && agency.owner_id === session.user.id) {
            setIsOwner(true);
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
        );
    }

    if (!isOwner) {
        return <ExperiencesSection agencyId={agencyId} isOwner={false} />;
    }

    return (
        <div className="space-y-6">
            {/* Owner Controls */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-blue-900">Agency Management</h3>
                        <p className="text-xs text-blue-700 mt-1">
                            You have edit access to this agency
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Agency
                        </button>
                        <button
                            onClick={() => setShowAddExperienceModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add Experience
                        </button>
                        <button
                            onClick={() => setShowAddServiceModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            <Sparkles className="w-4 h-4" />
                            Add Service
                        </button>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <ServicesSection agencyId={agencyId} isOwner={true} />

            {/* Experiences Section */}
            <ExperiencesSection agencyId={agencyId} isOwner={true} />

            {/* Modals */}
            {showEditModal && (
                <EditAgencyModal
                    agencyId={agencyId}
                    agencySlug={agencySlug}
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {showAddExperienceModal && (
                <AddExperienceModal
                    agencyId={agencyId}
                    onClose={() => setShowAddExperienceModal(false)}
                />
            )}

            {showAddServiceModal && (
                <AddServiceModal
                    agencyId={agencyId}
                    onClose={() => setShowAddServiceModal(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </div>
    );
}
