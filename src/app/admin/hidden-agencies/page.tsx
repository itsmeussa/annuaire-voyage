"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Agency } from "@/types";
import { slugify, getCountryName, getCityName } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import data1 from "@/data/agencies-processed.json";
import { ExternalLink, MapPin, Star, Phone, Globe, Eye, EyeOff, ArrowUpDown, Search, X, User, Check, RefreshCw, Lock, LogOut } from "lucide-react";

type SortField = "name" | "city" | "score" | "reviews" | "assignedTo" | "contacted";
type SortOrder = "asc" | "desc";
type AssignedTo = "Aya" | "Zaki" | "Ussa";

// User profiles with passwords
const USER_PROFILES: { name: AssignedTo; password: string; color: string; bgColor: string; borderColor: string }[] = [
  { name: "Aya", password: "aya2024", color: "text-pink-600", bgColor: "bg-pink-500", borderColor: "border-pink-500" },
  { name: "Zaki", password: "zaki2024", color: "text-blue-600", bgColor: "bg-blue-500", borderColor: "border-blue-500" },
  { name: "Ussa", password: "ussa2024", color: "text-orange-600", bgColor: "bg-orange-500", borderColor: "border-orange-500" },
];

interface ContactedAgency {
  id: string;
  contacted: boolean;
  contactedBy: string;
  contactedAt: string;
}

interface TriedAgency {
  id: string;
  tried: boolean;
  triedBy: string;
  triedAt: string;
}

// Get ALL Moroccan agencies (hidden ones)
function getAllMoroccanAgencies(): Agency[] {
  const rawData = data1 as Array<{
    title: string;
    totalScore: number | null;
    reviewsCount: number | null;
    street: string | null;
    city: string | null;
    state: string | null;
    countryCode: string | null;
    website?: string | null;
    phone: string | null;
    categoryName: string | null;
    url: string;
  }>;

  const agencies: Agency[] = rawData
    .filter((item) => item.title && item.countryCode === "MA")
    .map((item, index) => {
      const cityNormalized = getCityName(item.city);
      const country = getCountryName(item.countryCode);
      const slug = slugify(item.title) || `agency-${index}`;

      return {
        id: `agency-ma-${index}`,
        title: item.title,
        slug,
        totalScore: item.totalScore,
        reviewsCount: item.reviewsCount,
        street: item.street,
        city: item.city,
        cityNormalized,
        state: item.state,
        countryCode: item.countryCode,
        country,
        website: item.website || null,
        phone: item.phone,
        categoryName: item.categoryName,
        category: item.categoryName || "Travel Agency",
        url: item.url,
        featured: false,
        location: null,
        description: "",
      } as Agency;
    });

  return agencies;
}

function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");
  // If it starts with 0, replace with Morocco code
  if (cleaned.startsWith("0")) {
    cleaned = "+212" + cleaned.substring(1);
  }
  // If no + at start, add it
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }
  return cleaned.replace("+", "");
}

