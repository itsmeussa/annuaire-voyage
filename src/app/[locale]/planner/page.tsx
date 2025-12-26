'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import PlannerSearch from '@/components/planner/PlannerSearch';
import TripCard from '@/components/planner/TripCard';
import ItineraryView from '@/components/planner/ItineraryView';
import { getRealItineraries } from '@/actions/planner';
import { PlannerInputs, TripItinerary } from '@/lib/ai-planner';
import { Sparkles, Map, ArrowLeft } from 'lucide-react';

// Force dynamic since we'll have interactive state
export const dynamic = 'force-dynamic';

export default function PlannerPage() {
    const t = useTranslations('Common');

    // States: 'idle' | 'searching' | 'results' | 'detail'
    const [viewState, setViewState] = useState<'idle' | 'searching' | 'results' | 'detail'>('idle');
    const [trips, setTrips] = useState<TripItinerary[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<TripItinerary | null>(null);
    const [lastInputs, setLastInputs] = useState<PlannerInputs | undefined>(undefined);

    const handleSearch = async (inputs: PlannerInputs) => {
        setViewState('searching');
        setLastInputs(inputs);

        // Call Server Action for Real Data
        try {
            const results = await getRealItineraries(inputs);
            setTrips(results);
            setViewState('results');
        } catch (error) {
            console.error("Search failed:", error);
            // Fallback could be implemented here, but for now we expect it to work (mocks are fallback inside action)
            setViewState('idle');
        }
    };

    const handleSelectTrip = (trip: TripItinerary) => {
        setSelectedTrip(trip);
        setViewState('detail');
    };

    const handleBackToResults = () => {
        setSelectedTrip(null);
        setViewState('results');
    };

    return (
        <div className="min-h-screen bg-white">

            {/* Search Header (Always visible unless in idle, then it's in Hero) */}
            {viewState !== 'idle' && (
                <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 shadow-sm animate-fade-in-down">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto flex items-center gap-4">
                            {viewState === 'detail' && (
                                <button onClick={handleBackToResults} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                                </button>
                            )}
                            <div className="flex-1 transform scale-90 origin-left">
                                <PlannerSearch onSearch={handleSearch} initialValues={lastInputs} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero / Idle State */}
            {viewState === 'idle' && (
                <div className="relative pt-32 pb-40 px-4">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-[2px]" />
                    </div>

                    <div className="container mx-auto relative z-10 text-center animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                            Travel smarter, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF9F1C]">not harder.</span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
                            AI-powered multi-city trips generated in seconds.
                            We optimize routes, hotels, and activities so you don't have to.
                        </p>

                        <PlannerSearch onSearch={handleSearch} />

                        <div className="mt-16 flex justify-center gap-12 text-gray-400 grayscale opacity-60">
                            <div className="flex items-center gap-2 font-medium"><Sparkles className="h-5 w-5" /> <span>AI Optimized</span></div>
                            <div className="flex items-center gap-2 font-medium"><Map className="h-5 w-5" /> <span>Multi-City Support</span></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {viewState === 'searching' && (
                <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
                    <div className="max-w-md mx-auto">
                        <div className="relative mb-8 mx-auto w-24 h-24">
                            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-25"></div>
                            <div className="h-24 w-24 bg-gradient-to-br from-[#FF6B35] to-[#FF9F1C] rounded-full flex items-center justify-center relative z-10 animate-bounce shadow-lg shadow-orange-200">
                                <Sparkles className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Crafting your perfect journey...</h3>
                        <p className="text-gray-500">Checking 1,042 flight routes and hotel combinations.</p>
                    </div>
                </div>
            )}

            {/* Results Grid */}
            {viewState === 'results' && (
                <div className="container mx-auto px-4 py-12 animate-fade-in-up">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">We found {trips.length} perfect trips for you</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {trips.map(trip => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onClick={() => handleSelectTrip(trip)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Detail View */}
            {viewState === 'detail' && selectedTrip && (
                <div className="container mx-auto px-4 py-8 animate-fade-in">
                    <ItineraryView itinerary={selectedTrip} onReset={handleBackToResults} />
                </div>
            )}
        </div>
    );
}
