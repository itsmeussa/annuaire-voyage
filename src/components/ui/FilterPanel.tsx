"use client";

import { Star, MapPin, Tag, X, Globe } from "lucide-react";

interface FilterPanelProps {
  cities: string[];
  countries: string[];
  categories: string[];
  selectedCity: string;
  selectedCountry: string;
  selectedRating: number;
  selectedCategory: string;
  websiteFilter: 'all' | 'with' | 'without';
  onCityChange: (city: string) => void;
  onCountryChange: (country: string) => void;
  onRatingChange: (rating: number) => void;
  onCategoryChange: (category: string) => void;
  onWebsiteFilterChange: (filter: 'all' | 'with' | 'without') => void;
  onClearFilters: () => void;
}

export default function FilterPanel({
  cities,
  countries,
  categories,
  selectedCity,
  selectedCountry,
  selectedRating,
  selectedCategory,
  websiteFilter,
  onCityChange,
  onCountryChange,
  onRatingChange,
  onCategoryChange,
  onWebsiteFilterChange,
  onClearFilters,
}: FilterPanelProps) {
  const hasActiveFilters =
    selectedCity || selectedCountry || selectedRating > 0 || selectedCategory || websiteFilter !== 'all';

  return (
    <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Country Filter */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          Country
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          City
        </label>
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Tag className="h-4 w-4 text-primary" />
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Star className="h-4 w-4 text-primary" />
          Minimum Rating
        </label>
        <div className="space-y-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                selectedRating === rating
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {rating === 0 ? (
                <span>All Ratings</span>
              ) : (
                <>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span>{rating}+</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Has Website Filter */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Globe className="h-4 w-4 text-primary" />
          Website Availability
        </label>
        <div className="space-y-2">
          {[
            { value: 'all' as const, label: 'All Agencies' },
            { value: 'with' as const, label: 'Has Website' },
            { value: 'without' as const, label: 'No Website' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onWebsiteFilterChange(option.value)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all ${
                websiteFilter === option.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span>{option.label}</span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  websiteFilter === option.value
                    ? "bg-primary border-primary"
                    : "border-gray-300"
                }`}
              >
                {websiteFilter === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={onClearFilters}
        className="w-full bg-muted text-foreground py-3 rounded-lg font-medium hover:bg-muted/80 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}
