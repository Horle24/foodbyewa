

import { NextRequest, NextResponse } from "next/server";

// Use server-only env var (no NEXT_PUBLIC_ prefix)
// Falls back to NEXT_PUBLIC_ if server-only not set
const SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL ||
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📦 Order received:", body.customer_name, "| Items:", body.items?.length);

    // Validate
    if (!body.customer_name || !body.customer_phone || !body.delivery_address || !body.items?.length) {
      console.error("❌ Validation failed — missing fields");
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!SCRIPT_URL) {
      console.error("❌ SCRIPT_URL not set in environment");
      return NextResponse.json(
        { success: false, error: "Server config error — script URL missing." },
        { status: 500 }
      );
    }

    console.log("📤 Sending to Apps Script:", SCRIPT_URL.slice(0, 60) + "...");

    // Server-side fetch — no CORS restrictions
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
      redirect: "follow", // Important — Apps Script uses redirects
    });

    console.log("📨 Apps Script status:", response.status);

    const text = await response.text();
    console.log("📨 Apps Script response:", text.slice(0, 200));

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      console.error("❌ Could not parse Apps Script response:", text.slice(0, 300));
      // If Apps Script returned something but we can't parse it,
      // the order likely saved — don't block WhatsApp
      return NextResponse.json({ success: true, warning: "Saved but response unclear" });
    }

    if (!result.success) {
      console.error("❌ Apps Script error:", result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    console.log("✅ Order saved to Google Sheet!");
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: any) {
    console.error("❌ Order API error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}