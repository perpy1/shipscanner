import Anthropic from "@anthropic-ai/sdk";
import { Idea, ScrapedPost } from "@/types";

function getClient() {
  return new Anthropic();
}

/**
 * Fetch recent idea names + pain points from DB to prevent duplicates.
 * Returns a formatted string for the prompt, or empty string if unavailable.
 */
async function getRecentIdeasContext(): Promise<string> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return "";
    }

    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    // Fetch ideas from the last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const cutoff = fourteenDaysAgo.toISOString().split("T")[0];

    const { data } = await supabase
      .from("ideas")
      .select("name, one_liner, pain_point, category")
      .gte("scan_date", cutoff)
      .order("scan_date", { ascending: false });

    if (!data || data.length === 0) return "";

    const lines = data.map(
      (idea: { name: string; one_liner: string; pain_point: string; category: string }) =>
        `- "${idea.name}" (${idea.category}): ${idea.pain_point}`
    );

    return `\n\nPREVIOUSLY GENERATED IDEAS (last 14 days) — DO NOT generate ideas that overlap with these in concept, even if the name differs:\n${lines.join("\n")}`;
  } catch {
    return "";
  }
}

export async function analyzePostsAndGenerateIdeas(
  posts: ScrapedPost[]
): Promise<Omit<Idea, "id" | "upvotes" | "created_at" | "scan_date">[]> {
  // Take top 100 posts by score for the prompt
  const topPosts = posts.slice(0, 100);

  const postsText = topPosts
    .map(
      (p, i) =>
        `[${i + 1}] (${p.platform}${p.subreddit ? ` r/${p.subreddit}` : ""}) "${p.title}" — score: ${p.score}, comments: ${p.comments}\n${p.body ? p.body.slice(0, 300) : "(no body)"}\nURL: ${p.url}`
    )
    .join("\n\n");

  // Fetch recent ideas for deduplication context
  const recentIdeasContext = await getRecentIdeasContext();

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `You are SideQuest, an AI that analyzes online discussions to find real pain points and generate validated app ideas for indie hackers.

Below are ${topPosts.length} posts from Hacker News, Stack Overflow, GitHub issues, App Store reviews, Reddit, and Product Hunt. Analyze them for:
- Recurring complaints and frustrations
- Feature requests that existing tools don't address
- Manual processes people want automated
- Gaps in the market

Generate exactly 10 app ideas. Each idea must:
- Solve a REAL pain point found in the posts
- Be buildable by a solo developer
- Have a clear monetization path
- Cover a diverse spread of categories — aim for at least 6 different categories across the 10 ideas
- Include a mix of difficulties (some Weekend projects, some Week, some Month)

CRITICAL DEDUPLICATION RULES:
- Each idea must solve a FUNDAMENTALLY DIFFERENT problem. Two ideas that both "help developers write better docs" are duplicates even if one is a CLI and the other is a SaaS.
- Focus on the UNDERLYING PAIN POINT being unique, not just the product name or format.
- Before finalizing, review all 10 ideas and ensure no two solve the same core problem.
${recentIdeasContext}

Return a JSON array with exactly 10 objects. Each object must have these fields:
- name: string (catchy product name)
- one_liner: string (one sentence pitch)
- description: string (2-3 sentences explaining the product)
- category: one of "SaaS" | "Developer Tool" | "Marketplace" | "AI/ML" | "Productivity" | "Social" | "Fintech" | "Health" | "Education" | "E-commerce"
- difficulty: one of "Weekend" | "Week" | "Month"
- viral_potential: number 1-5
- pain_point: string (the specific problem from the posts)
- target_audience: string
- monetization: string (pricing strategy)
- source_urls: string[] (1-3 URLs from the posts that inspired this idea)
- source_platform: one of "reddit" | "hackernews" | "producthunt" | "stackoverflow" | "github" | "appstore" (match the platform of the post that inspired the idea)

POSTS:
${postsText}

Respond with ONLY the JSON array, no markdown formatting.`,
      },
    ],
  });

  // Validate response structure
  if (!response.content || response.content.length === 0) {
    throw new Error("AI returned empty response");
  }

  const textBlock = response.content[0];
  if (textBlock.type !== "text" || !textBlock.text) {
    throw new Error("AI returned non-text response");
  }

  // Parse JSON — handle potential markdown wrapping
  const jsonStr = textBlock.text
    .replace(/```json?\n?/g, "")
    .replace(/```/g, "")
    .trim();

  let ideas: Omit<Idea, "id" | "upvotes" | "created_at" | "scan_date">[];

  try {
    ideas = JSON.parse(jsonStr);
  } catch {
    console.error(
      "Failed to parse AI response as JSON:",
      jsonStr.slice(0, 200)
    );
    throw new Error("AI returned invalid JSON");
  }

  // Validate array and count
  if (!Array.isArray(ideas)) {
    throw new Error("AI response is not an array");
  }

  if (ideas.length === 0) {
    throw new Error("AI returned zero ideas");
  }

  // Validate required fields on each idea
  const requiredFields = [
    "name",
    "one_liner",
    "description",
    "category",
    "difficulty",
    "viral_potential",
    "pain_point",
    "target_audience",
    "monetization",
    "source_urls",
    "source_platform",
  ];

  for (const idea of ideas) {
    for (const field of requiredFields) {
      if (!(field in idea) || idea[field as keyof typeof idea] === undefined) {
        console.error(`Idea "${idea.name || "unknown"}" missing field: ${field}`);
        throw new Error(`AI idea missing required field: ${field}`);
      }
    }

    // Clamp viral_potential to 1-5
    if (typeof idea.viral_potential === "number") {
      idea.viral_potential = Math.max(1, Math.min(5, Math.round(idea.viral_potential)));
    } else {
      idea.viral_potential = 3;
    }

    // Ensure source_urls is an array
    if (!Array.isArray(idea.source_urls)) {
      idea.source_urls = [];
    }
  }

  return ideas;
}
