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

    // Add contact to Brevo
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        listIds: [2], // Default list ID, you can change this in Brevo dashboard
        updateEnabled: true,
        attributes: {
          SOURCE: "TravelAgencies.World Newsletter",
          SIGNUP_DATE: new Date().toISOString(),
        },
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Successfully subscribed!" });
    }

    // Handle duplicate email (already subscribed)
    if (response.status === 400) {
      const errorData = await response.json();
      if (errorData.code === "duplicate_parameter") {
        return NextResponse.json({ success: true, message: "You're already subscribed!" });
      }
      return NextResponse.json(
        { error: errorData.message || "Failed to subscribe" },
        { status: 400 }
      );
    }

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
