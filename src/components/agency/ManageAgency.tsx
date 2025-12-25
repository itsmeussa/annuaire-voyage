"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Edit, Plus, Loader2, Sparkles } from "lucide-react";
import EditAgencyModal from "@/components/agency/EditAgencyModal";
import AddExperienceModal from "@/components/agency/AddExperienceModal";
import AddServiceModal from "@/components/agency/AddServiceModal";
import ExperiencesSection from "@/components/agency/ExperiencesSection";
import ServicesSection from "@/components/agency/ServicesSection";
import UnclaimedAgencyCheck from "@/components/agency/UnclaimedAgencyCheck";
import AgencyImageUpload from "@/components/agency/AgencyImageUpload";

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
    const [agency, setAgency] = useState<any>(null);
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

        // Check if user owns this agency and get agency data
        const { data: agencyData } = await supabase
            .from("agencies")
            .select("*")
            .eq("id", agencyId)
            .single();

        if (agencyData) {
            setAgency(agencyData);

            // Check if user is the owner
            if (agencyData.owner_id === session.user.id) {
                setIsOwner(true);
            } else {
                // Check if user is admin
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("is_admin")
                    .eq("id", session.user.id)
                    .single();

                if (profile?.is_admin) {
                    setIsOwner(true); // Admins have owner-level access
                }
            }
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
        return (
            <div className="space-y-6">
                <UnclaimedAgencyCheck agencyId={agencyId} />
                <ServicesSection agencyId={agencyId} isOwner={false} />
                <ExperiencesSection agencyId={agencyId} isOwner={false} />
            </div>
        );
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

            {/* Image Upload */}
            {agency && (
                <AgencyImageUpload
                    agencyId={agencyId}
                    currentImageUrl={agency.image_url}
                    onImageUpdated={(newUrl) => setAgency({ ...agency, image_url: newUrl })}
                />
            )}

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
