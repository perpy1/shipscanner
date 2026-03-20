import { Idea, DailyScan } from "@/types";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export const seedIdeas: Idea[] = [
  // Today
  {
    id: "1",
    name: "DevlogAI",
    one_liner: "Auto-generate changelogs from your git commits using AI",
    description:
      "Developers hate writing changelogs but stakeholders need them. DevlogAI watches your repo, groups commits by feature/fix, and generates beautiful changelogs in markdown, Notion, or Slack format. Charge per-repo with a free tier for open source.",
    category: "Developer Tool",
    difficulty: "Weekend",
    viral_potential: 4,
    pain_point:
      "Developers spend 30+ minutes per release writing changelogs that nobody reads in detail",
    target_audience: "Engineering teams and open-source maintainers",
    monetization: "$9/mo per repo, free for public repos",
    source_urls: ["https://reddit.com/r/programming/example1"],
    source_platform: "reddit",
    upvotes: 12,
    created_at: new Date().toISOString(),
    scan_date: daysAgo(0),
  },
  {
    id: "2",
    name: "StackFix",
    one_liner: "Paste an error, get a working fix in seconds",
    description:
      "Unlike generic AI chatbots, StackFix specializes in error resolution. It maintains a database of verified fixes mapped to specific error signatures. Users paste their stack trace and get the exact fix — not a blog post, not a tutorial, just the 3 lines they need to change.",
    category: "Developer Tool",
    difficulty: "Week",
    viral_potential: 5,
    pain_point:
      "Developers waste hours searching Stack Overflow for error fixes that are buried in long threads",
    target_audience: "All developers, especially juniors and bootcamp grads",
    monetization: "$12/mo for unlimited fixes, free tier with 10/day",
    source_urls: ["https://news.ycombinator.com/item?id=example2"],
    source_platform: "hackernews",
    upvotes: 34,
    created_at: new Date().toISOString(),
    scan_date: daysAgo(0),
  },
  {
    id: "3",
    name: "IndieCRM",
    one_liner: "A CRM built for solo founders who sell via DMs",
    description:
      "Most CRMs are built for sales teams. IndieCRM is built for the indie hacker who closes deals in Twitter DMs, email threads, and Discord chats. It aggregates conversations from all platforms and lets you track deals with a simple kanban board. No seats, no bloat.",
    category: "SaaS",
    difficulty: "Month",
    viral_potential: 4,
    pain_point:
      "Solo founders track deals in spreadsheets and lose track of conversations across platforms",
    target_audience: "Indie hackers and solopreneurs with <$50k ARR",
    monetization: "$19/mo flat, lifetime deal option at $199",
    source_urls: ["https://reddit.com/r/SaaS/example3"],
    source_platform: "reddit",
    upvotes: 28,
    created_at: new Date().toISOString(),
    scan_date: daysAgo(0),
  },
  // Yesterday
  {
    id: "4",
    name: "ShipCheck",
    one_liner: "Pre-launch checklist that actually knows your stack",
    description:
      "A smart pre-launch checklist that scans your repo and deployment config to generate a personalized launch checklist. Covers SEO, security headers, error tracking, analytics, social cards, and more. Catches the stuff you always forget before ProductHunt day.",
    category: "Developer Tool",
    difficulty: "Weekend",
    viral_potential: 3,
    pain_point:
      "Developers forget critical launch items (OG tags, error tracking, analytics) and scramble to fix them after launch",
    target_audience: "Indie hackers launching on Product Hunt",
    monetization: "$29 one-time, or free tier with basic checks",
    source_urls: ["https://reddit.com/r/SideProject/example4"],
    source_platform: "reddit",
    upvotes: 19,
    created_at: new Date().toISOString(),
    scan_date: daysAgo(1),
  },
  {
    id: "5",
    name: "FeedbackPill",
    one_liner: "Embed a feedback widget that users actually use",
    description:
      "A tiny embeddable widget (< 5kb) that lets users highlight any element on your page and leave feedback. Screenshots are automatic. Feedback goes to Slack, Linear, or email. The trick: it uses AI to auto-categorize and deduplicate feedback so you see patterns, not noise.",
    category: "SaaS",
    difficulty: "Week",
    viral_potential: 4,
    pain_point:
      "User feedback tools are either too heavy (Hotjar) or too simple (Google Forms) with no middle ground",
    target_audience: "SaaS founders and product managers",
    monetization: "$15/mo per site, free for < 100 responses/mo",
    source_urls: ["https://news.ycombinator.com/item?id=example5"],
    source_platform: "hackernews",
    upvotes: 22,
    created_at: new Date().toISOString(),
    scan_date: daysAgo(1),
  },
  {
    id: "6",
    name: "NomadTax",
    one_liner: "Tax compliance for digital nomads, simplified",
    description:
      "Digital nomads have no idea which countries they owe taxes to. NomadTax tracks your location history (via Google Timeline or manual input), determines your tax obligations per jurisdiction, and connects you with tax professionals who specialize in nomad situations.",
    category: "Fintech",
    difficulty: "Month",
    viral_potential: 3,
    pain_point:
      "Remote workers traveling internationally have no idea about their tax obligations in different countries",
    target_audience: "Digital nomads and remote workers in multiple countries",
    monetization: "$29/mo or $249/year, premium for tax filing assistance",
    source_urls: ["https://reddit.com/r/digitalnomad/example6"],
    source_platform: "reddit",
    upvotes: 15,
    created_at: new Date().toISOString(),
    scan_date: daysAgo(1),
  },
  // 2 days ago
  {
    id: "7",
    name: "APIBench",
    one_liner: "Load test your API with one command, get a public report",
    description:
      "A CLI tool that load-tests your API endpoints and generates a beautiful shareable report. Think of it as Lighthouse but for API performance. Great for SaaS companies that want to prove their API is fast. Reports include p50/p95/p99 latencies, error rates, and comparison over time.",
    category: "Developer Tool",
    difficulty: "Week",
    viral_potential: 4,
    pain_point:
      "Setting up proper API load testing requires complex infrastructure that most small teams skip entirely",
    target_audience: "Backend developers and DevOps engineers",
    monetization: "$19/mo for scheduled tests and history, free for one-off tests",
    source_urls: ["https://news.ycombinator.com/item?id=example7"],
    source_platform: "hackernews",
    upvotes: 41,
    created_at: new Date().toISOString(),
    scan_date: daysAgo(2),
  },
  {
    id: "8",
    name: "WaitlistWizard",
    one_liner: "Viral waitlist pages with built-in referral mechanics",
    description:
      "Create a waitlist landing page in 60 seconds that includes referral tracking, position-based rewards, and social proof counters. Integrates with any email provider. The referral loop (share to move up in line) is what makes waitlists go viral. Template-based, no code needed.",
    category: "Marketplace",
    difficulty: "Weekend",
    viral_potential: 5,
    pain_point:
      "Building a waitlist with referral mechanics requires custom code that most indie hackers don't have time to build",
    target_audience: "Indie hackers and startup founders pre-launch",
    monetization: "$9/mo per waitlist, or $49 lifetime per project",
    source_urls: ["https://reddit.com/r/Entrepreneur/example8"],
    source_platform: "reddit",
    upvotes: 37,
    created_at: new Date().toISOString(),
    scan_date: daysAgo(2),
  },
  {
    id: "9",
    name: "PromptVault",
    one_liner: "Version control and A/B test your AI prompts",
    description:
      "AI teams iterate on prompts constantly but track changes in Google Docs. PromptVault gives you git-like version control for prompts, A/B testing with automatic evaluation, and a prompt registry API so your app always pulls the latest approved prompt. Built for teams shipping AI features.",
    category: "AI/ML",
    difficulty: "Month",
    viral_potential: 4,
    pain_point:
      "AI teams manage prompts in spreadsheets with no version control, rollback, or testing infrastructure",
    target_audience: "AI/ML engineers and product teams shipping LLM features",
    monetization: "$29/mo per team, enterprise tier with SSO/audit logs",
    source_urls: ["https://news.ycombinator.com/item?id=example9"],
    source_platform: "hackernews",
    upvotes: 25,
    created_at: new Date().toISOString(),
    scan_date: daysAgo(2),
  },
];

export const seedScans: DailyScan[] = [
  {
    id: "scan-1",
    scan_date: daysAgo(0),
    ideas_count: 3,
    sources_scraped: 12,
    posts_analyzed: 847,
    created_at: new Date().toISOString(),
  },
  {
    id: "scan-2",
    scan_date: daysAgo(1),
    ideas_count: 3,
    sources_scraped: 12,
    posts_analyzed: 923,
    created_at: new Date().toISOString(),
  },
  {
    id: "scan-3",
    scan_date: daysAgo(2),
    ideas_count: 3,
    sources_scraped: 11,
    posts_analyzed: 756,
    created_at: new Date().toISOString(),
  },
];
