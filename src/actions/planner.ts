'use server';

import { generateItineraries, PlannerInputs, TripItinerary } from "@/lib/ai-planner";
import { searchSerpFlights, searchSerpHotels } from "@/lib/api/serp";

export async function getRealItineraries(inputs: PlannerInputs): Promise<TripItinerary[]> {
    // 1. Generate the Base Structure (Smart Mocks)
    // We still use this to get the City/Dates logic which is solid.
    const baseItineraries = generateItineraries(inputs);

    // 2. Enrich with Real Data (Async via SerpApi)
    const enrichedPromises = baseItineraries.map(async (itinerary, index) => {
        // Deep clone to avoid mutation issues
        const newItinerary = JSON.parse(JSON.stringify(itinerary));

        // RESET Price to 0 initially to ensure we don't show mock prices if API fails
        newItinerary.totalPrice = 0;

        // -- Enrich Flights (First Leg) --
        if (newItinerary.days.length > 0 && newItinerary.days[0].transport?.type === 'flight') {
            const firstLeg = newItinerary.days[0].transport;

            try {
                const flight = await searchSerpFlights(firstLeg.from, firstLeg.to, newItinerary.days[0].date);

                if (flight) {
                    newItinerary.days[0].transport = {
                        ...firstLeg,
                        price: Math.round(flight.price),
                        duration: `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m`,
                        provider: flight.airline,
                        bookingLink: flight.link!, // We validated link presence in api/serp
                        isRealData: true,
                    };

                    // Add to total price (Flight cost is per person usually, but let's assume total for now or multiply by travelers if API returns per-head)
                    // SerpApi usually returns price per ticket.
                    newItinerary.totalPrice += (flight.price * inputs.travelers);
                } else {
                    // API returned nothing? Mark as "Check Price"
                    newItinerary.days[0].transport.price = 0;
                    newItinerary.days[0].transport.provider = "Check Availability";
                }
            } catch (e) {
                console.error("Failed to enrich flight:", e);
                newItinerary.days[0].transport.price = 0; // Failure state
            }
        }

        // -- Enrich Hotels (For the first city) --
        try {
            const firstCity = newItinerary.days[0].city;
            const checkIn = newItinerary.days[0].date;

            // Find how many days we stay in this city
            const cityDays = newItinerary.days.filter((d: any) => d.city === firstCity).length;

            // Calculate Checkout
            const checkoutDateObj = new Date(checkIn);
            checkoutDateObj.setDate(checkoutDateObj.getDate() + cityDays);
            const checkOut = checkoutDateObj.toISOString().split('T')[0];

            const realHotels = await searchSerpHotels(firstCity, checkIn, checkOut);

            if (realHotels.length > 0) {
                // Pick one based on variation selection
                let selectedHotel = realHotels[0];
                if (itinerary.tags.includes('Luxury') && realHotels.length > 1) selectedHotel = realHotels[1];
                if (itinerary.tags.includes('Cheapest') && realHotels.length > 0) selectedHotel = realHotels[0]; // Logic could be improved

                const nightlyPrice = Math.round(selectedHotel.price);

                newItinerary.days.forEach((day: any) => {
                    if (day.city === firstCity) {
                        day.accommodation = {
                            ...day.accommodation,
                            name: selectedHotel.name,
                            price: nightlyPrice,
                            rating: selectedHotel.rating,
                            image: selectedHotel.image || day.accommodation.image,
                            bookingLink: selectedHotel.link,
                            isRealData: true
                        };

                        // Add to total price (Price * Rooms? Assuming 1 room for simplicity or per person share)
                        // Typically hotel price is per night per room.
                        // Let's add full room price per night to the total.
                        newItinerary.totalPrice += nightlyPrice;
                    }
                });
            } else {
                // No hotels found? Zero out mock prices
                newItinerary.days.forEach((day: any) => {
                    if (day.city === firstCity) {
                        day.accommodation.price = 0;
                        day.accommodation.name = "Check Availability";
                    }
                });
            }
        } catch (e) {
            console.error("Failed to enrich hotels:", e);
        }

        return newItinerary;
    });

    return Promise.all(enrichedPromises);
}
