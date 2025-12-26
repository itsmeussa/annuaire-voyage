// Types
export interface TripDay {
    date: string;
    city: string;
    activities: string[];
    accommodation: {
        name: string;
        price: number;
        rating: number;
        image?: string;
        bookingLink: string;
        isRealData?: boolean;
    };
    transport: {
        type: 'flight' | 'train' | 'bus';
        from: string;
        to: string;
        duration: string;
        price: number;
        bookingLink: string;
        provider?: string;
        isRealData?: boolean;
    } | null;
}

export type TripTag = 'Recommended' | 'Cheapest' | 'Fastest' | 'Luxury' | 'Nature' | 'Urban';

export interface TripItinerary {
    id: string;
    name: string;
    totalPrice: number;
    durationDays: number;
    travelers: number;
    days: TripDay[];
    tags: TripTag[];
    image: string;
    video: string; // URL to a video file or embed
}

export interface PlannerInputs {
    startLocation?: string;
    destinations: string[]; // Might be empty if just searching "to"
    destinationQuery?: string; // For "Where to?" input
    startDate: string;
    endDate: string;
    budget?: number; // Optional
    travelers: number;
    interests?: string[];
}

// --- Real Data Constants & video/image mappings ---

// Expanded cheap hubs for "Anywhere" search
const CHEAP_HUBS = [
    'Lisbon', 'Prague', 'Bangkok', 'Bali', 'Budapest', 'Marrakech', 'Istanbul', 'Mexico City', 'Ho Chi Minh City', 'Cairo'
];

// High quality video/image mapping using Pexels (reliable)
const CITY_MEDIA: Record<string, { image: string, video: string }> = {
    'Paris': {
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80',
        video: 'https://videos.pexels.com/video-files/3773489/3773489-hd_1920_1080_30fps.mp4' // Eiffel Tower
    },
    'Tokyo': {
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80',
        video: 'https://videos.pexels.com/video-files/5827618/5827618-hd_1920_1080_30fps.mp4' // Tokyo/Asian City
    },
    'New York': {
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80',
        video: 'https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4' // NYC Traffic
    },
    'London': {
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80',
        video: 'https://videos.pexels.com/video-files/4505500/4505500-hd_1920_1080_30fps.mp4' // London eye/city
    },
    'Dubai': {
        image: 'https://images.unsplash.com/photo-1512453979798-5ea90b2009f4?q=80',
        video: 'https://videos.pexels.com/video-files/3763071/3763071-hd_1920_1080_25fps.mp4'
    },
    'Bali': {
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80',
        video: 'https://videos.pexels.com/video-files/2162985/2162985-hd_1920_1080_30fps.mp4'
    },
    'Lisbon': {
        image: 'https://images.unsplash.com/photo-1548707304-4eb70f7b588c?q=80',
        video: 'https://videos.pexels.com/video-files/3973797/3973797-hd_1920_1080_25fps.mp4'
    },
    'Prague': {
        image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80',
        video: 'https://videos.pexels.com/video-files/4252654/4252654-hd_1920_1080_30fps.mp4'
    },
    'Bangkok': {
        image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80',
        video: 'https://videos.pexels.com/video-files/3124803/3124803-hd_1920_1080_30fps.mp4'
    },
    'Istanbul': {
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80',
        video: 'https://videos.pexels.com/video-files/4563851/4563851-hd_1920_1080_30fps.mp4'
    },
    // Fallback for others
    'Default': {
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80',
        video: 'https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4' // Plane wing
    }
};

const HOTEL_CHAINS = ["Grand Plaza", "City Center Inn", "Luxury Resort", "Boutique Stay", "Central Hostel", "Royal Suites", "Comfort Haven"];

