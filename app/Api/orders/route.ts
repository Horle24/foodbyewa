// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   FOODBYEWA — Orders API Route
//   app/api/orders/route.ts
//   Receives order from CartDrawer →
//   forwards to Google Apps Script →
//   saves to Google Sheet
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { customer_name, customer_phone, delivery_address, items } = body;

    if (!customer_name || !customer_phone || !delivery_address || !items?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields." },
        { status: 400 }
      );
    }

    // Forward order to Google Apps Script
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Google Script failed.");
    }

    return NextResponse.json(
      { success: true, message: "Order saved to sheet!" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Order API error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}