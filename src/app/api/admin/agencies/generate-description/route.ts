import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

export async function POST(request: NextRequest) {
    try {
        const supabase = createServerSupabaseClient();

        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "AI service not configured" },
                { status: 500 }
            );
        }

        const { title, category, location } = await request.json();

        if (!title || !category) {
            return NextResponse.json(
                { error: "Title and category are required" },
                { status: 400 }
            );
        }

        const prompt = `Write a professional and compelling travel agency description for "${title}".
Category: ${category}
Location: ${location || "Global"}

Requirements:
- Highlight their expertise in ${category}.
- Mention they are a verified partner on TravelAgencies.World.
- Make it around 3-4 sentences.
- Be persuasive but professional.
- Use a friendly tone.
- Do not use placeholders like [Agency Name].
- Use the provided name "${title}" naturally.
- Language: English (unless the name or location clearly implies another language, but default to English).`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert copywriter for a global travel directory. Your goal is to write high-converting agency descriptions."
                    },
                    { role: "user", content: prompt },
                ],
                max_tokens: 300,
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "OpenAI API error");
        }

        const description = data.choices[0].message.content.trim();

        return NextResponse.json({ description });
    } catch (error: any) {
        console.error("AI Generation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
