"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Copy, Check, User, Mail, Shield, LogOut, Loader2, Edit, Save, X, Phone, Globe, Building, Plus, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [agencies, setAgencies] = useState<any[]>([]);
    const [loadingAgencies, setLoadingAgencies] = useState(true);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: "",
        phone_number: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        website: "",
    });
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/auth/login");
                return;
            }

            setUser(session.user);

            // Fetch profile
            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                setEditForm({
                    full_name: profileData.full_name || "",
                    phone_number: profileData.phone_number || "",
                    facebook: profileData.facebook || "",
                    instagram: profileData.instagram || "",
                    linkedin: profileData.linkedin || "",
                    website: profileData.website || "",
                });
            }

            // Fetch user's agencies
            const { data: agenciesData } = await supabase
                .from('agencies')
                .select('*')
                .eq('owner_id', session.user.id)
                .order('created_at', { ascending: false });

            if (agenciesData) {
                setAgencies(agenciesData);
            }
            setLoadingAgencies(false);
            setLoading(false);
        };

        fetchData();
    }, [router, supabase]);

    const handleCopy = () => {
        if (profile?.referral_code) {
            navigator.clipboard.writeText(profile.referral_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    const handleCreateProfile = async () => {
        if (!user) return;

        setSaving(true);

        // Generate a referral code
        const namePart = (user.user_metadata?.full_name || user.email?.split('@')[0] || 'USER').substring(0, 4).toUpperCase();
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        const referralCode = `${namePart}-${randomPart}`;

        const { data, error } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                full_name: user.user_metadata?.full_name || "",
                referral_code: referralCode,
                referred_by: null,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating profile:", error);
            alert("Failed to create profile. Please try again.");
        } else {
            setProfile(data);
            setEditForm({
                full_name: data.full_name || "",
                phone_number: data.phone_number || "",
                facebook: data.facebook || "",
                instagram: data.instagram || "",
                linkedin: data.linkedin || "",
                website: data.website || "",
            });
        }

        setSaving(false);
    };

    const handleSaveProfile = async () => {
        if (!user || !profile) return;

        setSaving(true);

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: editForm.full_name,
                phone_number: editForm.phone_number,
                facebook: editForm.facebook,
                instagram: editForm.instagram,
                linkedin: editForm.linkedin,
                website: editForm.website,
            })
            .eq('id', user.id);

        if (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } else {
            // Refresh profile data
            const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (updatedProfile) {
                setProfile(updatedProfile);
            }
            setIsEditing(false);
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                        <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                        <p className="text-gray-500 mb-6">
                            It looks like you don't have a profile yet. Click below to create one.
                        </p>
                        <button
                            onClick={handleCreateProfile}
                            disabled={saving}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Profile"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <User className="w-10 h-10" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {profile?.full_name || "Traveler"}
                            </h1>
                            <p className="text-gray-500">{user?.email}</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Verified Account
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                {/* Referral Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none opacity-50"></div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Your Referral Code
                    </h2>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <p className="text-gray-600 text-sm mb-4">
                            Share this code with friends to invite them to TravelAgencies.World.
                            They will need to enter this code during signup.
                        </p>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 font-mono text-lg font-bold text-gray-800 tracking-wider text-center select-all">
                                {profile?.referral_code || "Generating..."}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="bg-primary hover:bg-primary/90 text-white p-3 rounded-lg transition-colors shadow-lg shadow-primary/20 active:scale-95"
                                title="Copy to clipboard"
                            >
                                {copied ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Copy className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {copied && (
                            <p className="text-green-600 text-xs mt-2 text-center animate-in fade-in slide-in-from-top-1">
                                Copied to clipboard!
                            </p>
                        )}
                    </div>
                </div>

                {/* Profile Details Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors px-4 py-2 rounded-lg hover:bg-primary/5"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditForm({
                                            full_name: profile.full_name || "",
                                            phone_number: profile.phone_number || "",
                                            facebook: profile.facebook || "",
                                            instagram: profile.instagram || "",
                                            linkedin: profile.linkedin || "",
                                            website: profile.website || "",
                                        });
                                    }}
                                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save
                                </button>
                            </div>
                        )}
                    </div>

                    {!isEditing ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Full Name</span>
                                <span className="font-medium text-gray-900">{profile?.full_name || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Email Address</span>
                                <span className="font-medium text-gray-900">{user?.email}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Phone Number</span>
                                <span className="font-medium text-gray-900">{profile?.phone_number || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Facebook</span>
                                <span className="font-medium text-gray-900">{profile?.facebook || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Instagram</span>
                                <span className="font-medium text-gray-900">{profile?.instagram || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">LinkedIn</span>
                                <span className="font-medium text-gray-900">{profile?.linkedin || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Website</span>
                                <span className="font-medium text-gray-900">{profile?.website || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-500">Member Since</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(user?.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-gray-500">Referred By</span>
                                <span className="font-medium text-gray-900 font-mono">
                                    {profile?.referred_by || "None"}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.full_name}
                                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={editForm.phone_number}
                                    onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                                    placeholder="+1 234 567 8900"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                                <input
                                    type="text"
                                    value={editForm.facebook}
                                    onChange={(e) => setEditForm({ ...editForm, facebook: e.target.value })}
                                    placeholder="facebook.com/yourprofile"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                <input
                                    type="text"
                                    value={editForm.instagram}
                                    onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                                    placeholder="@yourhandle"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                <input
                                    type="text"
                                    value={editForm.linkedin}
                                    onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                                    placeholder="linkedin.com/in/yourprofile"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input
                                    type="url"
                                    value={editForm.website}
                                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                    placeholder="https://yourwebsite.com"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* My Agencies Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Building className="w-5 h-5 text-primary" />
                            My Agencies
                        </h2>
                        <Link
                            href="/account/add-agency"
                            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Add Agency
                        </Link>
                    </div>

                    {loadingAgencies ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : agencies.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Building className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500 mb-4">No agencies submitted yet</p>
                            <Link
                                href="/account/add-agency"
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add your first agency
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {agencies.map((agency) => (
                                <Link
                                    key={agency.id}
                                    href={`/agencies/${agency.slug}`}
                                    className="block border border-gray-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary transition-colors">
                                                {agency.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {agency.city}, {agency.country_code}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(agency.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${agency.status === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : agency.status === 'rejected'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {agency.status === 'approved' ? '✓ Approved' : agency.status === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
