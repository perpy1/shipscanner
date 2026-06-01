import { ScrapedPost } from "@/types";

// Popular apps to mine for complaints. 1–2★ reviews = missing features / pain
// = "build a better X" signal. Bad IDs are skipped gracefully.
const APPS: { id: string; name: string }[] = [
  { id: "1232780281", name: "Notion" },
  { id: "572688855", name: "Todoist" },
  { id: "461504587", name: "Trello" },
  { id: "618783545", name: "Slack" },
  { id: "570060128", name: "Duolingo" },
  { id: "1010865085", name: "YNAB" },
  { id: "6448311069", name: "ChatGPT" },
];

interface AppleReview {
  "im:rating"?: { label: string };
  title?: { label: string };
  content?: { label: string };
  id?: { label: string };
  updated?: { label: string };
}

export async function scrapeAppStore(): Promise<ScrapedPost[]> {
  const posts: ScrapedPost[] = [];

  for (const app of APPS) {
    try {
      const res = await fetch(
        `https://itunes.apple.com/us/rss/customerreviews/page=1/id=${app.id}/sortby=mostrecent/json`
      );
      if (!res.ok) {
        console.warn(`[scrape] appstore ${app.name}: HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const entries: AppleReview[] = data?.feed?.entry ?? [];

      for (const e of entries) {
        // First entry is app metadata (no rating) — skip it.
        if (!e["im:rating"]) continue;
        const rating = parseInt(e["im:rating"].label, 10);
        if (!(rating <= 2)) continue; // complaints only

        const title = e.title?.label || "";
        const content = e.content?.label || "";
        posts.push({
          title: `[${app.name}] ${title}`.slice(0, 200),
          url: e.id?.label || `https://apps.apple.com/us/app/id${app.id}`,
          body: content.slice(0, 1000),
          // Synthetic score so complaints survive the top-100 cut; harsher = higher.
          score: rating === 1 ? 50 : 35,
          comments: 0,
          platform: "appstore",
          created_at: e.updated?.label || new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(`[scrape] appstore ${app.name}: failed`, err);
    }
  }

  console.log(`[scrape] appstore: ${posts.length} posts`);
  return posts;
}
