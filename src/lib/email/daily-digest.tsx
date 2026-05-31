import { Idea } from "@/types";

// Nocturne palette (email-safe inline styles)
const C = {
  bg: "#14161B",
  card: "#1A1D24",
  surface: "#1B1E26",
  border: "rgba(255,255,255,0.09)",
  line: "rgba(255,255,255,0.06)",
  text: "#ECEAE4",
  dim: "#9DA0A8",
  mute: "#6B6E76",
  accent: "#2FA89B",
  weekend: "#6FCF97",
  week: "#E0B15B",
  month: "#E07A8B",
};

const diffColor: Record<string, string> = {
  Weekend: C.weekend,
  Week: C.week,
  Month: C.month,
};

// Build prompt potential as filled/empty dots (email-safe, no icons)
function viralDots(n: number): string {
  return Array.from({ length: 5 })
    .map(
      (_, i) =>
        `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${i < n ? C.accent : C.line};margin-left:3px;"></span>`
    )
    .join("");
}

// Simple HTML email template (no React Email dependency needed for MVP)
export function buildDigestHtml(ideas: Idea[], date: string): string {
  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const ideaCards = ideas
    .map(
      (idea, i) => `
    <div style="background:${C.card};border:1px solid ${C.border};border-radius:14px;padding:22px 24px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="font-size:13px;color:${C.mute};font-weight:600;">${String(i + 1).padStart(2, "0")}</span>
        <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.accent};">${i === 0 ? "Idea of the day" : idea.category}</span>
      </div>
      <h2 style="color:${C.text};margin:0 0 6px;font-size:21px;font-family:Georgia,'Times New Roman',serif;font-weight:400;">${idea.name}</h2>
      <p style="color:${C.dim};margin:0 0 16px;font-size:14px;line-height:1.5;">${idea.one_liner}</p>
      <div style="margin-bottom:16px;">
        <span style="font-size:12px;font-weight:600;color:${diffColor[idea.difficulty] ?? C.dim};">● ${idea.difficulty}</span>
        <span style="float:right;">${viralDots(idea.viral_potential)}</span>
      </div>
      <div style="background:${C.bg};border:1px solid ${C.line};border-radius:10px;padding:14px 16px;font-size:12.5px;color:${C.dim};line-height:1.55;">
        <div style="margin-bottom:10px;"><span style="color:${C.mute};font-weight:600;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;">Pain point</span><br/><span style="color:${C.text};">${idea.pain_point}</span></div>
        <div style="margin-bottom:10px;"><span style="color:${C.mute};font-weight:600;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;">Who needs it</span><br/><span style="color:${C.text};">${idea.target_audience}</span></div>
        <div><span style="color:${C.mute};font-weight:600;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;">Monetization</span><br/><span style="color:${C.text};">${idea.monetization}</span></div>
      </div>
    </div>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="background:${C.bg};color:${C.text};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:32px 16px;margin:0;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="margin-bottom:32px;">
      <p style="color:${C.accent};font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 12px;">Today · ${formatted}</p>
      <h1 style="color:${C.text};font-size:32px;margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:400;">SideQuest</h1>
      <p style="color:${C.dim};font-size:14px;margin:10px 0 0;line-height:1.5;">${ideas.length} buildable ideas, distilled from the internet's pain points overnight. No noise — just the signal worth building.</p>
    </div>

    ${ideaCards}

    <div style="text-align:center;margin-top:24px;padding-top:24px;border-top:1px solid ${C.line};">
      <p style="color:${C.mute};font-size:12px;line-height:1.6;">
        No signup · saves locally · a new drop every morning.
        <br/>
        <a href="%unsubscribe_url%" style="color:${C.accent};">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
