import { ScrapedPost } from "@/types";
import { scrapeReddit } from "./reddit";
import { scrapeHackerNews } from "./hackernews";
import { scrapeProductHunt } from "./producthunt";
import { scrapeStackExchange } from "./stackexchange";
import { scrapeLobsters } from "./lobsters";
import { scrapeGitHub } from "./github";
import { scrapeAppStore } from "./appstore";

export interface ScrapeResult {
  posts: ScrapedPost[];
  sourcesScraped: number;
  /** Per-source post counts, e.g. { reddit: 0, hackernews: 84, producthunt: 50 } */
  breakdown: Record<string, number>;
}

export async function scrapeAll(): Promise<ScrapeResult> {
  const sources: { name: string; fn: () => Promise<ScrapedPost[]> }[] = [
    { name: "reddit", fn: scrapeReddit },
    { name: "hackernews", fn: scrapeHackerNews },
    { name: "producthunt", fn: scrapeProductHunt },
    { name: "stackexchange", fn: scrapeStackExchange },
    { name: "lobsters", fn: scrapeLobsters },
    { name: "github", fn: scrapeGitHub },
    { name: "appstore", fn: scrapeAppStore },
  ];

  const results = await Promise.allSettled(sources.map((s) => s.fn()));

  const allPosts: ScrapedPost[] = [];
  const breakdown: Record<string, number> = {};
  let sourcesScraped = 0;

  results.forEach((result, i) => {
    const name = sources[i].name;
    if (result.status === "fulfilled") {
      breakdown[name] = result.value.length;
      if (result.value.length > 0) sourcesScraped++;
      allPosts.push(...result.value);
    } else {
      breakdown[name] = 0;
      console.error(`[scrape] ${name}: rejected —`, result.reason);
    }
  });

  // Deduplicate by URL
  const seen = new Set<string>();
  const deduped = allPosts.filter((post) => {
    if (seen.has(post.url)) return false;
    seen.add(post.url);
    return true;
  });

  // Interleave by source instead of a global score sort. Sources use wildly
  // different score scales (HN points in the hundreds vs. SoftwareRecs votes of
  // 1–2), so a global sort lets a couple sources crowd the rest out of the
  // downstream top-N cut. Round-robin across per-source score-sorted queues so
  // every live source is represented near the top.
  const byPlatform = new Map<string, ScrapedPost[]>();
  for (const post of deduped) {
    const list = byPlatform.get(post.platform) ?? [];
    list.push(post);
    byPlatform.set(post.platform, list);
  }
  for (const list of byPlatform.values()) list.sort((a, b) => b.score - a.score);

  const queues = [...byPlatform.values()];
  const interleaved: ScrapedPost[] = [];
  for (let i = 0; interleaved.length < deduped.length; i++) {
    for (const q of queues) if (i < q.length) interleaved.push(q[i]);
  }

  // Make dead sources loud — a 0 here means that source is broken, not quiet.
  const dead = Object.entries(breakdown).filter(([, n]) => n === 0).map(([name]) => name);
  console.log(
    `[scrape] summary: ${JSON.stringify(breakdown)} → ${deduped.length} unique posts · ${sourcesScraped}/${sources.length} sources live` +
      (dead.length ? ` · DEAD: ${dead.join(", ")}` : "")
  );

  return { posts: interleaved, sourcesScraped, breakdown };
}
