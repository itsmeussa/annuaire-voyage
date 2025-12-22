"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Agency } from "@/types";
import { slugify, getCountryName, getCityName } from "@/lib/utils";
import data1 from "@/data/agencies-processed.json";
import { ExternalLink, MapPin, Star, Phone, Globe, Eye, EyeOff, ArrowUpDown, Search, X, User, Check } from "lucide-react";

type SortField = "name" | "city" | "score" | "reviews" | "assignedTo" | "contacted";
type SortOrder = "asc" | "desc";
type AssignedTo = "Aya" | "Zaki" | "Ussa";

interface ContactedAgency {
  id: string;
  contacted: boolean;
  contactedBy: string;
  contactedAt: string;
}

const STORAGE_KEY = "contacted-agencies";

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

  // Load contacted agencies from localStorage
  const loadContactedAgencies = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setContactedAgencies(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading contacted agencies:", error);
    }
  }, []);

  // Save contacted agencies to localStorage
  const saveContactedAgencies = useCallback((data: Record<string, ContactedAgency>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving contacted agencies:", error);
    }
  }, []);

  useEffect(() => {
    setAgencies(getAllMoroccanAgencies());
    loadContactedAgencies();
  }, [loadContactedAgencies]);

  // Toggle contacted status
  const toggleContacted = (agencyId: string, assignedTo: AssignedTo) => {
    const isCurrentlyContacted = !!contactedAgencies[agencyId]?.contacted;
    
    const newData = { ...contactedAgencies };
    
    if (!isCurrentlyContacted) {
      newData[agencyId] = {
        id: agencyId,
        contacted: true,
        contactedBy: assignedTo,
        contactedAt: new Date().toISOString(),
      };
    } else {
      delete newData[agencyId];
    }
    
    setContactedAgencies(newData);
    saveContactedAgencies(newData);
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
  }, [agencies, filter, searchTerm, cityFilter, minScore, minReviews, assignedFilter, contactedFilter, sortField, sortOrder, visibleIds, hiddenAgencies, contactedAgencies]);

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Agences Marocaines - Admin View</h1>
          <p className="text-slate-400">
            Total: {agencies.length} agences | Visibles: {visibleCount} | Cachées: {hiddenCount}
          </p>
        </div>
      </div>

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

            {(searchTerm || cityFilter || minScore || minReviews || filter !== "all" || assignedFilter !== "all" || contactedFilter !== "all") && (
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAgencies.map((agency, index) => {
                  const isVisible = visibleIds.has(agency.id);
                  const originalRank = sortedByRank.findIndex((a) => a.id === agency.id) + 1;
                  const assignedTo = getAssignedTo(agency.id);
                  const personName = assignedTo === "Aya" ? "Aya" : assignedTo === "Zaki" ? "Zakaria" : "Oussama";

                  return (
                    <tr
                      key={agency.id}
                      className={`hover:bg-slate-50 ${!isVisible ? "bg-red-50/30" : ""}`}
                    >
                      <td className="px-4 py-3 text-sm text-slate-500">{originalRank}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleContacted(agency.id, assignedTo)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110 ${
                            contactedAgencies[agency.id]?.contacted
                              ? assignedTo === "Aya"
                                ? "bg-pink-500 border-pink-500 text-white"
                                : assignedTo === "Zaki"
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "bg-orange-500 border-orange-500 text-white"
                              : assignedTo === "Aya"
                              ? "border-pink-300 hover:border-pink-500"
                              : assignedTo === "Zaki"
                              ? "border-blue-300 hover:border-blue-500"
                              : "border-orange-300 hover:border-orange-500"
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
    </div>
  );
}