const ACTIVITY_TEMPLATES = {
    culture: ["Visit National Museum", "Old Town Walking Tour", "Art Gallery Exhibition", "Historical Castle Visit"],
    food: ["Street Food Tasting", "Michelin Star Dinner", "Local Market Tour", "Cooking Class"],
    nature: ["City Park Picnic", "Botanical Gardens", "River Cruise", "Sunset Hike"],
    shopping: ["Vintage Market Shopping", "Luxury Mall Visit", "Souvenir Hunting", "Fashion District Tour"],
    adventure: ["City Bike Tour", "Kayaking Adventure", "Climbing Gym", "Escape Room Challenge"],
    relaxation: ["Spa Day", "Beach Relaxation", "Coffee Shop Hopping", "Yoga Session"],
};

// --- Helpers ---

function getMedia(city: string) {
    const keys = Object.keys(CITY_MEDIA);
    const match = keys.find(k => city.toLowerCase().includes(k.toLowerCase()));
    return CITY_MEDIA[match || 'Default'];
}

import { getCode } from "./api/serp";

function generateGoogleFlightsLink(from: string, to: string, date: string) {
    // Try to use airport codes for a more robust direct link
    const fromCode = getCode(from);
    const toCode = getCode(to);

    // Format: https://www.google.com/flights?hl=en#flt=[origin].[dest].[date];c:USD;e:1;sd:1;t:f
    // Example: flt=CDG.LHR.2025-12-27
    return `https://www.google.com/flights?hl=en#flt=${fromCode}.${toCode}.${date};c:USD;e:1;sd:1;t:f`;
}

function generateGoogleHotelsLink(city: string, checkin: string, checkout: string) {
    // Natural language query works best if partial params fail
    // "Hotels in [City] from [Checkin] to [Checkout]"
    const query = `Hotels in ${city} from ${checkin} to ${checkout}`;
    return `https://www.google.com/travel/hotels?q=${encodeURIComponent(query)}`;
}

// --- Generator ---

