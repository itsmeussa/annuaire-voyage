import { NextRequest, NextResponse } from "next/server";

// Using OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const SYSTEM_PROMPT = `You are "TravelBot", a premium and sophisticated travel concierge for TravelAgencies.World. 
Your tone is professional, welcoming, and knowledgeable.

CORE KNOWLEDGE:
- Platform: TravelAgencies.World (4000+ verified agencies).
- Key Regions: Morocco, France, Spain, USA, Canada, UK, UAE.
- Event: CAN 2025 (Africa Cup of Nations) is a major focus in Morocco.

STYLE GUIDELINES:
- **STRICTLY REACTIVE:** Never introduce yourself or an agency unprompted. 
- **NO SALES PITCH:** Only provide details about an agency if specifically asked (e.g., "What tours do they have?").
- **CONCISE:** Keep responses to 1-2 sentences unless the user asks for more detail.
- **NO REPETITION:** Do not repeat the agency name or location unless necessary for the answer.
- **LANGUAGE:** Stick to English unless the user writes in another language.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

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

    // Build context-aware system prompt
    let systemPrompt = SYSTEM_PROMPT;

    if (context) {
      const servicesText = context.services?.length
        ? `\nAUTHENTIC SERVICES (Use ONLY these): ${context.services.join(", ")}`
        : "\nSERVICES: No specific services listed in our database yet for this agency.";

      const experiencesText = context.experiences?.length
        ? `\nAUTHENTIC EXPERIENCES (Use ONLY these):\n${context.experiences.map((exp: any) =>
          `  - ${exp.title}${exp.description ? `: ${exp.description}` : ""}${exp.price ? ` (${exp.price} ${exp.currency || "USD"})` : ""}`
        ).join("\n")}`
        : "\nEXPERIENCES: No specific tour experiences listed in our database yet.";

      const contactText = context.contact
        ? `\nOFFICIAL CONTACT: ${context.contact.phone || "Not listed"} | ${context.contact.website || "No website listed"}`
        : "";

      systemPrompt = `You are a dedicated Premium Concierge for "${context.agencyName}", located in ${context.location}.
      
RULES FOR THIS AGENCY:
1. SHARE information about services and experiences ONLY when asked.
2. IF the user asks "what do you do?" or "tell me about this agency", give a brief 1-sentence overview and wait for further questions.
3. IF the list is empty (None listed), do NOT invent tours.
4. If asked about contact details, use ONLY the OFFICIAL CONTACT listed below.
5. Maintain a high-end, assistive tone.

CONTEXT DATA FOR ${context.agencyName}:
${servicesText}
${experiencesText}
${contactText}

IMPORTANT: Stick to the user's language. Stay concise.`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10),
        ],
        max_tokens: 400,
        temperature: 0.5,
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
