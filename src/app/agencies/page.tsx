"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { Agency } from "@/types";

// Dynamic import for map component (no SSR)
const AgencyMap = dynamic(() => import("@/components/ui/AgencyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-muted rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-muted-foreground">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

function AgenciesContent() {
  const searchParams = useSearchParams();

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
  const [hasWebsiteOnly, setHasWebsiteOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const cities = getUniqueCities();
  const countries = getUniqueCountries();
  const categories = getUniqueCategories();

  useEffect(() => {
    const filtered = filterAgencies(
      query,
      selectedCity,
      selectedCountry,
      selectedRating,
      selectedCategory,
      hasWebsiteOnly
    );
    setAgencies(filtered);
    setCurrentPage(1);
  }, [query, selectedCity, selectedCountry, selectedRating, selectedCategory, hasWebsiteOnly]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCity("");
    setSelectedCountry("");
    setSelectedRating(0);
    setSelectedCategory("");
    setHasWebsiteOnly(false);
  };

  const paginatedAgencies = agencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(agencies.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b border-border py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            Find Travel Agencies
          </h1>
          <p className="text-lg text-muted-foreground mb-6 animate-fade-in-up delay-100">
            Browse our directory of {agencies.length} verified travel agencies
            worldwide.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up delay-200">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by agency name, city, or category..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-muted rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Active Filters */}
          {(selectedCity ||
            selectedCountry ||
            selectedRating > 0 ||
            selectedCategory) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCity && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  City: {selectedCity}
                  <button onClick={() => setSelectedCity("")}>
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {selectedCountry && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Country: {selectedCountry}
                  <button onClick={() => setSelectedCountry("")}>
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {selectedRating > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Rating: {selectedRating}+
                  <button onClick={() => setSelectedRating(0)}>
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("")}>
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
              hasWebsiteOnly={hasWebsiteOnly}
              onCityChange={setSelectedCity}
              onCountryChange={setSelectedCountry}
              onRatingChange={setSelectedRating}
              onCategoryChange={setSelectedCategory}
              onHasWebsiteChange={setHasWebsiteOnly}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <h3 className="font-bold">Filters</h3>
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
                    hasWebsiteOnly={hasWebsiteOnly}
                    onCityChange={setSelectedCity}
                    onCountryChange={setSelectedCountry}
                    onRatingChange={setSelectedRating}
                    onCategoryChange={setSelectedCategory}
                    onHasWebsiteChange={setHasWebsiteOnly}
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
                Showing {paginatedAgencies.length} of {agencies.length} agencies
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid" ? "bg-primary text-white shadow-md" : "bg-muted hover:bg-muted/80"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list" ? "bg-primary text-white shadow-md" : "bg-muted hover:bg-muted/80"
                  }`}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "map" ? "bg-primary text-white shadow-md" : "bg-muted hover:bg-muted/80"
                  }`}
                  aria-label="Map view"
                >
                  <Map className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Map View */}
            {viewMode === "map" && (
              <div className="mb-8 animate-fade-in">
                <AgencyMap agencies={agencies} height="600px" />
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
                  No agencies found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-primary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : null}

            {/* Pagination - only show for grid/list views */}
            {viewMode !== "map" && totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-muted disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg ${
                          currentPage === page
                            ? "bg-primary text-white"
                            : "bg-muted"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-10 h-10 rounded-lg ${
                          currentPage === totalPages
                            ? "bg-primary text-white"
                            : "bg-muted"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-muted disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgenciesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted/30 flex items-center justify-center">Loading...</div>}>
      <AgenciesContent />
    </Suspense>
  );
}
