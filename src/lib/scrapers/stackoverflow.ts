import { ScrapedPost } from "@/types";

interface SOItem {
  title?: string;
  link?: string;
  body?: string;
  score?: number;
  answer_count?: number;
  creation_date?: number;
}

const stripHtml = (s: string) =>
  s.replace(/<[^>]+>/g, " ").replace(/&#?\w+;/g, " ").replace(/\s+/g, " ").trim();

// Recently-asked, upvoted, still-unanswered questions = current unmet needs.
export async function scrapeStackOverflow(): Promise<ScrapedPost[]> {
  const fromdate = Math.floor(Date.now() / 1000) - 90 * 86400; // last 90 days
  const key = process.env.STACKEXCHANGE_KEY ? `&key=${process.env.STACKEXCHANGE_KEY}` : "";
  const url =
    `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=votes&accepted=False` +
    `&fromdate=${fromdate}&site=stackoverflow&pagesize=50&filter=withbody${key}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[scrape] stackoverflow: HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    const items: SOItem[] = data?.items ?? [];

    const posts: ScrapedPost[] = items
      .filter((q) => (q.score ?? 0) >= 2 && q.title && q.link)
      .map((q) => ({
        title: stripHtml(q.title!),
        url: q.link!,
        body: stripHtml(q.body || "").slice(0, 1000),
        score: q.score || 0,
        comments: q.answer_count || 0,
        platform: "stackoverflow",
        created_at: q.creation_date
          ? new Date(q.creation_date * 1000).toISOString()
          : new Date().toISOString(),
      }));

    console.log(`[scrape] stackoverflow: ${posts.length} posts`);
    return posts;
  } catch (err) {
    console.error("[scrape] stackoverflow: failed", err);
    return [];
  }
}
