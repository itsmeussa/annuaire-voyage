import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY is not configured");
      return NextResponse.json(
        { error: "Newsletter service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Add contact to Brevo
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        listIds: [3], // TravelAgencies Newsletter list
        updateEnabled: true,
      }),
    });

    const responseData = await response.json().catch(() => ({}));

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Successfully subscribed! 🎉" });
    }

    // Handle duplicate email (already subscribed)
    if (response.status === 400) {
      if (responseData.code === "duplicate_parameter") {
        return NextResponse.json({ success: true, message: "You're already subscribed! 🎉" });
      }
      console.error("Brevo API error:", responseData);
      return NextResponse.json(
        { error: responseData.message || "Failed to subscribe" },
        { status: 400 }
      );
    }

    console.error("Brevo API error:", response.status, responseData);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
