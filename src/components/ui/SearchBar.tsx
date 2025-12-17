"use client";

import { Search, MapPin, Filter } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, city: string) => void;
  cities: string[];
}

export default function SearchBar({ onSearch, cities }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, city);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search travel agencies..."
            className="w-full pl-12 pr-4 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* City Select */}
        <div className="md:w-64 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none bg-white"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
        >
          <Filter className="h-5 w-5" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
