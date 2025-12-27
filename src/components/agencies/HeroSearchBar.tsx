"use client";

import { Search, MapPin, Globe, Tag, ChevronDown, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface HeroSearchBarProps {
    query: string;
    setQuery: (query: string) => void;
    selectedCountry: string;
    setSelectedCountry: (country: string) => void;
    selectedCity: string;
    setSelectedCity: (city: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    countries: string[];
    cities: string[];
    categories: string[];
    onSearch?: () => void;
}

export default function HeroSearchBar({
    query,
    setQuery,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity,
    selectedCategory,
    setSelectedCategory,
    countries,
    cities,
    categories,
    onSearch
}: HeroSearchBarProps) {
    const [activeTab, setActiveTab] = useState<string | null>(null);

    // Close dropdowns when clicking outside
    const barRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (barRef.current && !barRef.current.contains(event.target as Node)) {
                setActiveTab(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            ref={barRef}
            className="bg-white rounded-3xl md:rounded-full shadow-xl shadow-black/10 flex flex-col md:flex-row items-center p-2 mb-8 max-w-5xl mx-auto divide-y md:divide-y-0 md:divide-x divide-gray-100 animate-fade-in-up delay-200"
        >
            {/* 1. Name / Keyword Section */}
            <div className="flex-1 w-full md:w-auto relative px-6 py-3 md:py-2 transition-colors hover:bg-gray-50 rounded-2xl md:rounded-full group">
                <label className="block text-xs font-bold text-foreground mb-1">
                    Agency
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setActiveTab('query')}
                        placeholder="Search by name..."
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-600 placeholder:text-gray-400 truncate font-medium"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="p-0.5 rounded-full hover:bg-gray-200 text-gray-400"
                        >
                            <span className="sr-only">Clear</span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Country Section */}
            <div className="flex-1 w-full md:w-auto relative px-6 py-3 md:py-2 transition-colors hover:bg-gray-50 rounded-2xl md:rounded-full cursor-pointer" onClick={() => setActiveTab(activeTab === 'country' ? null : 'country')}>
                <label className="block text-xs font-bold text-foreground mb-1">
                    Country
                </label>
                <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate font-medium ${selectedCountry ? 'text-gray-800' : 'text-gray-400'}`}>
                        {selectedCountry || "Select country"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeTab === 'country' ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown */}
                {activeTab === 'country' && (
                    <div className="absolute top-full left-0 w-full md:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 mt-4 p-2 z-50 max-h-64 overflow-y-auto">
                        <div className="space-y-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCountry('');
                                    setActiveTab(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm rounded-xl hover:bg-gray-50 transition-colors ${!selectedCountry ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600'}`}
                            >
                                All Countries
                            </button>
                            {countries.map(country => (
                                <button
                                    key={country}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCountry(country);
                                        setActiveTab(null);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedCountry === country ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600'}`}
                                >
                                    {country}
                                    {selectedCountry === country && <Check className="h-4 w-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. City Section (Only enabled if Country selected?) - Actually let's allow all if no country, but filtered list */}
            <div className="flex-1 w-full md:w-auto relative px-6 py-3 md:py-2 transition-colors hover:bg-gray-50 rounded-2xl md:rounded-full cursor-pointer" onClick={() => setActiveTab(activeTab === 'city' ? null : 'city')}>
                <label className="block text-xs font-bold text-foreground mb-1">
                    City
                </label>
                <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate font-medium ${selectedCity ? 'text-gray-800' : 'text-gray-400'}`}>
                        {selectedCity || "Select city"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeTab === 'city' ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown */}
                {activeTab === 'city' && (
                    <div className="absolute top-full left-0 w-full md:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 mt-4 p-2 z-50 max-h-64 overflow-y-auto">
                        <div className="space-y-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCity('');
                                    setActiveTab(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm rounded-xl hover:bg-gray-50 transition-colors ${!selectedCity ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600'}`}
                            >
                                All Cities
                            </button>
                            {cities.length > 0 ? (
                                cities.map(city => (
                                    <button
                                        key={city}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCity(city);
                                            setActiveTab(null);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedCity === city ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600'}`}
                                    >
                                        {city}
                                        {selectedCity === city && <Check className="h-4 w-4" />}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                    Select a country first
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Category Section */}
            <div className="flex-1 w-full md:w-auto relative px-6 py-3 md:py-2 transition-colors hover:bg-gray-50 rounded-2xl md:rounded-full cursor-pointer" onClick={() => setActiveTab(activeTab === 'category' ? null : 'category')}>
                <label className="block text-xs font-bold text-foreground mb-1">
                    Category
                </label>
                <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate font-medium ${selectedCategory ? 'text-gray-800' : 'text-gray-400'}`}>
                        {selectedCategory || "Select type"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeTab === 'category' ? 'rotate-180' : ''}`} />
                </div>
                {/* Dropdown */}
                {activeTab === 'category' && (
                    <div className="absolute top-full md:right-0 w-full md:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 mt-4 p-2 z-50 max-h-64 overflow-y-auto">
                        <div className="space-y-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCategory('');
                                    setActiveTab(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm rounded-xl hover:bg-gray-50 transition-colors ${!selectedCategory ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600'}`}
                            >
                                All Categories
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCategory(cat);
                                        setActiveTab(null);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600'}`}
                                >
                                    {cat}
                                    {selectedCategory === cat && <Check className="h-4 w-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Search Button */}
            <div className="p-2 w-full md:w-auto">
                <button
                    onClick={onSearch}
                    className="w-full md:w-auto bg-primary text-white rounded-xl md:rounded-full px-8 py-3.5 font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                    <Search className="h-5 w-5" />
                    <span className="md:hidden">Search</span>
                </button>
            </div>
        </div>
    );
}
