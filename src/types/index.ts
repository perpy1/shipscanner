export type Category =
  | "SaaS"
  | "Developer Tool"
  | "Marketplace"
  | "AI/ML"
  | "Productivity"
  | "Social"
  | "Fintech"
  | "Health"
  | "Education"
  | "E-commerce";

export type Difficulty = "Weekend" | "Week" | "Month";

export type Platform =
  | "reddit"
  | "hackernews"
  | "producthunt"
  | "stackoverflow"
  | "softwarerecs"
  | "webapps"
  | "lobsters"
  | "github"
  | "appstore";

export interface Idea {
  id: string;
  name: string;
  one_liner: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  viral_potential: number; // 1-5
  pain_point: string;
  target_audience: string;
  monetization: string;
  source_urls: string[];
  source_platform: Platform;
  upvotes: number;
  created_at: string;
  scan_date: string;
}

export interface DailyScan {
  id: string;
  scan_date: string;
  ideas_count: number;
  sources_scraped: number;
  posts_analyzed: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  saved_ideas: string[];
  created_at: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface ScrapedPost {
  title: string;
  url: string;
  body: string;
  score: number;
  comments: number;
  platform: Platform;
  subreddit?: string;
  created_at: string;
}
