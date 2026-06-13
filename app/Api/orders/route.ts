import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL ||
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.customer_name || !body.customer_phone || !body.delivery_address || !body.items?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!SCRIPT_URL) {
      return NextResponse.json(
        { success: false, error: "Script URL not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Apps Script returned something unparseable
      // but order likely saved — don't block WhatsApp
      return NextResponse.json({ success: true });
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}