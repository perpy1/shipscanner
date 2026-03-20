import { ScrapedPost } from "@/types";

const SUBREDDITS = [
  "SaaS",
  "SideProject",
  "Entrepreneur",
  "startups",
  "programming",
  "webdev",
];

const PAIN_KEYWORDS = [
  "frustrated",
  "annoying",
  "wish there was",
  "looking for",
  "need a tool",
  "hate that",
  "why isn't there",
  "anyone know",
  "alternative to",
  "struggling with",
  "pain point",
  "waste time",
  "manual process",
  "should exist",
  "would pay for",
];

export async function scrapeReddit(): Promise<ScrapedPost[]> {
  const posts: ScrapedPost[] = [];

  for (const subreddit of SUBREDDITS) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=50`,
        {
          headers: {
            "User-Agent": "SideQuest/1.0 (app idea scanner)",
          },
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const children = data?.data?.children ?? [];

      for (const child of children) {
        const post = child.data;
        if (!post || post.stickied) continue;

        const text = `${post.title} ${post.selftext || ""}`.toLowerCase();
        const hasPainKeyword = PAIN_KEYWORDS.some((kw) => text.includes(kw));

        if (hasPainKeyword || post.score > 50) {
          posts.push({
            title: post.title,
            url: `https://reddit.com${post.permalink}`,
            body: (post.selftext || "").slice(0, 1000),
            score: post.score,
            comments: post.num_comments,
            platform: "reddit",
            subreddit,
            created_at: new Date(post.created_utc * 1000).toISOString(),
          });
        }
      }
    } catch (err) {
      console.error(`Failed to scrape r/${subreddit}:`, err);
    }
  }

  return posts;
}
