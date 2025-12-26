'use client';

import { useState } from 'react';
import { Sparkles, MapPin, Calendar, Wallet, Check, ChevronRight, ChevronLeft, Plane } from 'lucide-react';
import { generateItineraries, PlannerInputs, TripItinerary } from '@/lib/ai-planner';
import ItineraryView from './ItineraryView';

export default function PlannerWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);

  // State for inputs
  const [destinations, setDestinations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(2000);
  const [travelers, setTravelers] = useState(2);
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'fast'>('moderate');
  const [interests, setInterests] = useState<string[]>([]);

  // Mock list of popular cities
  const POPULAR_CITIES = ['Paris', 'London', 'Rome', 'Barcelona', 'Amsterdam', 'Dubai', 'Tokyo', 'New York'];

  const INTEREST_OPTIONS = [
    { id: 'culture', label: 'Art & Culture', icon: '🎨' },
    { id: 'food', label: 'Food & Dining', icon: '🍷' },
    { id: 'nature', label: 'Nature & Parks', icon: '🌳' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'adventure', label: 'Adventure', icon: '🧗' },
    { id: 'relaxation', label: 'Relaxation', icon: '🧘' },
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleGenerate();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleDestination = (city: string) => {
    if (destinations.includes(city)) {
      setDestinations(destinations.filter(c => c !== city));
    } else {
      if (destinations.length < 4) { // Limit to 4 cities
        setDestinations([...destinations, city]);
      }
    }
  };

  const toggleInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter(i => i !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  const handleGenerate = () => {
    setLoading(true);

    // Validate dates
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(new Date().setDate(new Date().getDate() + 7));

    const inputs: PlannerInputs = {
      destinations: destinations.length > 0 ? destinations : ['Paris', 'London'], // Fallback
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      budget,
      travelers,
      interests
    };

    // Simulation delay
    setTimeout(() => {
      const results = generateItineraries(inputs);
      setItinerary(results[0]); // Just take the first one for compatibility
      setLoading(false);
    }, 3000);
  };

  const handleReset = () => {
    setItinerary(null);
    setStep(1);
    setDestinations([]);
    accumulatedPrice: 0;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
          <div className="h-24 w-24 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center relative z-10 animate-pulse">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Designing Your Journey...</h2>
        <div className="space-y-3 text-center max-w-md">
          <p className="text-muted-foreground animate-fade-in">Analyzed 1,402 flight combinations...</p>
          <p className="text-muted-foreground animate-fade-in delay-1000">Found optimal train connections between cities...</p>
          <p className="text-muted-foreground animate-fade-in delay-2000">Selecting top-rated hotels within your budget...</p>
        </div>
      </div>
    );
  }

  // Show Result View if itinerary exists
  if (itinerary) {
    return <ItineraryView itinerary={itinerary} onReset={handleReset} />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
      {/* Progress Bar */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Step {step} of 3</span>
          <span className="text-sm font-bold text-primary">{Math.round((step / 3) * 100)}% Complete</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              Where do you want to go?
            </h2>
            <p className="text-muted-foreground">Select up to 4 cities for your multi-destination trip.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {POPULAR_CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => toggleDestination(city)}
                  className={`p-4 rounded-xl border-2 transition-all text-left group ${destinations.includes(city)
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg">{city}</span>
                    {destinations.includes(city) && (
                      <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Currently Selected order:</p>
              <div className="flex items-center gap-2 flex-wrap">
                {destinations.length === 0 ? (
                  <span className="text-gray-400 italic">No cities selected yet</span>
                ) : (
                  destinations.map((city, idx) => (
                    <div key={city} className="flex items-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {idx + 1}. {city}
                      </span>
                      {idx < destinations.length - 1 && (
                        <div className="w-8 h-0.5 bg-gray-300 mx-1"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" />
              When are you traveling?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Plane className="h-5 w-5 text-primary" />
                Travelers
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold"
                >
                  -
                </button>
                <span className="text-xl font-bold w-8 text-center">{travelers}</span>
                <button
                  onClick={() => setTravelers(Math.min(10, travelers + 1))}
                  className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold"
                >
                  +
                </button>
                <span className="text-gray-500">Person{travelers > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Wallet className="h-6 w-6 text-primary" />
              Your Preferences
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="font-medium text-gray-700">Total Budget (approx)</label>
                <span className="font-bold text-primary">${budget}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>$500</span>
                <span>$10,000+</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-medium text-gray-700 block">Travel Pace</label>
              <div className="grid grid-cols-3 gap-4">
                {(['relaxed', 'moderate', 'fast'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPace(p)}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold capitalize transition-all ${pace === p
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-medium text-gray-700 block">Interests</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INTEREST_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    className={`py-3 px-4 rounded-xl border text-left transition-all flex items-center gap-2 ${interests.includes(opt.id)
                      ? 'bg-blue-50 border-blue-200 text-primary font-medium'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-gray-100 flex justify-between bg-gray-50/50">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${step === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-white hover:shadow-sm'
            }`}
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={step === 1 && destinations.length < 2}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${step === 1 && destinations.length < 2
            ? 'bg-gray-300 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl hover:scale-105'
            }`}
        >
          {step === 3 ? 'Generate Trip' : 'Next Step'}
          {step !== 3 && <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
