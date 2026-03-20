import { ScrapedPost } from "@/types";
import { scrapeReddit } from "./reddit";
import { scrapeHackerNews } from "./hackernews";
import { scrapeProductHunt } from "./producthunt";

export async function scrapeAll(): Promise<{
  posts: ScrapedPost[];
  sourcesScraped: number;
}> {
  const results = await Promise.allSettled([
    scrapeReddit(),
    scrapeHackerNews(),
    scrapeProductHunt(),
  ]);

  const allPosts: ScrapedPost[] = [];
  let sourcesScraped = 0;

  for (const result of results) {
    if (result.status === "fulfilled") {
      allPosts.push(...result.value);
      if (result.value.length > 0) sourcesScraped++;
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  const deduped = allPosts.filter((post) => {
    if (seen.has(post.url)) return false;
    seen.add(post.url);
    return true;
  });

  // Sort by score descending
  deduped.sort((a, b) => b.score - a.score);

  return { posts: deduped, sourcesScraped };
}
