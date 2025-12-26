import { TripItinerary } from '@/lib/ai-planner';
import { Clock, MapPin, ArrowRight, Star } from 'lucide-react';

interface TripCardProps {
    trip: TripItinerary;
    onClick: () => void;
}

export default function TripCard({ trip, onClick }: TripCardProps) {
    const cities = Array.from(new Set(trip.days.map(d => d.city)));
    const firstCity = cities[0];

    const getTagColor = (tag: string) => {
        switch (tag) {
            case 'Recommended': return 'bg-blue-500/80 text-white border-blue-400';
            case 'Cheapest': return 'bg-green-500/80 text-white border-green-400';
            case 'Luxury': return 'bg-purple-500/80 text-white border-purple-400';
            default: return 'bg-gray-500/80 text-white border-gray-400';
        }
    };

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* Media Header (Video or Image) */}
            <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                    src={trip.image || `https://picsum.photos/seed/${firstCity}/800/600`}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0 absolute inset-0"
                />
                {/* Video on Hover */}
                {trip.video && (
                    <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <video
                            src={trip.video}
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                            // Preload metadata to avoid lag
                            preload="metadata"
                        />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 pointer-events-none" />

                <div className="absolute bottom-4 left-4 text-white z-30">
                    <h3 className="font-bold text-2xl mb-1 leading-tight">{trip.name}</h3>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                        <MapPin className="h-4 w-4 text-[#FF6B35]" />
                        <span className="font-medium">{cities.length} Stops: {cities.join(', ')}</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="absolute top-4 left-4 flex gap-2 z-30">
                    {trip.tags?.map(tag => (
                        <span key={tag} className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${getTagColor(tag)}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                {/* Route Visual */}
                <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 overflow-x-auto pb-2 scrollbar-none">
                    {cities.map((city, idx) => (
                        <div key={city} className="flex items-center shrink-0">
                            <span className={`font-medium ${idx === 0 ? 'text-gray-900' : ''}`}>{city}</span>
                            {idx < cities.length - 1 && <ArrowRight className="h-3 w-3 mx-2 text-gray-300" />}
                        </div>
                    ))}
                </div>

                {/* Pricing & CTA */}
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Price</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-[#FF6B35]">${trip.totalPrice}</span>
                            <span className="text-sm text-gray-400">/ {trip.travelers} pers</span>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm group-hover:bg-[#FF6B35] transition-colors shadow-lg">
                        View Trip
                    </button>
                </div>
            </div>
        </div>
    );
}
