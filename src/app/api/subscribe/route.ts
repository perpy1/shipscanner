import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Use Supabase if configured, otherwise succeed silently
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabase = createAdminClient();

      const { error } = await supabase
        .from("email_subscribers")
        .upsert({ email, is_active: true }, { onConflict: "email" });

      if (error) {
        console.error("Subscribe error:", error);
        return NextResponse.json(
          { error: "Failed to subscribe" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
