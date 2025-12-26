'use client';

import { TripItinerary } from '@/lib/ai-planner';
import { Calendar, CheckCircle, MapPin, Plane, Train, Star, ExternalLink, Play } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ItineraryViewProps {
    itinerary: TripItinerary;
    onReset: () => void;
}

// Custom Video component for Planner to handle loading reliably
function PlannerVideo({ src, poster }: { src: string; poster: string }) {
    const [shouldLoad, setShouldLoad] = useState(false);

    // Delay load slightly to prioritize UI
    useEffect(() => {
        const timer = setTimeout(() => setShouldLoad(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Always show poster first */}
            <img
                src={poster}
                alt="Trip Preview"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${shouldLoad ? 'opacity-0' : 'opacity-100'}`}
            />
            {shouldLoad && (
                <video
                    src={src}
                    poster={poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transform scale-105 animate-fade-in"
                />
            )}
        </>
    );
}

export default function ItineraryView({ itinerary, onReset }: ItineraryViewProps) {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Trip Overview Header (Video Hero) */}
            <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl group border-[6px] border-white bg-gray-100">
                {/* Video Background */}
                {itinerary.video ? (
                    <PlannerVideo src={itinerary.video} poster={itinerary.image || ''} />
                ) : (
                    <img
                        src={itinerary.image || `https://picsum.photos/seed/${itinerary.id}/1200/400`}
                        alt={itinerary.name}
                        className="w-full h-full object-cover"
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="text-white max-w-3xl">
                            <div className="flex gap-2 mb-4">
                                {itinerary.tags?.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold border border-white/20 uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
                                {itinerary.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg font-medium">
                                <span className="flex items-center gap-2"><Calendar className="h-5 w-5 opacity-80" /> {itinerary.durationDays} Days</span>
                                <span className="flex items-center gap-2"><Star className="h-5 w-5 fill-[#FF6B35] text-[#FF6B35]" /> 4.9 Rating</span>
                                <span className="flex items-center gap-2"><MapPin className="h-5 w-5 opacity-80" /> {itinerary.days[0].city} Start</span>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10 text-white min-w-[200px] shadow-2xl">
                            <p className="text-sm opacity-80 mb-1 font-medium text-center uppercase tracking-wider">Total Trip Cost</p>
                            <p className="text-4xl font-black text-center">${itinerary.totalPrice.toLocaleString()}</p>
                            <p className="text-xs opacity-60 text-center mt-1">Includes flights & hotels</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-gray-900">Your Journey</h2>
                        <button className="text-sm font-bold text-blue-600 hover:underline">Download PDF</button>
                    </div>

                    <div className="relative pl-6 border-l-2 border-dashed border-gray-200 space-y-12">
                        {itinerary.days.map((day, idx) => (
                            <div key={`${day.date}-${idx}`} className="relative pl-8 group">
                                {/* Dot */}
                                <div className="absolute -left-[31px] top-0 h-6 w-6 rounded-full border-4 border-white bg-gray-900 shadow-md flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">Day {idx + 1}: {day.city}</h3>
                                    <p className="text-gray-500 font-medium">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                </div>

                                {/* Transport Card */}
                                {day.transport && (
                                    <div className="mb-6 p-5 rounded-3xl bg-[#F0F5FF] border border-blue-100 flex flex-col md:flex-row gap-6 items-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                                        <div className="h-14 w-14 rounded-2xl bg-white text-blue-600 shadow-sm flex items-center justify-center shrink-0 z-10">
                                            {day.transport.type === 'flight' ? <Plane className="h-6 w-6" /> : <Train className="h-6 w-6" />}
                                        </div>
                                        <div className="flex-1 text-center md:text-left z-10">
                                            <p className="font-bold text-gray-900 text-lg">Transfer to {day.transport.to}</p>
                                            <p className="text-sm text-blue-600/80 font-medium">{day.transport.duration} • {day.transport.type === 'flight' ? 'Direct Flight' : 'High Speed Train'}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 z-10">
                                            <span className="font-bold text-gray-900 text-xl">${day.transport.price}</span>
                                            {day.transport.bookingLink && (
                                                <a
                                                    href={day.transport.bookingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
                                                >
                                                    Book Flight <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Stay Card */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/50 p-5 hover:shadow-xl transition-all duration-300">
                                    <div className="flex flex-col md:flex-row gap-5">
                                        <div className="h-40 w-full md:w-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0 relative group-hover/card">
                                            <img src={day.accommodation.image || `https://picsum.photos/seed/${day.city}/200`} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold shadow-sm">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {day.accommodation.rating.toFixed(1)}
                                            </div>
                                        </div>
                                        <div className="flex-1 py-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-xl text-gray-900 leading-tight">{day.accommodation.name}</h4>
                                                    <span className="font-bold text-gray-900 text-xl">${day.accommodation.price}</span>
                                                </div>
                                                <p className="text-sm text-gray-400 font-medium mb-3">Excellent Location • Breakfast Included</p>

                                                <div className="flex gap-2 flex-wrap">
                                                    {day.activities.map((act, i) => (
                                                        <span key={i} className="text-xs font-semibold px-2.5 py-1.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-100">
                                                            {act}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-end mt-4">
                                                <a
                                                    href={day.accommodation.bookingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-5 py-2.5 bg-[#003580] hover:bg-[#00224f] text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5"
                                                >
                                                    Book on Booking.com <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl sticky top-24">
                        <h3 className="font-bold text-xl mb-6">Trip Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600">
                                <span>Travelers</span>
                                <span className="font-bold text-gray-900">{itinerary.travelers} Adults</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Duration</span>
                                <span className="font-bold text-gray-900">{itinerary.durationDays} Days</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Destinations</span>
                                <span className="font-bold text-gray-900">{Array.from(new Set(itinerary.days.map(d => d.city))).length} Cities</span>
                            </div>
                            <div className="h-px bg-gray-100 my-4" />
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-gray-900">Est. Total</span>
                                <span className="text-3xl font-black text-[#FF6B35]">${itinerary.totalPrice}</span>
                            </div>
                            <p className="text-xs text-gray-400 text-center">Price includes estimated flight & hotel costs.</p>
                        </div>

                        <button className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg hover:bg-[#FF6B35] transition-all shadow-lg hover:shadow-orange-200 mb-4 block">
                            Save This Itinerary
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
