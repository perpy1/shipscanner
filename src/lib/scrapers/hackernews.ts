import { ScrapedPost } from "@/types";

const QUERIES = ["Ask HN", "Show HN", "looking for", "wish there was"];

export async function scrapeHackerNews(): Promise<ScrapedPost[]> {
  const posts: ScrapedPost[] = [];

  for (const query of QUERIES) {
    try {
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&numericFilters=points>5&hitsPerPage=30`
      );

      if (!res.ok) continue;

      const data = await res.json();
      const hits = data?.hits ?? [];

      for (const hit of hits) {
        // Deduplicate by objectID
        if (posts.some((p) => p.url.includes(hit.objectID))) continue;

        posts.push({
          title: hit.title || "",
          url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          body: (hit.story_text || "").slice(0, 1000),
          score: hit.points || 0,
          comments: hit.num_comments || 0,
          platform: "hackernews",
          created_at: hit.created_at || new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(`Failed to scrape HN for "${query}":`, err);
    }
  }

  return posts;
}
