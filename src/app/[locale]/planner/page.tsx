"use client";

import { useState, useEffect } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import {
    Plane,
    Sparkles,
    MapPin,
    Calendar,
    Users,
    DollarSign,
    CheckCircle,
    ArrowRight,
    Hotel,
    Utensils,
    Camera,
    Coffee,
    Moon,
    Sun,
    Loader2
} from "lucide-react";

// Mock Data Generators (Client Side Only for Demo)
interface DayPlan {
    day: number;
    title: string;
    activities: {
        time: string;
        title: string;
        description: string;
        icon: any;
        type: 'morning' | 'afternoon' | 'evening';
    }[];
}

const DESTINATIONS = [
    "Paris, France", "Marrakech, Morocco", "Tokyo, Japan", "New York, USA",
    "London, UK", "Dubai, UAE", "Rome, Italy", "Barcelona, Spain",
    "Bali, Indonesia", "Istanbul, Turkey"
];

export default function PlannerPage() {
    const t = useTranslations('Planner');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Form State
    const [destination, setDestination] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [budget, setBudget] = useState(""); // budget, moderate, luxury
    const [travelers, setTravelers] = useState(1);
    const [interests, setInterests] = useState<string[]>([]);

    // Result State
    const [itinerary, setItinerary] = useState<any>(null);

    // Destination Autocomplete
    useEffect(() => {
        if (destination.length > 1) {
            const filtered = DESTINATIONS.filter(d =>
                d.toLowerCase().includes(destination.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [destination]);

    const handleGenerate = () => {
        if (!destination || !budget) return;

        setLoading(true);
        // Simulate AI Processing
        setTimeout(() => {
            const result = generateMockItinerary(destination, budget, travelers, interests);
            setItinerary(result);
            setLoading(false);
            setShowResult(true);
        }, 3000);
    };

    const generateMockItinerary = (dest: string, bud: string, trav: number, ints: string[]) => {
        // Simple heuristic to generate "plausible" data
        const city = dest.split(',')[0].trim();
        const isLuxury = bud === 'luxury';

        const days: DayPlan[] = [
            {
                day: 1,
                title: t('results.title'), // Needs dynamic day title logic if complex, but kept simple
                activities: [
                    {
                        time: "09:00",
                        title: `${t('results.morning')} in ${city}`,
                        description: `Check into your ${isLuxury ? '5-star suite' : 'hotel'}.`,
                        icon: Hotel,
                        type: 'morning'
                    },
                    {
                        time: "14:00",
                        title: `${t('options.interests.culture')} Tour`,
                        description: "Visit the main landmarks.",
                        icon: Camera,
                        type: 'afternoon'
                    },
                    {
                        time: "20:00",
                        title: t('results.evening'),
                        description: isLuxury ? "Michelin star dinner." : "Local street food experience.",
                        icon: Utensils,
                        type: 'evening'
                    }
                ]
            },
            {
                day: 2,
                title: "Adventure & Nature",
                activities: [
                    {
                        time: "10:00",
                        title: t('options.interests.nature'),
                        description: "Day trip to nearby natural wonders.",
                        icon: Sun,
                        type: 'morning'
                    },
                    {
                        time: "19:00",
                        title: t('options.interests.relaxation'),
                        description: "Spa and wellness evening.",
                        icon: Moon,
                        type: 'evening'
                    }
                ]
            },
            {
                day: 3,
                title: "Shopping & Departure",
                activities: [
                    {
                        time: "11:00",
                        title: t('options.interests.shopping'),
                        description: "Local markets and souvenirs.",
                        icon: DollarSign,
                        type: 'morning'
                    },
                    {
                        time: "16:00",
                        title: "Departure",
                        description: "Transfer to airport.",
                        icon: Plane,
                        type: 'afternoon'
                    }
                ]
            }
        ];

        return {
            destination: dest,
            budget: bud,
            travelers: trav,
            days
        };
    };

    const toggleInterest = (id: string) => {
        if (interests.includes(id)) {
            setInterests(interests.filter(i => i !== id));
        } else {
            setInterests([...interests, id]);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-200/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                {!showResult ? (
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-lg shadow-purple-500/30">
                                <Sparkles className="h-4 w-4" />
                                <span>Beta Access</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                                {t('title')}
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                                {t('subtitle')}
                            </p>
                        </div>

                        {/* Interactive Form Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 mb-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">

                            {/* Destination */}
                            <div className="mb-8 relative z-10">
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                    {t('form.destination')}
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                                    <input
                                        type="text"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder={t('placeholders.destination')}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm"
                                    />
                                    {showSuggestions && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                                            {suggestions.map(s => (
                                                <div
                                                    key={s}
                                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-700"
                                                    onClick={() => {
                                                        setDestination(s);
                                                        setShowSuggestions(false);
                                                    }}
                                                >
                                                    <MapPin className="h-4 w-4 text-slate-400" />
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-8 relative z-10">
                                {/* Budget */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                        {t('form.budget')}
                                    </label>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'budget', label: t('options.budget.budget'), icon: DollarSign },
                                            { id: 'moderate', label: t('options.budget.moderate'), icon: DollarSign },
                                            { id: 'luxury', label: t('options.budget.luxury'), icon: Sparkles }
                                        ].map((opt) => (
                                            <div
                                                key={opt.id}
                                                onClick={() => setBudget(opt.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${budget === opt.id ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'}`}
                                            >
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${budget === opt.id ? 'bg-purple-200' : 'bg-slate-100'}`}>
                                                    <opt.icon className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">{opt.label}</span>
                                                {budget === opt.id && <CheckCircle className="h-5 w-5 ml-auto text-purple-600" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Travelers */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                        {t('form.travelers')}
                                    </label>
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <button
                                            onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                            className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl font-bold flex-1 text-center">{travelers}</span>
                                        <button
                                            onClick={() => setTravelers(travelers + 1)}
                                            className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Interests */}
                            <div className="mb-10 relative z-10">
                                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                    {t('form.interests')}
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { id: 'culture', label: t('options.interests.culture') },
                                        { id: 'nature', label: t('options.interests.nature') },
                                        { id: 'food', label: t('options.interests.food') },
                                        { id: 'shopping', label: t('options.interests.shopping') },
                                        { id: 'relaxation', label: t('options.interests.relaxation') }
                                    ].map((interest) => (
                                        <span
                                            key={interest.id}
                                            onClick={() => toggleInterest(interest.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${interests.includes(interest.id)
                                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {interest.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !destination || !budget}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative z-10"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        {t('form.generating')}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5 text-yellow-300" />
                                        {t('form.generate')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    // RESULTS VIEW
                    <div className="max-w-4xl mx-auto animate-fade-in-up">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">{t('results.title')}</h2>
                                <p className="text-slate-600">{t('results.subtitle', { destination })}</p>
                            </div>
                            <button
                                onClick={() => setShowResult(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-purple-600 bg-white border border-slate-200 rounded-lg hover:border-purple-200 transition-all"
                            >
                                ← New Search
                            </button>
                        </div>

                        <div className="space-y-8">
                            {itinerary?.days.map((day: DayPlan) => (
                                <div key={day.day} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-blue-500" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">
                                            {day.day}
                                        </span>
                                        {day.title}
                                    </h3>

                                    <div className="space-y-6 pl-4 border-l-2 border-slate-100 ml-4">
                                        {day.activities.map((act, i) => (
                                            <div key={i} className="relative pl-8 group">
                                                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-purple-500 group-hover:scale-110 transition-transform" />
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                                                        <act.icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                                                            {act.time} • {act.type}
                                                        </div>
                                                        <h4 className="text-lg font-bold text-slate-800 mb-1">{act.title}</h4>
                                                        <p className="text-slate-600 text-sm leading-relaxed">{act.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all cursor-pointer">
                                {t('results.book')}
                                <ArrowRight className="h-5 w-5" />
                            </div>
                            <p className="mt-4 text-xs text-slate-400">
                                {t('results.disclaimer')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
