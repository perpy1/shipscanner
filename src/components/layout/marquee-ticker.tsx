"use client";

import { Idea } from "@/types";

export function MarqueeTicker({ ideas }: { ideas?: Idea[] }) {
  const names = ideas && ideas.length > 0
    ? ideas.map((i) => i.name)
    : ["CalSync", "StatusPage.wtf", "GitRoast", "ReceiptVault", "MeetingTL;DR", "FocusFence", "ParkSpot", "PromptStash", "InvoiceGhost", "ColdMailer"];

  // Duplicate for seamless loop
  const items = [...names, ...names];
  const topIdea = ideas && ideas.length > 0 ? ideas[0]?.name : names[0];

  return (
    <div className="border-t border-b border-[rgba(255,255,255,0.06)] py-3.5 overflow-hidden whitespace-nowrap">
      <div
        className="inline-flex gap-12 font-label text-[11px] tracking-[0.06em] uppercase text-[var(--text-disabled)]"
        style={{ animation: "scroll-ticker 30s linear infinite" }}
      >
        {items.map((name, i) => (
          <span key={`${name}-${i}`}>
            {name}
            {name === topIdea && (
              <span className="text-[var(--copper)] ml-2">TRENDING</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
