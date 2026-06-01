import { ScrapedPost } from "@/types";

const PH_ENDPOINT = "https://api.producthunt.com/v2/api/graphql";

// Top recent launches by votes — market signal for what's getting traction.
const QUERY = `
query RecentPosts {
  posts(order: VOTES, first: 50) {
    edges {
      node {
        id
        name
        tagline
        description
        votesCount
        commentsCount
        url
        createdAt
      }
    }
  }
}`;

interface PHNode {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  votesCount: number | null;
  commentsCount: number | null;
  url: string | null;
  createdAt: string | null;
}

interface PHResponse {
  data?: { posts?: { edges?: { node: PHNode }[] } };
  errors?: { message: string }[];
}

export async function scrapeProductHunt(): Promise<ScrapedPost[]> {
  const token = process.env.PRODUCTHUNT_TOKEN;
  if (!token) {
    console.warn("[scrape] producthunt: skipped — PRODUCTHUNT_TOKEN not set");
    return [];
  }

  try {
    const res = await fetch(PH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: QUERY }),
    });

    if (!res.ok) {
      console.error(`[scrape] producthunt: HTTP ${res.status}`);
      return [];
    }

    const json: PHResponse = await res.json();
    if (json.errors?.length) {
      console.error("[scrape] producthunt: GraphQL errors", json.errors.map((e) => e.message).join("; "));
      return [];
    }

    const edges = json.data?.posts?.edges ?? [];
    const posts: ScrapedPost[] = edges.map(({ node: n }) => ({
      title: n.name || "",
      url: n.url || `https://www.producthunt.com/posts/${n.id}`,
      body: [n.tagline, n.description].filter(Boolean).join(" — ").slice(0, 1000),
      score: n.votesCount || 0,
      comments: n.commentsCount || 0,
      platform: "producthunt",
      created_at: n.createdAt || new Date().toISOString(),
    }));

    console.log(`[scrape] producthunt: ${posts.length} posts`);
    return posts;
  } catch (err) {
    console.error("[scrape] producthunt: failed", err);
    return [];
  }
}
