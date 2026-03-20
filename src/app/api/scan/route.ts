import { NextRequest, NextResponse } from "next/server";
import { scrapeAll } from "@/lib/scrapers";
import { analyzePostsAndGenerateIdeas } from "@/lib/ai/analyze";
import { createAdminClient } from "@/lib/supabase/admin";
import { Idea } from "@/types";

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

async function runScan() {
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

  return NextResponse.json({
    success: true,
    scan_date: today,
    posts_analyzed: posts.length,
    sources_scraped: sourcesScraped,
    ideas_count: insertedIdeas?.length ?? 0,
  });
}

// Vercel Cron uses GET
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return await runScan();
  } catch (error) {
    console.error("Scan failed:", error);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}

// Manual trigger uses POST
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return await runScan();
  } catch (error) {
    console.error("Scan failed:", error);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
