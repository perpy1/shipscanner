import { NextRequest, NextResponse } from "next/server";

// ── Your Substack ──
// Subscribers are added directly to this publication. Change the handle here
// (or set SUBSTACK_DOMAIN in the env) if the newsletter ever moves.
const SUBSTACK_DOMAIN = process.env.SUBSTACK_DOMAIN || "gabevibes.substack.com";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    // Forward to Substack's free-subscribe endpoint (server-side to avoid CORS).
    const res = await fetch(`https://${SUBSTACK_DOMAIN}/api/v1/free`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        first_url: `https://${SUBSTACK_DOMAIN}/subscribe`,
        first_referrer: "https://sidequest-gray.vercel.app",
        current_url: `https://${SUBSTACK_DOMAIN}/subscribe`,
        source: "embed",
        domain: SUBSTACK_DOMAIN,
      }),
    });

    if (!res.ok) {
      console.error("Substack subscribe failed:", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ error: "Subscription failed — try again in a moment." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
