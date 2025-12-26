'use server';

import { generateItineraries, PlannerInputs, TripItinerary } from "@/lib/ai-planner";
import { searchSerpFlights, searchSerpHotels } from "@/lib/api/serp";

export async function getRealItineraries(inputs: PlannerInputs): Promise<TripItinerary[]> {
    // 1. Generate the Base Structure (Smart Mocks)
    const baseItineraries = generateItineraries(inputs);

    // 2. Enrich with Real Data (Async via SerpApi)
    const enrichedPromises = baseItineraries.map(async (itinerary, index) => {
        // Deep clone to avoid mutation issues
        const newItinerary = JSON.parse(JSON.stringify(itinerary));

        // -- Enrich Flights (First Leg) --
        if (newItinerary.days.length > 0 && newItinerary.days[0].transport?.type === 'flight') {
            const firstLeg = newItinerary.days[0].transport;

            // Only fetch for the first variation (Standard) or if index is 0 to save API usage, 
            // OR fetch for all. User has API key, let's fetch for all distinctly if cities differ.
            // But usually variations have same start route.

            try {
                const flight = await searchSerpFlights(firstLeg.from, firstLeg.to, newItinerary.days[0].date);

                if (flight) {
                    newItinerary.days[0].transport = {
                        ...firstLeg,
                        price: Math.round(flight.price),
                        duration: `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m`,
                        provider: flight.airline,
                        bookingLink: flight.link || `https://www.google.com/travel/flights?q=Flights+to+${firstLeg.to}+from+${firstLeg.from}+on+${newItinerary.days[0].date}`,
                        isRealData: true,
                        // Could add logo if we extended the type
                    };

                    // Update Total Price
                    // Note: flight.price is total for 1 adult usually.
                    const diff = newItinerary.days[0].transport.price - firstLeg.price;
                    newItinerary.totalPrice += diff;
                }
            } catch (e) {
                console.error("Failed to enrich flight:", e);
            }
        }

        // -- Enrich Hotels (For the first city) --
        try {
            const firstCity = newItinerary.days[0].city;
            const checkIn = newItinerary.days[0].date;
            const cityDays = newItinerary.days.filter((d: any) => d.city === firstCity).length;

            // Calculate Checkout
            const checkoutDateObj = new Date(checkIn);
            checkoutDateObj.setDate(checkoutDateObj.getDate() + cityDays);
            const checkOut = checkoutDateObj.toISOString().split('T')[0];

            const realHotels = await searchSerpHotels(firstCity, checkIn, checkOut);

            if (realHotels.length > 0) {
                // Pick one based on variation if possible, otherwise just 0
                // 'budget' -> lowest price? 'luxury' -> highest?
                // Serp returns generic list. Let's just pick index based on variation map roughly or random.
                let selectedHotel = realHotels[0];
                if (itinerary.tags.includes('Luxury') && realHotels.length > 1) selectedHotel = realHotels[1];

                const nightlyPrice = Math.round(selectedHotel.price);

                let priceDiffAccumulator = 0;

                newItinerary.days.forEach((day: any) => {
                    if (day.city === firstCity) {
                        const oldPrice = day.accommodation.price;

                        day.accommodation = {
                            ...day.accommodation,
                            name: selectedHotel.name,
                            price: nightlyPrice,
                            rating: selectedHotel.rating,
                            image: selectedHotel.image || day.accommodation.image,
                            bookingLink: selectedHotel.link || day.accommodation.bookingLink,
                            isRealData: true
                        };

                        priceDiffAccumulator += (day.accommodation.price - oldPrice);
                    }
                });

                newItinerary.totalPrice += priceDiffAccumulator;
            }
        } catch (e) {
            console.error("Failed to enrich hotels:", e);
        }

        return newItinerary;
    });

    return Promise.all(enrichedPromises);
}
