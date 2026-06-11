

import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.customer_name || !body.customer_phone || !body.delivery_address || !body.items?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Forward to Google Apps Script
    // Server-side fetch has NO CORS restrictions
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Apps Script sometimes returns HTML on error
      console.error("Apps Script response:", text);
      return NextResponse.json(
        { success: false, error: "Apps Script returned invalid response." },
        { status: 500 }
      );
    }

    if (!result.success) {
      throw new Error(result.error || "Apps Script failed.");
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: any) {
    console.error("Order API error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}