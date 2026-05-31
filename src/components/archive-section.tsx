"use client";

import { useState } from "react";
import Link from "next/link";
import { playTap } from "@/lib/sounds";

export function ArchiveSection({ dates }: { dates: string[] }) {
  const [showAll, setShowAll] = useState(false);

  // Skip today (first date) for archive
  const archiveDates = dates.slice(1);
  const visible = showAll ? archiveDates : archiveDates.slice(0, 5);

  if (archiveDates.length === 0) return null;

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
  }

  return (
    <div id="archive" className="mx-auto w-full max-w-[1080px] px-8 py-11 border-t border-[var(--line)]">
      <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--accent)] mb-2">
        Past drops
      </div>
      <h2 className="font-head text-[clamp(28px,4vw,40px)] leading-[1.05] text-[var(--text)] m-0 mb-[34px]">
        The archive
      </h2>

      <div className="flex flex-col">
        {visible.map((date) => (
          <Link
            key={date}
            href={`/ideas/${date}`}
            onClick={playTap}
            className="grid grid-cols-[140px_1fr_auto] sm:grid-cols-[180px_1fr_auto] gap-4 sm:gap-8 items-center py-5 border-b border-[var(--line)] cursor-pointer transition-all duration-200 hover:pl-2 group"
          >
            <span className="text-[13px] font-semibold text-[var(--dim)] transition-colors duration-200 group-hover:text-[var(--accent)]">
              {formatDate(date)}
            </span>
            <span className="text-[15px] text-[var(--text)]">View ideas</span>
            <span className="text-[12px] font-semibold text-[var(--mute)] whitespace-nowrap">
              10 ideas
            </span>
          </Link>
        ))}
      </div>

      {archiveDates.length > 5 && !showAll && (
        <div className="mt-6">
          <button
            onClick={() => { playTap(); setShowAll(true); }}
            className="text-sm font-semibold px-5 py-2.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] text-[var(--dim)] cursor-pointer transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            View all past drops
          </button>
        </div>
      )}
    </div>
  );
}
