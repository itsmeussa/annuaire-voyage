'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Users, X } from 'lucide-react';
import { PlannerInputs } from '@/lib/ai-planner';

interface PlannerSearchProps {
    onSearch: (inputs: PlannerInputs) => void;
    initialValues?: PlannerInputs;
}

export default function PlannerSearch({ onSearch, initialValues }: PlannerSearchProps) {
    const [startLocation, setStartLocation] = useState(initialValues?.startLocation || 'Paris');
    const [destination, setDestination] = useState(initialValues?.destinationQuery || '');

    // Default dates: Tomorrow -> +7 days
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(tomorrow);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const [startDate, setStartDate] = useState(initialValues?.startDate || tomorrow.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(initialValues?.endDate || nextWeek.toISOString().split('T')[0]);
    const [travelers, setTravelers] = useState(initialValues?.travelers || 2);

    const [showSuggestions, setShowSuggestions] = useState(false);

    const POPULAR_DESTINATIONS = ['Japon', 'Italie', 'Corée du Sud', 'Australie', 'Canada', 'Thaïlande', 'Maroc', 'États-Unis', 'Espagne', 'Brésil', 'Grèce', 'Turquie'];

    const handleSearch = () => {
        // Only Start Location and Dates are strictly required. 
        // Destination can be empty for "Anywhere" logic.
        if (!startLocation || !startDate || !endDate) return;

        onSearch({
            startLocation,
            destinations: [], // Will be resolved by AI if destinationQuery is empty
            destinationQuery: destination,
            startDate,
            endDate,
            travelers,
            interests: []
        });
    };

    const handleSuggestionClick = (city: string) => {
        setDestination(city);
        setShowSuggestions(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto shadow-2xl rounded-full bg-white p-2 flex flex-col md:flex-row items-center border border-gray-100 relative z-20 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">

            {/* From - Required */}
            <div className="relative flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 group">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 group-hover:text-[#FF6B35] transition-colors">From</label>
                <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400 group-hover:text-[#FF6B35] transition-colors" />
                    <input
                        type="text"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        className="w-full font-bold text-gray-900 text-lg outline-none placeholder:text-gray-300 bg-transparent"
                        placeholder="Your location"
                    />
                </div>
            </div>

            {/* To - Optional */}
            <div className="relative flex-[1.5] w-full px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 group">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 group-hover:text-[#FF6B35] transition-colors">To Where?</label>
                <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-gray-400 group-hover:text-[#FF6B35] transition-colors" />
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => {
                            setDestination(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full font-bold text-gray-900 text-lg outline-none placeholder:text-gray-300 bg-transparent"
                        placeholder="Anywhere (Cheapest)"
                    />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (
                    <div className="absolute top-full left-0 w-full bg-white rounded-2xl shadow-xl mt-4 p-4 border border-gray-100 animate-in fade-in slide-in-from-top-2 z-50">
                        <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Popular Destinations</p>
                        <div className="grid grid-cols-2 gap-2">
                            {POPULAR_DESTINATIONS.filter(d => d.toLowerCase().includes(destination.toLowerCase())).slice(0, 8).map(city => (
                                <button
                                    key={city}
                                    onClick={() => handleSuggestionClick(city)}
                                    className="text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Dates */}
            <div className="relative flex-[1.2] w-full px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 group">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 group-hover:text-[#FF6B35] transition-colors">Start</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full font-bold text-gray-900 text-sm outline-none bg-transparent"
                        />
                    </div>
                    <div className="w-px h-8 bg-gray-200 mx-2"></div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 group-hover:text-[#FF6B35] transition-colors">End</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full font-bold text-gray-900 text-sm outline-none bg-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Travelers */}
            <div className="relative w-full md:w-auto px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 group min-w-[100px]">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1 group-hover:text-[#FF6B35] transition-colors">Who</label>
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-400 group-hover:text-[#FF6B35] transition-colors" />
                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={travelers}
                        onChange={(e) => setTravelers(parseInt(e.target.value))}
                        className="w-12 font-bold text-gray-900 text-lg outline-none bg-transparent"
                    />
                </div>
            </div>

            {/* Search Button */}
            <div className="p-2 w-full md:w-auto">
                <button
                    onClick={handleSearch}
                    disabled={!startLocation || !startDate}
                    className={`w-full md:w-auto h-14 md:h-14 px-8 rounded-full font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${!startLocation || !startDate
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-[#FF6B35] hover:bg-[#E85D2A] hover:shadow-xl hover:scale-105'
                        }`}
                >
                    <Search className="h-5 w-5" />
                    <span className="md:hidden">Search Trips</span>
                </button>
            </div>
        </div>
    );
}
