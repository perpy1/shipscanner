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
    <div id="archive" className="px-6 sm:px-12 py-24 border-t border-[rgba(255,255,255,0.06)]">
      <div className="flex justify-between items-baseline mb-8">
        <span className="font-label text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">
          ARCHIVE
        </span>
        <span className="font-label text-[11px] text-[var(--text-disabled)]">
          PAST DROPS
        </span>
      </div>

      <div className="flex flex-col">
        {visible.map((date, i) => (
          <Link
            key={date}
            href={`/ideas/${date}`}
            onClick={playTap}
            className={`grid grid-cols-[180px_1fr_auto] gap-8 items-baseline py-6 border-b border-[rgba(255,255,255,0.06)] cursor-pointer transition-all duration-200 hover:pl-2 group ${i === 0 ? "pt-0" : ""}`}
          >
            <span className="font-label text-sm tracking-[0.04em] text-[var(--text-secondary)] transition-colors duration-200 group-hover:text-[var(--copper)]">
              {formatDate(date)}
            </span>
            <div className="flex gap-5 overflow-hidden text-[15px] text-[var(--text-disabled)]">
              {/* Placeholder idea names - in production these would come from data */}
              <span className="whitespace-nowrap text-[var(--text-primary)]">View ideas</span>
            </div>
            <span className="font-label text-[11px] tracking-[0.06em] text-[var(--text-disabled)] uppercase whitespace-nowrap">
              10 IDEAS
            </span>
          </Link>
        ))}
      </div>

      {archiveDates.length > 5 && !showAll && (
        <div className="text-center mt-6">
          <button
            onClick={() => { playTap(); setShowAll(true); }}
            className="font-label text-[10px] tracking-[0.08em] uppercase px-7 py-3 rounded-full bg-transparent border border-[var(--glass-border)] text-[var(--text-secondary)] cursor-pointer transition-all duration-200 hover:border-[var(--copper)] hover:text-[var(--copper)]"
          >
            VIEW ALL PAST DROPS
          </button>
        </div>
      )}
    </div>
  );
}
