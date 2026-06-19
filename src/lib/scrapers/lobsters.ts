import { ScrapedPost } from "@/types";

interface LobsterStory {
  title?: string;
  url?: string;
  short_id_url?: string;
  comments_url?: string;
  description_plain?: string;
  description?: string;
  score?: number;
  comment_count?: number;
  created_at?: string;
}

const stripHtml = (s: string) =>
  s.replace(/<[^>]+>/g, " ").replace(/&#?\w+;/g, " ").replace(/\s+/g, " ").trim();

// Lobsters: HN-style tech community. The "ask" and "show" tags surface
// requests and self-built tools — the analysis step filters the social noise.
const TAGS = ["ask", "show"];

export async function scrapeLobsters(): Promise<ScrapedPost[]> {
  const posts: ScrapedPost[] = [];

  for (const tag of TAGS) {
    try {
      const res = await fetch(`https://lobste.rs/t/${tag}.json`, {
        headers: { "User-Agent": "sidequest-scanner" },
      });
      if (!res.ok) {
        console.warn(`[scrape] lobsters "${tag}": HTTP ${res.status}`);
        continue;
      }

      const stories: LobsterStory[] = await res.json();
      for (const s of stories) {
        if (!s.title || (s.score ?? 0) < 2) continue;
        // Link to the discussion, not the external URL — that's where the need lives.
        const url = s.comments_url || s.short_id_url || s.url;
        if (!url) continue;
        posts.push({
          title: s.title,
          url,
          body: stripHtml(s.description_plain || s.description || "").slice(0, 1000),
          score: s.score || 0,
          comments: s.comment_count || 0,
          platform: "lobsters",
          created_at: s.created_at || new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(`[scrape] lobsters "${tag}": failed`, err);
    }
  }

  // Dedupe by URL across tags
  const seen = new Set<string>();
  const deduped = posts.filter((p) => (seen.has(p.url) ? false : (seen.add(p.url), true)));

  console.log(`[scrape] lobsters: ${deduped.length} posts`);
  return deduped;
}
