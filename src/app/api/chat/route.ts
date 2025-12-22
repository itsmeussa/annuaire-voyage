import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

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

    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return NextResponse.json(
        { error: "Chat service is not configured. Please add OPENAI_API_KEY to environment variables." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, responseData);
      return NextResponse.json(
        { error: responseData?.error?.message || `OpenAI API error: ${response.status}` },
        { status: 500 }
      );
    }

    const assistantMessage = responseData?.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

    return NextResponse.json({ message: assistantMessage });
  } catch (error: any) {
    console.error("Chat error:", error?.message || error);
    return NextResponse.json(
      { error: `Server error: ${error?.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
