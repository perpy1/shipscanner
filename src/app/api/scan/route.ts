import { NextRequest, NextResponse } from "next/server";
import { scrapeAll } from "@/lib/scrapers";
import { analyzePostsAndGenerateIdeas } from "@/lib/ai/analyze";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDailyDigest } from "@/lib/email/send";
import { Idea } from "@/types";

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Scrape all sources
    const { posts, sourcesScraped } = await scrapeAll();

    if (posts.length === 0) {
      return NextResponse.json({ success: false, error: "No posts scraped" });
    }

    // 2. Analyze with AI
    const ideas = await analyzePostsAndGenerateIdeas(posts);
    const today = new Date().toISOString().split("T")[0];

    // 3. Store in Supabase
    const supabase = createAdminClient();

    // Insert ideas
    const ideasToInsert = ideas.map((idea: Omit<Idea, "id" | "upvotes" | "created_at" | "scan_date">) => ({
      ...idea,
      upvotes: 0,
      scan_date: today,
    }));

    const { data: insertedIdeas, error: ideasError } = await supabase
      .from("ideas")
      .insert(ideasToInsert)
      .select();

    if (ideasError) {
      console.error("Failed to insert ideas:", ideasError);
      return NextResponse.json(
        { error: "Failed to store ideas" },
        { status: 500 }
      );
    }

    // Log the scan
    await supabase.from("daily_scans").insert({
      scan_date: today,
      ideas_count: ideas.length,
      sources_scraped: sourcesScraped,
      posts_analyzed: posts.length,
    });

    // 4. Send email digest
    if (process.env.RESEND_API_KEY) {
      const { data: subscribers } = await supabase
        .from("email_subscribers")
        .select("email")
        .eq("is_active", true);

      if (subscribers && subscribers.length > 0) {
        const emails = subscribers.map((s: { email: string }) => s.email);
        await sendDailyDigest(emails, insertedIdeas as Idea[], today);
      }
    }

    return NextResponse.json({
      success: true,
      scan_date: today,
      posts_analyzed: posts.length,
      sources_scraped: sourcesScraped,
      ideas_count: insertedIdeas?.length ?? 0,
    });
  } catch (error) {
    console.error("Scan failed:", error);
    return NextResponse.json(
      { error: "Scan failed" },
      { status: 500 }
    );
  }
}
