import { TripItinerary } from "@/lib/ai-planner";

const RAPID_API_KEY = "b892c21afamsh0e445d7ae079955p129887jsn2a85e998c03d";
const SKY_HOST = "sky-scrapper.p.rapidapi.com";
const BOOKING_HOST = "booking-com15.p.rapidapi.com";

export interface FlightResult {
    id: string;
    price: number;
    currency: string;
    origin: string;
    destination: string;
    durationInMinutes: number;
    stopCount: number;
    carrier: {
        name: string;
        logoUrl: string;
    };
    departure: string;
    arrival: string;
}

// --- SkyScrapper (Flights) ---

export async function searchLocation(query: string) {
    try {
        const url = `https://${SKY_HOST}/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}&locale=en-US`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': SKY_HOST
            }
        });

        if (!response.ok) return null;
        const data = await response.json();

        // Return the first valid airport/city
        const result = data.data?.[0];
        if (!result) return null;

        return {
            skyId: result.skyId,
            entityId: result.entityId,
            name: result.presentation.title,
            country: result.presentation.subtitle
        };
    } catch (error) {
        console.error("Error searching location:", error);
        return null;
    }
}

export async function searchRealFlights(fromEntity: { skyId: string, entityId: string }, toEntity: { skyId: string, entityId: string }, date: string): Promise<FlightResult[]> {
    try {
        const url = `https://${SKY_HOST}/api/v2/flights/searchFlightsComplete?originSkyId=${fromEntity.skyId}&destinationSkyId=${toEntity.skyId}&originEntityId=${fromEntity.entityId}&destinationEntityId=${toEntity.entityId}&date=${date}&cabinClass=economy&adults=1&sortBy=best&currency=USD&market=en-US&countryCode=US`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': SKY_HOST
            }
        });

        if (!response.ok) return [];
        const data = await response.json();

        if (!data.data?.itineraries) return [];

        // Map relevant data
        return data.data.itineraries.slice(0, 3).map((itinerary: any) => {
            const leg = itinerary.legs[0];
            const carrier = leg.carriers.marketing[0];
            return {
                id: itinerary.id,
                price: itinerary.price.raw,
                currency: 'USD',
                origin: leg.origin.name,
                destination: leg.destination.name,
                durationInMinutes: leg.durationInMinutes,
                stopCount: leg.stopCount,
                carrier: {
                    name: carrier.name,
                    logoUrl: carrier.logoUrl
                },
                departure: leg.departure,
                arrival: leg.arrival
            };
        });

    } catch (error) {
        console.error("Error searching flights:", error);
        return [];
    }
}

// --- Booking.com (Hotels) ---

export async function searchRealHotels(city: string, arrivalDate: string, departureDate: string): Promise<any[]> {
    // Note: booking-com15 mainly exposes auto-complete and search.
    // Given the complexity of mapping city -> dest_id etc, 
    // we will start by resolving the location then searching.
    // For this prototype, we might mock this part if endpoints are restricted, 
    // but let's try a standard location search first.

    // Step 1: Search Location to get dest_id
    // Endpoint inferred from common Booking API structures on RapidAPI
    try {
        const locUrl = `https://${BOOKING_HOST}/api/v1/hotels/searchDestination?query=${encodeURIComponent(city)}`;
        const locRes = await fetch(locUrl, {
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': BOOKING_HOST }
        });
        const locData = await locRes.json();
        const destId = locData.data?.[0]?.dest_id;
        const searchType = locData.data?.[0]?.search_type;

        if (!destId) return [];

        // Step 2: Search Hotels
        const searchUrl = `https://${BOOKING_HOST}/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=${searchType}&arrival_date=${arrivalDate}&departure_date=${departureDate}&adults=2&children_age=0&room_qty=1&page_number=1&units=metric&temperature_unit=c&languagecode=en-us&currency_code=USD`;

        const searchRes = await fetch(searchUrl, {
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': BOOKING_HOST }
        });
        const searchData = await searchRes.json();

        // Map simplified hotels
        return searchData.data?.hotels?.slice(0, 5).map((h: any) => ({
            name: h.property.name,
            price: h.property.priceBreakdown.grossPrice.value,
            rating: h.property.reviewScore,
            image: h.property.photoUrls?.[0],
            link: `https://www.booking.com/hotel/xy/${h.property.name}.html` // Fallback link construction
        })) || [];

    } catch (error) {
        console.error("Booking API Error:", error);
        return []; // Fallback to mocks handled by caller
    }
}
