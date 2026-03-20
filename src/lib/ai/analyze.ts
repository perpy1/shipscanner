import Anthropic from "@anthropic-ai/sdk";
import { Idea, ScrapedPost } from "@/types";

function getClient() {
  return new Anthropic();
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

  const response = await getClient().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `You are SideQuest, an AI that analyzes online discussions to find real pain points and generate validated app ideas for indie hackers.

Below are ${topPosts.length} posts from Reddit and Hacker News. Analyze them for:
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
- source_platform: one of "reddit" | "hackernews" | "producthunt"

POSTS:
${postsText}

Respond with ONLY the JSON array, no markdown formatting.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON — handle potential markdown wrapping
  const jsonStr = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(jsonStr);
  } catch {
    console.error("Failed to parse AI response as JSON:", jsonStr.slice(0, 200));
    throw new Error("AI returned invalid JSON");
  }
}
