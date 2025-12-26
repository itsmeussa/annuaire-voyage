const SERP_API_KEY = "d7df72a46b52c3215517eae1cb130658d8dcab2433581e4370c84a1699c3fa59";
const BASE_URL = "https://serpapi.com/search.json";

// Static mapping for common hubs
// Static mapping for common hubs
export const AIRPORT_CODES: Record<string, string> = {
    'Paris': 'PAR',
    'London': 'LON',
    'New York': 'NYC',
    'Tokyo': 'TYO',
    'Dubai': 'DXB',
    'Istanbul': 'IST',
    'Bangkok': 'BKK',
    'Singapore': 'SIN',
    'Barcelona': 'BCN',
    'Madrid': 'MAD',
    'Rome': 'ROM',
    'Milan': 'MIL',
    'Amsterdam': 'AMS',
    'Lisbon': 'LIS',
    'Prague': 'PRG',
    'Berlin': 'BER',
    'Sydney': 'SYD',
    'Los Angeles': 'LAX',
    'San Francisco': 'SFO',
    'Miami': 'MIA',
    'Bali': 'DPS',
    'Marrakech': 'RAK',
    'Cairo': 'CAI',
    'Lyon': 'LYS',
    'Marseille': 'MRS',
    'Nice': 'NCE',
    'Toulouse': 'TLS',
    'Bordeaux': 'BOD',
    'Nantes': 'NTE',
    'Lille': 'LIL',
    'Montpellier': 'MPL',
    'Strasbourg': 'SXB',
    'Casablanca': 'CMN',
    'Tunis': 'TUN',
    'Algiers': 'ALG'
};

export function getCode(city: string) {
    const key = Object.keys(AIRPORT_CODES).find(k => city.toLowerCase().includes(k.toLowerCase()));
    return key ? AIRPORT_CODES[key] : city.substring(0, 3).toUpperCase();
}

function parsePrice(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const cleaned = value.replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
    }
    // Handle specific SerpApi structures if they appear (sometimes object with extracted_value)
    return 0;
}

export interface SerpFlight {
    price: number;
    airline: string;
    logo?: string;
    duration: number; // minutes
    departure: string;
    arrival: string;
    stops: number;
    link?: string;
}

export interface SerpHotel {
    name: string;
    price: number;
    rating: number;
    image: string;
    link: string;
}

// --- Google Flights ---

export async function searchSerpFlights(fromCity: string, toCity: string, date: string): Promise<SerpFlight | null> {
    const departure_id = getCode(fromCity);
    const arrival_id = getCode(toCity);

    try {
        const url = new URL(BASE_URL);
        url.searchParams.append("engine", "google_flights");
        url.searchParams.append("departure_id", departure_id);
        url.searchParams.append("arrival_id", arrival_id);
        url.searchParams.append("outbound_date", date);
        url.searchParams.append("currency", "USD");
        url.searchParams.append("hl", "en");
        url.searchParams.append("type", "2");
        url.searchParams.append("api_key", SERP_API_KEY);

        const res = await fetch(url.toString());
        const data = await res.json();

        // Combine Best Flights and Other Flights
        const allFlights = [
            ...(data.best_flights || []),
            ...(data.other_flights || [])
        ];

        if (allFlights.length === 0) return null;

        // Sort by parsed price
        allFlights.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));

        const cheapest = allFlights[0];
        const flightOption = cheapest.flights?.[0]; // First segment
        const parsedPrice = parsePrice(cheapest.price);

        // Robust link
        const deepLink = data.search_metadata?.google_flights_url || `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(toCity)}%20from%20${encodeURIComponent(fromCity)}%20on%20${date}`;

        return {
            price: parsedPrice,
            airline: flightOption?.airline || cheapest.airline || "Multi-Airline",
            logo: flightOption?.airline_logo || cheapest.airline_logo,
            duration: cheapest.total_duration || 120,
            departure: flightOption?.departure_airport?.time || date + " 10:00",
            arrival: flightOption?.arrival_airport?.time || date + " 14:00",
            stops: cheapest.flights?.length ? cheapest.flights.length - 1 : 0,
            link: deepLink
        };

    } catch (e) {
        console.error("SerpApi Flight Error:", e);
        return null;
    }
}

// --- Google Hotels ---

export async function searchSerpHotels(city: string, checkIn: string, checkOut: string): Promise<SerpHotel[]> {
    try {
        const url = new URL(BASE_URL);
        url.searchParams.append("engine", "google_hotels");
        url.searchParams.append("q", city);
        url.searchParams.append("check_in_date", checkIn);
        url.searchParams.append("check_out_date", checkOut);
        url.searchParams.append("currency", "USD");
        url.searchParams.append("adults", "2");
        url.searchParams.append("api_key", SERP_API_KEY);

        const res = await fetch(url.toString());
        const data = await res.json();

        if (!data.properties) return [];

        return data.properties.slice(0, 3).map((p: any) => {
            // Need to handle various price structures in Google Hotels API
            // Usually p.rate_per_night is { "lowest": "$123", ... }
            const rawPrice = p.rate_per_night?.lowest || p.total_rate?.lowest || "0";

            return {
                name: p.name,
                price: parsePrice(rawPrice),
                rating: p.overall_rating || 4.5,
                image: p.images?.[0]?.original_image || p.images?.[0]?.thumbnail || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80",
                link: p.link || `https://www.google.com/travel/hotels?q=${encodeURIComponent(city)}`
            };
        });

    } catch (e) {
        console.error("SerpApi Hotel Error:", e);
        return [];
    }
}
