import { Resend } from "resend";
import { Idea } from "@/types";
import { buildDigestHtml } from "./daily-digest";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendDailyDigest(
  emails: string[],
  ideas: Idea[],
  date: string
) {
  if (emails.length === 0 || ideas.length === 0) return;

  const html = buildDigestHtml(ideas, date);
  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Resend supports batch sending (up to 100 per call)
  const batchSize = 100;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    await getResend().batch.send(
      batch.map((email) => ({
        from: "SideQuest <ideas@sidequest.app>",
        to: email,
        subject: `🔍 3 App Ideas for ${formatted} — SideQuest`,
        html,
      }))
    );
  }
}
