"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Grid, List, SlidersHorizontal, X, Map, LayoutGrid } from "lucide-react";
import AgencyCard from "@/components/ui/AgencyCard";
import FilterPanel from "@/components/ui/FilterPanel";
import {
  filterAgencies,
  getUniqueCities,
  getUniqueCountries,
  getUniqueCategories,
} from "@/lib/agencies";
import { COUNTRIES } from "@/lib/countries";
import { Agency } from "@/types";
import { useTranslations } from "next-intl";

// Dynamic import for map component (no SSR)
const FastAgencyMap = dynamic(() => import("@/components/ui/FastAgencyMap"), {
  ssr: false,
  loading: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations('Agencies');
    return (
      <div className="h-[600px] bg-muted rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-muted-foreground">{t('loading.map')}</p>
        </div>
      </div>
    )
  },
});

function AgenciesContent() {
  const t = useTranslations('Agencies');
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || ""
  );
  const [selectedCountry, setSelectedCountry] = useState(
    searchParams.get("country") || ""
  );
  const [selectedRating, setSelectedRating] = useState(
    Number(searchParams.get("rating")) || 0
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [websiteFilter, setWebsiteFilter] = useState<'all' | 'with' | 'without'>(
    (searchParams.get("website") as 'all' | 'with' | 'without') || 'all'
  );
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const itemsPerPage = 24;

  // ... inside AgenciesContent
  const [cities, setCities] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch countries and categories on mount
  useEffect(() => {
    Promise.all([
      getUniqueCountries(),
      getUniqueCategories()
    ]).then(([co, ca]) => {
      // Map codes to names if they are codes
      const mappedCountries = co.map(c => {
        const found = COUNTRIES.find(country => country.code === c || country.name === c);
        return found ? found.name : c;
      });
      setCountries(Array.from(new Set(mappedCountries)).sort());
      setCategories(ca);
    });
  }, []);

  // Fetch cities whenever selectedCountry changes
  useEffect(() => {
    getUniqueCities(selectedCountry).then(setCities);
  }, [selectedCountry]);

  // Update URL ... (same as before)

  useEffect(() => {
    const fetchAgencies = async () => {
      const { agencies: filtered, total } = await filterAgencies(
        query,
        selectedCity,
        selectedCountry,
        selectedRating,
        selectedCategory,
        websiteFilter,
        currentPage,
        itemsPerPage
      );
      setAgencies(filtered);
      setTotalItems(total);
    };
    fetchAgencies();
  }, [query, selectedCity, selectedCountry, selectedRating, selectedCategory, websiteFilter, currentPage]);

  // Scroll to top ... (same)

  const clearFilters = () => {
    // ... same
    setQuery("");
    setSelectedCity("");
    setSelectedCountry("");
    setSelectedRating(0);
    setSelectedCategory("");
    setWebsiteFilter('all');
    setCurrentPage(1);
  };

  // No more local slicing since we fetch paginated data
  const paginatedAgencies = agencies;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-blue-600 to-primary text-white py-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            {t('title')}
          </h1>
          <p className="text-lg text-white/80 mb-6 animate-fade-in-up delay-100">
            {t('subtitle', { count: totalItems })}
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up delay-200">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all text-white placeholder:text-white/60 backdrop-blur-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <SlidersHorizontal className="h-5 w-5" />
              {t('search.filters')}
            </button>
          </div>

          {/* Active Filters */}
          {(selectedCity ||
            selectedCountry ||
            selectedRating > 0 ||
            selectedCategory) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCity && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm border border-white/20">
                    {t('filters.selectedCity', { city: selectedCity })}
                    <button onClick={() => setSelectedCity("")} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {selectedCountry && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm border border-white/20">
                    {t('filters.selectedCountry', { country: selectedCountry })}
                    <button onClick={() => setSelectedCountry("")} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {selectedRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm border border-white/20">
                    {t('filters.selectedRating', { rating: selectedRating })}
                    <button onClick={() => setSelectedRating(0)} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm border border-white/20">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("")} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterPanel
              cities={cities}
              countries={countries}
              categories={categories}
              selectedCity={selectedCity}
              selectedCountry={selectedCountry}
              selectedRating={selectedRating}
              selectedCategory={selectedCategory}
              websiteFilter={websiteFilter}
              onCityChange={setSelectedCity}
              onCountryChange={(country) => {
                setSelectedCountry(country);
                setSelectedCity(""); // Reset city when country changes
                setCurrentPage(1);
              }}
              onRatingChange={setSelectedRating}
              onCategoryChange={setSelectedCategory}
              onWebsiteFilterChange={setWebsiteFilter}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <h3 className="font-bold">{t('filters.title')}</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterPanel
                    cities={cities}
                    countries={countries}
                    categories={categories}
                    selectedCity={selectedCity}
                    selectedCountry={selectedCountry}
                    selectedRating={selectedRating}
                    selectedCategory={selectedCategory}
                    websiteFilter={websiteFilter}
                    onCityChange={setSelectedCity}
                    onCountryChange={(country) => {
                      setSelectedCountry(country);
                      setSelectedCity(""); // Reset city when country changes
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    onRatingChange={setSelectedRating}
                    onCategoryChange={setSelectedCategory}
                    onWebsiteFilterChange={setWebsiteFilter}
                    onClearFilters={clearFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {t('filters.showing', {
                  start: Math.min((currentPage - 1) * itemsPerPage + 1, totalItems),
                  end: Math.min(currentPage * itemsPerPage, totalItems),
                  total: totalItems
                })}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-md" : "bg-muted hover:bg-muted/80"
                    }`}
                  aria-label={t('view.grid')}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white shadow-md" : "bg-muted hover:bg-muted/80"
                    }`}
                  aria-label={t('view.list')}
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "map" ? "bg-primary text-white shadow-md" : "bg-muted hover:bg-muted/80"
                    }`}
                  aria-label={t('view.map')}
                >
                  <Map className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Map View */}
            {viewMode === "map" && (
              <div className="mb-8 animate-fade-in">
                <FastAgencyMap agencies={agencies} height="600px" maxMarkers={100} maxSearchResults={100} />
              </div>
            )}

            {/* Agency Grid/List */}
            {viewMode !== "map" && paginatedAgencies.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children"
                    : "space-y-4 stagger-children"
                }
              >
                {paginatedAgencies.map((agency, index) => (
                  <div key={agency.id} className="hover-lift" style={{ animationDelay: `${index * 0.05}s` }}>
                    <AgencyCard
                      agency={agency}
                      featured={agency.featured}
                    />
                  </div>
                ))}
              </div>
            ) : viewMode !== "map" ? (
              <div className="text-center py-12 animate-fade-in">
                <p className="text-lg text-muted-foreground mb-4">
                  {t('filters.empty')}
                </p>
                <button
                  onClick={clearFilters}
                  className="text-primary font-medium hover:underline"
                >
                  {t('filters.clear')}
                </button>
              </div>
            ) : null}

            {/* Pagination - only show for grid/list views */}
            {viewMode !== "map" && totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-8">
                {/* Page input for quick navigation */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{t('pagination.goTo')}</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= totalPages) {
                        setCurrentPage(val);
                      }
                    }}
                    className="w-16 px-2 py-1 border border-border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <span>{t('pagination.of', { total: totalPages })}</span>
                </div>

                {/* Pagination buttons */}
                <div className="flex justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg bg-muted disabled:opacity-50 text-sm"
                  >
                    {t('pagination.first')}
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-muted disabled:opacity-50"
                  >
                    {t('pagination.prev')}
                  </button>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages: (number | string)[] = [];
                      const showEllipsisStart = currentPage > 3;
                      const showEllipsisEnd = currentPage < totalPages - 2;

                      // Always show first page
                      pages.push(1);

                      if (showEllipsisStart) {
                        pages.push('...');
                      }

                      // Show pages around current page
                      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                        if (!pages.includes(i)) {
                          pages.push(i);
                        }
                      }

                      if (showEllipsisEnd) {
                        pages.push('...');
                      }

                      // Always show last page
                      if (totalPages > 1 && !pages.includes(totalPages)) {
                        pages.push(totalPages);
                      }

                      return pages.map((page, idx) => {
                        if (page === '...') {
                          return <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">...</span>;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className={`w-10 h-10 rounded-lg transition-all ${currentPage === page
                              ? "bg-primary text-white shadow-md"
                              : "bg-muted hover:bg-muted/80"
                              }`}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-muted disabled:opacity-50"
                  >
                    {t('pagination.next')}
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg bg-muted disabled:opacity-50 text-sm"
                  >
                    {t('pagination.last')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgenciesPage() {
  const t = useTranslations('Agencies');
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted/30 flex items-center justify-center">{t('loading.page')}</div>}>
      <AgenciesContent />
    </Suspense>
  );
}
