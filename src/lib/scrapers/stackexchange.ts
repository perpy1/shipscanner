import { ScrapedPost, Platform } from "@/types";

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

// Stack Exchange sites worth mining for unmet needs. Each is the same API, so we
// loop one config. Recommendation sites (softwarerecs/webapps) are pure build
// signal — every question is "is there a tool that does X" — but they're small
// communities, so we keep the score bar low and don't require an unanswered Q.
const SITES: {
  site: string;
  platform: Platform;
  minScore: number;
  unansweredOnly: boolean;
}[] = [
  // SO: recently-asked, upvoted, still-unanswered questions = current unmet needs.
  { site: "stackoverflow", platform: "stackoverflow", minScore: 2, unansweredOnly: true },
  { site: "softwarerecs", platform: "softwarerecs", minScore: 1, unansweredOnly: false },
  { site: "webapps", platform: "webapps", minScore: 1, unansweredOnly: false },
];

export async function scrapeStackExchange(): Promise<ScrapedPost[]> {
  const fromdate = Math.floor(Date.now() / 1000) - 90 * 86400; // last 90 days
  const key = process.env.STACKEXCHANGE_KEY ? `&key=${process.env.STACKEXCHANGE_KEY}` : "";
  const all: ScrapedPost[] = [];

  for (const { site, platform, minScore, unansweredOnly } of SITES) {
    try {
      const accepted = unansweredOnly ? "&accepted=False" : "";
      const url =
        `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=votes${accepted}` +
        `&fromdate=${fromdate}&site=${site}&pagesize=50&filter=withbody${key}`;

      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[scrape] ${platform}: HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const items: SOItem[] = data?.items ?? [];

      const posts: ScrapedPost[] = items
        .filter((q) => (q.score ?? 0) >= minScore && q.title && q.link)
        .map((q) => ({
          title: stripHtml(q.title!),
          url: q.link!,
          body: stripHtml(q.body || "").slice(0, 1000),
          score: q.score || 0,
          comments: q.answer_count || 0,
          platform,
          created_at: q.creation_date
            ? new Date(q.creation_date * 1000).toISOString()
            : new Date().toISOString(),
        }));

      console.log(`[scrape] ${platform}: ${posts.length} posts`);
      all.push(...posts);
    } catch (err) {
      console.error(`[scrape] ${platform}: failed`, err);
    }
  }

  return all;
}
