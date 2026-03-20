import { Idea } from "@/types";

const difficultyQuest: Record<string, string> = {
  Weekend: "⚔️ WEEKEND QUEST",
  Week: "🗡️ WEEK-LONG RAID",
  Month: "🐉 EPIC CAMPAIGN",
};

// Simple HTML email template (no React Email dependency needed for MVP)
export function buildDigestHtml(ideas: Idea[], date: string): string {
  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const ideaCards = ideas
    .map(
      (idea) => `
    <div style="background: #1c1c1c; border: 2px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
      <div style="margin-bottom: 12px;">
        <span style="background: #f59e0b; color: #000; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">${difficultyQuest[idea.difficulty] ?? idea.difficulty}</span>
        <span style="background: #2a2a2a; color: #999; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 4px;">${idea.category}</span>
        <span style="float: right; color: #f97316;">${"🔥".repeat(idea.viral_potential)}</span>
      </div>
      <h2 style="color: #f59e0b; margin: 8px 0 4px; font-size: 18px; font-family: monospace;">${idea.name}</h2>
      <p style="color: #ddd; margin: 0 0 12px; font-size: 14px;">${idea.one_liner}</p>
      <p style="color: #888; margin: 0 0 16px; font-size: 13px;">${idea.description}</p>
      <div style="background: #222; border-radius: 8px; padding: 12px; font-size: 12px; color: #888;">
        <div style="margin-bottom: 8px;"><span style="color: #f59e0b; font-weight: bold; font-size: 10px; letter-spacing: 1px;">⚡ THE PROBLEM</span><br/><span style="color: #ccc;">${idea.pain_point}</span></div>
        <div style="margin-bottom: 8px;"><span style="color: #06b6d4; font-weight: bold; font-size: 10px; letter-spacing: 1px;">🎯 WHO NEEDS IT</span><br/><span style="color: #ccc;">${idea.target_audience}</span></div>
        <div><span style="color: #10b981; font-weight: bold; font-size: 10px; letter-spacing: 1px;">💰 GOLD POTENTIAL</span><br/><span style="color: #ccc;">${idea.monetization}</span></div>
      </div>
    </div>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background: #0a0a0a; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px 16px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #fff; font-size: 24px; margin: 0;">
        📜 Side<span style="color: #f97316;">Quest</span>
      </h1>
      <p style="color: #f59e0b; font-size: 16px; font-weight: bold; margin: 12px 0 4px; letter-spacing: 1px;">📦 DAILY LOOT DROP</p>
      <p style="color: #888; font-size: 13px; margin: 0;">${formatted} — ${ideas.length} quests available</p>
    </div>

    <div style="background: #1a1a2e; border: 1px solid #f59e0b30; border-radius: 8px; padding: 12px; margin-bottom: 20px; text-align: center;">
      <p style="color: #f59e0b; font-size: 12px; margin: 0; letter-spacing: 0.5px;">🗡️ QUEST AVAILABLE — Open your editor and start building</p>
    </div>

    ${ideaCards}

    <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #222;">
      <p style="color: #666; font-size: 12px;">
        You're getting this because you subscribed to SideQuest daily ideas.
        <br/>
        <a href="%unsubscribe_url%" style="color: #f97316;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