export default function HiddenAgenciesPage() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<AssignedTo | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<AssignedTo>("Aya");

  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("");
  const [minScore, setMinScore] = useState<string>("");
  const [minReviews, setMinReviews] = useState<string>("");
  const [assignedFilter, setAssignedFilter] = useState<"all" | "Aya" | "Zaki" | "Ussa">("all");
  const [contactedAgencies, setContactedAgencies] = useState<Record<string, ContactedAgency>>({});
  const [contactedFilter, setContactedFilter] = useState<"all" | "contacted" | "not-contacted">("all");
  const [websiteFilter, setWebsiteFilter] = useState<"all" | "with" | "without">("all");
  const [phoneFilter, setPhoneFilter] = useState<"all" | "with" | "without">("all");
  const [whatsappFilter, setWhatsappFilter] = useState<"all" | "with" | "without">("all");
  const [triedAgencies, setTriedAgencies] = useState<Record<string, TriedAgency>>({});
  const [triedFilter, setTriedFilter] = useState<"all" | "tried" | "not-tried">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("admin-user");
    if (savedUser && ["Aya", "Zaki", "Ussa"].includes(savedUser)) {
      setCurrentUser(savedUser as AssignedTo);
    }
  }, []);

  // Get current user profile
  const currentUserProfile = useMemo(() => {
    return USER_PROFILES.find(p => p.name === currentUser);
  }, [currentUser]);

  // Login handler
  const handleLogin = () => {
    const profile = USER_PROFILES.find(p => p.name === selectedProfile);
    if (profile && passwordInput === profile.password) {
      setCurrentUser(selectedProfile);
      localStorage.setItem("admin-user", selectedProfile);
      setLoginError("");
      setPasswordInput("");
    } else {
      setLoginError("Mot de passe incorrect");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("admin-user");
  };

  // Load contacted agencies from Supabase
  const loadContactedAgencies = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('contacted_agencies')
        .select('*');
      
      if (error) throw error;
      
      const contactedMap: Record<string, ContactedAgency> = {};
      data?.forEach((record) => {
        contactedMap[record.agency_id] = {
          id: record.agency_id,
          contacted: record.contacted,
          contactedBy: record.contacted_by,
          contactedAt: record.contacted_at,
        };
      });
      setContactedAgencies(contactedMap);
    } catch (error) {
      console.error("Error loading contacted agencies:", error);
    }
  }, []);

  // Load tried agencies from Supabase
  const loadTriedAgencies = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tried_agencies')
        .select('*');
      
      if (error) throw error;
      
      const triedMap: Record<string, TriedAgency> = {};
      data?.forEach((record) => {
        triedMap[record.agency_id] = {
          id: record.agency_id,
          tried: record.tried,
          triedBy: record.tried_by,
          triedAt: record.tried_at,
        };
      });
      setTriedAgencies(triedMap);
    } catch (error) {
      console.error("Error loading tried agencies:", error);
    }
  }, []);

  // Refresh data from Supabase
  const refreshData = async () => {
    setIsSyncing(true);
    await Promise.all([loadContactedAgencies(), loadTriedAgencies()]);
    setIsSyncing(false);
  };

  useEffect(() => {
    const init = async () => {
      setAgencies(getAllMoroccanAgencies());
      await Promise.all([loadContactedAgencies(), loadTriedAgencies()]);
      setIsLoading(false);
    };
    init();

    // Subscribe to real-time changes
    const contactedSubscription = supabase
      .channel('contacted_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacted_agencies' }, () => {
        loadContactedAgencies();
      })
      .subscribe();

    const triedSubscription = supabase
      .channel('tried_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tried_agencies' }, () => {
        loadTriedAgencies();
      })
      .subscribe();

    return () => {
      contactedSubscription.unsubscribe();
      triedSubscription.unsubscribe();
    };
  }, [loadContactedAgencies, loadTriedAgencies]);

  // Toggle contacted status
  const toggleContacted = async (agencyId: string) => {
    if (!currentUser) return;
    const isCurrentlyContacted = !!contactedAgencies[agencyId]?.contacted;
    
    try {
      if (!isCurrentlyContacted) {
        // Insert new record
        const { error } = await supabase
          .from('contacted_agencies')
          .upsert({
            agency_id: agencyId,
            contacted: true,
            contacted_by: currentUser,
            contacted_at: new Date().toISOString(),
          });
        
        if (error) throw error;
        
        setContactedAgencies(prev => ({
          ...prev,
          [agencyId]: {
            id: agencyId,
            contacted: true,
            contactedBy: currentUser,
            contactedAt: new Date().toISOString(),
          }
        }));
      } else {
        // Delete record
        const { error } = await supabase
          .from('contacted_agencies')
          .delete()
          .eq('agency_id', agencyId);
        
        if (error) throw error;
        
        setContactedAgencies(prev => {
          const newData = { ...prev };
          delete newData[agencyId];
          return newData;
        });
      }
    } catch (error) {
      console.error("Error toggling contacted status:", error);
    }
  };

  // Toggle tried status
  const toggleTried = async (agencyId: string) => {
    if (!currentUser) return;
    const isCurrentlyTried = !!triedAgencies[agencyId]?.tried;
    
    try {
      if (!isCurrentlyTried) {
        // Insert new record
        const { error } = await supabase
          .from('tried_agencies')
          .upsert({
            agency_id: agencyId,
            tried: true,
            tried_by: currentUser,
            tried_at: new Date().toISOString(),
          });
        
        if (error) throw error;
        
        setTriedAgencies(prev => ({
          ...prev,
          [agencyId]: {
            id: agencyId,
            tried: true,
            triedBy: currentUser,
            triedAt: new Date().toISOString(),
          }
        }));
      } else {
        // Delete record
        const { error } = await supabase
          .from('tried_agencies')
          .delete()
          .eq('agency_id', agencyId);
        
        if (error) throw error;
        
        setTriedAgencies(prev => {
          const newData = { ...prev };
          delete newData[agencyId];
          return newData;
        });
      }
    } catch (error) {
      console.error("Error toggling tried status:", error);
    }
  };

  // Get unique cities for filter
  const uniqueCities = useMemo(() => {
    const cities = agencies.map((a) => a.cityNormalized).filter(Boolean);
    return Array.from(new Set(cities)).sort();
  }, [agencies]);

  // Sort agencies by score and reviews to determine top 5
  const sortedByRank = useMemo(() => {
    return [...agencies].sort((a, b) => {
      const scoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [agencies]);

  const visibleIds = useMemo(() => {
    return new Set(sortedByRank.slice(0, 5).map((a) => a.id));
  }, [sortedByRank]);

  // Assign hidden agencies to Zaki (first half) and Ussa (second half)
  const hiddenAgencies = useMemo(() => {
    return sortedByRank.filter((a) => !visibleIds.has(a.id));
  }, [sortedByRank, visibleIds]);

  const getAssignedTo = (agencyId: string): AssignedTo => {
    const index = hiddenAgencies.findIndex((a) => a.id === agencyId);
    if (index === -1) return "Aya"; // visible agencies default to Aya
    const quarterPoint = Math.ceil(hiddenAgencies.length / 4);
    const halfPoint = Math.ceil(hiddenAgencies.length / 2);
    if (index < quarterPoint) return "Aya";
    if (index < halfPoint) return "Zaki";
    return "Ussa";
  };

  // Filter and sort agencies
  const filteredAgencies = useMemo(() => {
    let result = [...agencies];

    // Status filter
    if (filter === "visible") {
      result = result.filter((a) => visibleIds.has(a.id));
    } else if (filter === "hidden") {
      result = result.filter((a) => !visibleIds.has(a.id));
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.cityNormalized?.toLowerCase().includes(term) ||
          a.phone?.includes(term)
      );
    }

    // City filter
    if (cityFilter) {
      result = result.filter((a) => a.cityNormalized === cityFilter);
    }

    // Min score filter
    if (minScore) {
      const min = parseFloat(minScore);
      result = result.filter((a) => (a.totalScore || 0) >= min);
    }

    // Min reviews filter
    if (minReviews) {
      const min = parseInt(minReviews);
      result = result.filter((a) => (a.reviewsCount || 0) >= min);
    }

    // Assigned to filter
    if (assignedFilter !== "all") {
      result = result.filter((a) => getAssignedTo(a.id) === assignedFilter);
    }

    // Contacted filter
    if (contactedFilter === "contacted") {
      result = result.filter((a) => contactedAgencies[a.id]?.contacted);
    } else if (contactedFilter === "not-contacted") {
      result = result.filter((a) => !contactedAgencies[a.id]?.contacted);
    }

    // Website filter
    if (websiteFilter === "with") {
      result = result.filter((a) => a.website && a.website.trim() !== "");
    } else if (websiteFilter === "without") {
      result = result.filter((a) => !a.website || a.website.trim() === "");
    }

    // Phone filter
    if (phoneFilter === "with") {
      result = result.filter((a) => a.phone && a.phone.trim() !== "");
    } else if (phoneFilter === "without") {
      result = result.filter((a) => !a.phone || a.phone.trim() === "");
    }

    // WhatsApp filter (check if phone starts with common WhatsApp-compatible formats)
    if (whatsappFilter === "with") {
      result = result.filter((a) => a.phone && a.phone.trim() !== "");
    } else if (whatsappFilter === "without") {
      result = result.filter((a) => !a.phone || a.phone.trim() === "");
    }

    // Tried filter (for agencies without WhatsApp that were attempted)
    if (triedFilter === "tried") {
      result = result.filter((a) => triedAgencies[a.id]?.tried);
    } else if (triedFilter === "not-tried") {
      result = result.filter((a) => !triedAgencies[a.id]?.tried);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.title.localeCompare(b.title);
          break;
        case "city":
          comparison = (a.cityNormalized || "").localeCompare(b.cityNormalized || "");
          break;
        case "score":
          comparison = (a.totalScore || 0) - (b.totalScore || 0);
          break;
        case "reviews":
          comparison = (a.reviewsCount || 0) - (b.reviewsCount || 0);
          break;
        case "assignedTo":
          comparison = getAssignedTo(a.id).localeCompare(getAssignedTo(b.id));
          break;
        case "contacted":
          const aContacted = contactedAgencies[a.id]?.contacted ? 1 : 0;
          const bContacted = contactedAgencies[b.id]?.contacted ? 1 : 0;
          comparison = aContacted - bContacted;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [agencies, filter, searchTerm, cityFilter, minScore, minReviews, assignedFilter, contactedFilter, websiteFilter, phoneFilter, whatsappFilter, triedFilter, sortField, sortOrder, visibleIds, hiddenAgencies, contactedAgencies, triedAgencies]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCityFilter("");
    setMinScore("");
    setMinReviews("");
    setFilter("all");
    setAssignedFilter("all");
    setContactedFilter("all");
    setWebsiteFilter("all");
    setPhoneFilter("all");
    setWhatsappFilter("all");
    setTriedFilter("all");
  };

  const visibleCount = 5;
  const hiddenCount = agencies.length - visibleCount;
  const quarterPoint = Math.ceil(hiddenAgencies.length / 4);
  const halfPoint = Math.ceil(hiddenAgencies.length / 2);
  const ayaCount = quarterPoint;
  const zakiCount = halfPoint - quarterPoint;
  const ussaCount = hiddenAgencies.length - halfPoint;
  const contactedCount = Object.values(contactedAgencies).filter(c => c.contacted).length;
  const notContactedCount = agencies.length - contactedCount;
  const triedCount = Object.values(triedAgencies).filter(t => t.tried).length;

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 text-sm font-medium ${
        sortField === field ? "text-emerald-600" : "text-slate-600"
      }`}
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-emerald-600" : "text-slate-400"}`} />
    </button>
  );

  // Login Page
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
            <p className="text-slate-500 mt-2">Connectez-vous pour accéder au tableau de bord</p>
          </div>

          <div className="space-y-4">
            {/* Profile Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Choisir le profil</label>
              <div className="grid grid-cols-3 gap-2">
                {USER_PROFILES.map((profile) => (
                  <button
                    type="button"
                    key={profile.name}
                    onClick={() => setSelectedProfile(profile.name)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      selectedProfile === profile.name
                        ? `${profile.bgColor} text-white shadow-lg scale-105`
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {profile.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Agences Marocaines - Admin View</h1>
              <p className="text-slate-400">
                Total: {agencies.length} agences | Visibles: {visibleCount} | Cachées: {hiddenCount}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Current User Badge */}
              <div className={`flex items-center gap-2 px-4 py-2 ${currentUserProfile?.bgColor} rounded-lg`}>
                <User className="w-4 h-4" />
                <span className="font-medium">{currentUser}</span>
              </div>
              {/* Refresh Button */}
              <button
                onClick={refreshData}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sync...' : 'Rafraîchir'}
              </button>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-3 text-slate-600">Chargement des données...</span>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, ville, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* City filter */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Toutes les villes</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Min score */}
            <input
              type="number"
              placeholder="Note min (ex: 4)"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              step="0.1"
              min="0"
              max="5"
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Min reviews */}
            <input
              type="number"
              placeholder="Avis min (ex: 10)"
              value={minReviews}
              onChange={(e) => setMinReviews(e.target.value)}
              min="0"
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status filters and clear */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Toutes ({agencies.length})
            </button>
            <button
              onClick={() => setFilter("visible")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                filter === "visible"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Eye className="w-3 h-3" />
              Visibles ({visibleCount})
            </button>
            <button
              onClick={() => setFilter("hidden")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                filter === "hidden"
                  ? "bg-red-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <EyeOff className="w-3 h-3" />
              Cachées ({hiddenCount})
            </button>

            <div className="w-px h-6 bg-slate-300 mx-2"></div>

            <button
              onClick={() => setAssignedFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                assignedFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setAssignedFilter("Aya")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                assignedFilter === "Aya"
                  ? "bg-pink-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <User className="w-3 h-3" />
              Aya ({ayaCount})
            </button>
            <button
              onClick={() => setAssignedFilter("Zaki")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                assignedFilter === "Zaki"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <User className="w-3 h-3" />
              Zaki ({zakiCount})
            </button>
            <button
              onClick={() => setAssignedFilter("Ussa")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                assignedFilter === "Ussa"
                  ? "bg-orange-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <User className="w-3 h-3" />
              Ussa ({ussaCount})
            </button>

            <div className="w-px h-6 bg-slate-300 mx-2"></div>

            <button
              onClick={() => setContactedFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                contactedFilter === "all"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Tous contacts
            </button>
            <button
              onClick={() => setContactedFilter("contacted")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                contactedFilter === "contacted"
                  ? "bg-green-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Check className="w-3 h-3" />
              Contactés ({contactedCount})
            </button>
            <button
              onClick={() => setContactedFilter("not-contacted")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                contactedFilter === "not-contacted"
                  ? "bg-gray-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Non contactés ({notContactedCount})
            </button>
            <div className="w-px h-6 bg-slate-300 mx-2"></div>

            {/* Website filter */}
            <select
              value={websiteFilter}
              onChange={(e) => setWebsiteFilter(e.target.value as "all" | "with" | "without")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                websiteFilter !== "all"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <option value="all">🌐 Website: Tous</option>
              <option value="with">🌐 Avec site</option>
              <option value="without">🌐 Sans site</option>
            </select>

            {/* Phone filter */}
            <select
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value as "all" | "with" | "without")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                phoneFilter !== "all"
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <option value="all">📞 Téléphone: Tous</option>
              <option value="with">📞 Avec tél</option>
              <option value="without">📞 Sans tél</option>
            </select>

            {/* WhatsApp filter */}
            <select
              value={whatsappFilter}
              onChange={(e) => setWhatsappFilter(e.target.value as "all" | "with" | "without")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                whatsappFilter !== "all"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <option value="all">💬 WhatsApp: Tous</option>
              <option value="with">💬 Avec WhatsApp</option>
              <option value="without">💬 Sans WhatsApp</option>
            </select>

            {/* Tried filter (for agencies without WhatsApp) */}
            <select
              value={triedFilter}
              onChange={(e) => setTriedFilter(e.target.value as "all" | "tried" | "not-tried")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                triedFilter !== "all"
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <option value="all">🔄 Essayé: Tous</option>
              <option value="tried">🔄 Essayé ({triedCount})</option>
              <option value="not-tried">🔄 Pas essayé</option>
            </select>
            {(searchTerm || cityFilter || minScore || minReviews || filter !== "all" || assignedFilter !== "all" || contactedFilter !== "all" || websiteFilter !== "all" || phoneFilter !== "all" || whatsappFilter !== "all" || triedFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="ml-auto px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Effacer filtres
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-slate-500">
          {filteredAgencies.length} résultat{filteredAgencies.length > 1 ? "s" : ""}
        </div>

        {/* Agencies List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">#</th>
                  <th className="px-4 py-3 text-left">
                    <SortButton field="contacted" label="Contacté" />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Statut</th>
                  <th className="px-4 py-3 text-left">
                    <SortButton field="assignedTo" label="Assigné" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortButton field="name" label="Agence" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortButton field="city" label="Ville" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortButton field="score" label="Note" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortButton field="reviews" label="Avis" />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">WhatsApp</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Essayé</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAgencies.map((agency, index) => {
                  const isVisible = visibleIds.has(agency.id);
                  const originalRank = sortedByRank.findIndex((a) => a.id === agency.id) + 1;
                  const assignedTo = getAssignedTo(agency.id);
                  const personName = currentUser === "Aya" ? "Aya" : currentUser === "Zaki" ? "Zakaria" : "Oussama";
                  
                  // Get the profile of who contacted/tried this agency
                  const contactedByProfile = USER_PROFILES.find(p => p.name === contactedAgencies[agency.id]?.contactedBy);
                  const triedByProfile = USER_PROFILES.find(p => p.name === triedAgencies[agency.id]?.triedBy);

                  return (
                    <tr
                      key={agency.id}
                      className={`hover:bg-slate-50 ${!isVisible ? "bg-red-50/30" : ""}`}
                    >
                      <td className="px-4 py-3 text-sm text-slate-500">{originalRank}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleContacted(agency.id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110 ${
                            contactedAgencies[agency.id]?.contacted
                              ? `${contactedByProfile?.bgColor || 'bg-green-500'} ${contactedByProfile?.borderColor || 'border-green-500'} text-white`
                              : `${currentUserProfile?.borderColor?.replace('border-', 'border-') || 'border-slate-300'} hover:${currentUserProfile?.borderColor || 'border-slate-500'}`
                          }`}
                          title={contactedAgencies[agency.id]?.contacted 
                            ? `Contacté par ${contactedAgencies[agency.id]?.contactedBy} le ${new Date(contactedAgencies[agency.id]?.contactedAt).toLocaleDateString()}`
                            : "Marquer comme contacté"
                          }
                        >
                          {contactedAgencies[agency.id]?.contacted && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {isVisible ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                            <Eye className="w-3 h-3" />
                            Visible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <EyeOff className="w-3 h-3" />
                            Caché
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          assignedTo === "Aya" 
                            ? "bg-pink-100 text-pink-700" 
                            : assignedTo === "Zaki" 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          <User className="w-3 h-3" />
                          {assignedTo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{agency.title}</div>
                        <div className="text-xs text-slate-500">{agency.category}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          {agency.cityNormalized}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {agency.totalScore ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{agency.totalScore}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {agency.reviewsCount || 0}
                      </td>
                      <td className="px-4 py-3">
                        {agency.phone ? (
                          <a
                            href={`https://wa.me/${formatPhoneForWhatsApp(agency.phone)}?text=${encodeURIComponent(
                              `Salam، m3ak ${personName}.\nCheft khdma dyalk f ${agency.title} saraha tbarklah 3lik.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            WhatsApp
                          </a>
                        ) : (
                          <span className="text-slate-400 text-sm">Pas de tél</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {/* Tried checkbox - for agencies that don't respond on WhatsApp */}
                        <button
                          onClick={() => toggleTried(agency.id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110 ${
                            triedAgencies[agency.id]?.tried
                              ? `${triedByProfile?.bgColor || 'bg-amber-500'} ${triedByProfile?.borderColor || 'border-amber-500'} text-white`
                              : `${currentUserProfile?.borderColor?.replace('border-', 'border-') || 'border-amber-300'} hover:${currentUserProfile?.borderColor || 'border-amber-500'}`
                          }`}
                          title={triedAgencies[agency.id]?.tried 
                            ? `Essayé par ${triedAgencies[agency.id]?.triedBy} le ${new Date(triedAgencies[agency.id]?.triedAt).toLocaleDateString()}`
                            : "Marquer comme essayé (pas de réponse WhatsApp)"
                          }
                        >
                          {triedAgencies[agency.id]?.tried && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {agency.website && (
                            <a
                              href={agency.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-emerald-600"
                              title="Site web"
                            >
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                          <a
                            href={agency.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                          >
                            Maps
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-white rounded-xl">
          <h2 className="font-semibold text-slate-900 mb-4">Résumé</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{agencies.length}</div>
              <div className="text-sm text-slate-500">Total agences marocaines</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{visibleCount}</div>
              <div className="text-sm text-emerald-700">Actuellement visibles</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{hiddenCount}</div>
              <div className="text-sm text-red-700">Actuellement cachées</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-2xl font-bold text-green-600">{contactedCount}</div>
              <div className="text-sm text-green-700">Déjà contactées</div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{ayaCount}</div>
              <div className="text-sm text-pink-700">Assignées à Aya</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{zakiCount}</div>
              <div className="text-sm text-blue-700">Assignées à Zaki</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{ussaCount}</div>
              <div className="text-sm text-orange-700">Assignées à Ussa</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Les agences cachées peuvent payer 500 DH pour être référencées sur la plateforme.
          </p>
        </div>
      </div>
      )}
    </div>
  );
}
