import { ScrapedPost } from "@/types";

// Queries that surface "I wish this existed" / unmet-need signal in issues.
const QUERIES = [
  "type:issue state:open label:enhancement",
  '"it would be great if" in:body type:issue state:open',
  '"is there a way to" in:body type:issue state:open',
];

interface GHItem {
  title?: string;
  html_url?: string;
  body?: string | null;
  comments?: number;
  created_at?: string;
  reactions?: { total_count?: number };
}

export async function scrapeGitHub(): Promise<ScrapedPost[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    "User-Agent": "sidequest-scanner",
    Accept: "application/vnd.github+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  else console.warn("[scrape] github: no GITHUB_TOKEN — using unauthenticated limit (10 req/min)");

  const posts: ScrapedPost[] = [];

  for (const q of QUERIES) {
    try {
      const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=reactions&order=desc&per_page=30`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        console.warn(`[scrape] github "${q.slice(0, 28)}…": HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      for (const it of (data?.items ?? []) as GHItem[]) {
        if (!it.html_url) continue;
        posts.push({
          title: it.title || "",
          url: it.html_url,
          body: (it.body || "").slice(0, 1000),
          score: it.reactions?.total_count || 0,
          comments: it.comments || 0,
          platform: "github",
          created_at: it.created_at || new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(`[scrape] github "${q.slice(0, 28)}…": failed`, err);
    }
  }

  // Dedupe by URL across queries
  const seen = new Set<string>();
  const deduped = posts.filter((p) => (seen.has(p.url) ? false : (seen.add(p.url), true)));

  console.log(`[scrape] github: ${deduped.length} posts`);
  return deduped;
}
