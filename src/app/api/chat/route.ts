import { NextRequest, NextResponse } from "next/server";

// Using Google Gemini (FREE - 1500 requests/day)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `You are a helpful travel assistant for TravelAgencies.World - the world's largest directory of travel agencies with 2670+ verified agencies worldwide.

Your role is to:
- Help users find travel agencies for their trips
- Answer questions about travel destinations
- Provide tips about Morocco, CAN 2025, and popular travel destinations
- Guide users to use the website features (search, filter by country, ratings)
- Be friendly, concise, and helpful

Key information:
- Website: TravelAgencies.World
- We have agencies in Morocco, France, USA, Canada, UK, UAE and more
- Users can filter by country, city, category, and rating
- CAN 2025 (Africa Cup of Nations) is happening in Morocco - great time to visit!
- We offer free agency listings and promotion packages for agencies

IMPORTANT - To add an agency to the platform:
- Contact us on WhatsApp: +33 7 45 07 56 68
- Or email: contact@travelagencies.world
- Always provide these contact details when someone asks about adding their agency or listing their business

Keep responses short (2-3 sentences max) unless the user asks for detailed information.
Respond in the same language the user writes in (French, English, Arabic, etc.).`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "Chat service is not configured. Please add GEMINI_API_KEY to environment variables." },
        { status: 500 }
      );
    }

    // Convert messages to Gemini format
    const geminiMessages = messages.slice(-10).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Add system prompt as first user message if needed
    const contents = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "Understood! I'm ready to help users find travel agencies and answer questions about travel. How can I assist you today?" }] },
      ...geminiMessages,
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        }),
      }
    );

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Gemini API error:", response.status, responseData);
      return NextResponse.json(
        { error: responseData?.error?.message || `Gemini API error: ${response.status}` },
        { status: 500 }
      );
    }

    const assistantMessage = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";

    return NextResponse.json({ message: assistantMessage });
  } catch (error: any) {
    console.error("Chat error:", error?.message || error);
    return NextResponse.json(
      { error: `Server error: ${error?.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
