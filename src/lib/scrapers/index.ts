import { ScrapedPost } from "@/types";
import { scrapeReddit } from "./reddit";
import { scrapeHackerNews } from "./hackernews";
import { scrapeProductHunt } from "./producthunt";
import { scrapeStackOverflow } from "./stackoverflow";
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
    { name: "stackoverflow", fn: scrapeStackOverflow },
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

  // Sort by score descending
  deduped.sort((a, b) => b.score - a.score);

  // Make dead sources loud — a 0 here means that source is broken, not quiet.
  const dead = Object.entries(breakdown).filter(([, n]) => n === 0).map(([name]) => name);
  console.log(
    `[scrape] summary: ${JSON.stringify(breakdown)} → ${deduped.length} unique posts · ${sourcesScraped}/${sources.length} sources live` +
      (dead.length ? ` · DEAD: ${dead.join(", ")}` : "")
  );

  return { posts: deduped, sourcesScraped, breakdown };
}