function generateSingleItinerary(inputs: PlannerInputs, variation: 'standard' | 'budget' | 'luxury', overrideDestinations?: string[]): TripItinerary {
    const { startLocation = "Paris", startDate, endDate, travelers, interests = [] } = inputs;

    let tripDestinations = overrideDestinations || (inputs.destinations.length > 0 ? inputs.destinations : [inputs.destinationQuery || 'Paris']);

    if (tripDestinations.length === 0 || (tripDestinations.length === 1 && !tripDestinations[0])) {
        tripDestinations = ['Paris'];
    }

    if (tripDestinations.length === 1 && variation === 'standard') {
        const first = tripDestinations[0];
        if (first === 'Paris') tripDestinations.push('London');
        else if (first === 'London') tripDestinations.push('Edinburgh');
        else if (first === 'Tokyo') tripDestinations.push('Kyoto');
        else if (first === 'New York') tripDestinations.push('Washington DC');
        else if (first === 'Barcelona') tripDestinations.push('Madrid');
        else if (first === 'Rome') tripDestinations.push('Florence');
        else tripDestinations.push('Nearby City');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const tripDays: TripDay[] = [];
    let currentDate = new Date(start);
    let accumulatedPrice = 0;

    const daysPerCity = Math.floor(durationDays / tripDestinations.length);
    const extraDays = durationDays % tripDestinations.length;

    tripDestinations.forEach((city, index) => {
        const stayDuration = daysPerCity + (index < extraDays ? 1 : 0);
        const actualStay = Math.max(1, stayDuration);

        // Randomize Hotel more realistically with City Name within loop scope
        const chain = HOTEL_CHAINS[Math.floor(Math.random() * HOTEL_CHAINS.length)];
        const hotelName = `${chain} ${city}`;

        let basePrice = 100;
        if (variation === 'budget') basePrice = 50 + Math.random() * 30;
        else if (variation === 'luxury') basePrice = 250 + Math.random() * 200;
        else basePrice = 120 + Math.random() * 80;

        const hotelCost = Math.round(basePrice * actualStay * travelers);
        accumulatedPrice += hotelCost;

        const checkinDate = currentDate.toISOString().split('T')[0];
        const checkoutDateObj = new Date(currentDate);
        checkoutDateObj.setDate(checkoutDateObj.getDate() + actualStay);
        const checkoutDate = checkoutDateObj.toISOString().split('T')[0];

        for (let i = 0; i < actualStay; i++) {
            const dailyActivities: string[] = [];
            const interestPool = interests.length > 0 ? interests : ['culture', 'food'];

            for (let j = 0; j < 2; j++) {
                const type = interestPool[Math.floor(Math.random() * interestPool.length)] as keyof typeof ACTIVITY_TEMPLATES;
                const options = ACTIVITY_TEMPLATES[type] || ACTIVITY_TEMPLATES['culture'];
                const activity = options[Math.floor(Math.random() * options.length)];
                if (!dailyActivities.includes(activity)) dailyActivities.push(activity);
            }

            let transport: TripDay['transport'] = null;
            if (i === 0) {
                let fromCity = startLocation;
                let price = (variation === 'budget' ? 150 : 350) * travelers;
                let duration = 'Flight';
                let type: 'flight' | 'train' | 'bus' = 'flight';

                if (index > 0) {
                    fromCity = tripDestinations[index - 1];
                    price = (variation === 'budget' ? 50 : 150) * travelers;
                    duration = variation === 'budget' ? '4h 30m' : '1h 15m';
                    type = variation === 'budget' ? 'bus' : 'train';
                }

                transport = {
                    type,
                    from: fromCity,
                    to: city,
                    duration,
                    price,
                    bookingLink: generateGoogleFlightsLink(fromCity, city, currentDate.toISOString().split('T')[0])
                };
                accumulatedPrice += transport.price;
            }

            tripDays.push({
                date: currentDate.toISOString().split('T')[0],
                city,
                activities: dailyActivities,
                accommodation: {
                    name: hotelName,
                    price: Math.round(basePrice),
                    rating: 4.0 + (Math.random() * 1.0),
                    image: `https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80`,
                    bookingLink: generateGoogleHotelsLink(city, checkinDate, checkoutDate)
                },
                transport
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    const tags: TripTag[] = [];
    if (variation === 'standard') tags.push('Recommended', 'Urban');
    if (variation === 'budget') tags.push('Cheapest', 'Urban');
    if (variation === 'luxury') tags.push('Luxury', 'Relaxation' as any);

    const media = getMedia(tripDestinations[0]);

    return {
        id: `trip-${variation}-${Date.now()}`,
        name: variation === 'standard' ? `Best of ${tripDestinations.join(' & ')}` :
            variation === 'budget' ? `Budget Explorer: ${tripDestinations[0]}` :
                `Luxury Escape in ${tripDestinations[0]}`,
        totalPrice: accumulatedPrice,
        durationDays,
        travelers,
        days: tripDays,
        tags,
        image: media.image,
        video: media.video,
    };
}

export function generateItineraries(inputs: PlannerInputs): TripItinerary[] {
    const isAnywhereSearch =
        (!inputs.destinations || inputs.destinations.length === 0) &&
        (!inputs.destinationQuery || inputs.destinationQuery.trim() === '');

    if (isAnywhereSearch) {
        // "Anywhere" Logic: Pick 3 distinct random cheap hubs
        const shuffled = [...CHEAP_HUBS].sort(() => 0.5 - Math.random());

        return [
            generateSingleItinerary(inputs, 'budget', [shuffled[0]]),
            generateSingleItinerary(inputs, 'standard', [shuffled[1]]),
            generateSingleItinerary(inputs, 'luxury', [shuffled[2], shuffled[3]])
        ];
    }

    const standard = generateSingleItinerary(inputs, 'standard');
    const budget = generateSingleItinerary(inputs, 'budget');
    const luxury = generateSingleItinerary(inputs, 'luxury');

    return [standard, budget, luxury];
}
