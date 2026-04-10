"use client";

import { useEffect, useState, useRef } from "react";

function useCountUp(target: number, duration: number = 2000) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let start: number | null = null;
    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

function useCountdown() {
  const [total, setTotal] = useState(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(6, 0, 0, 0); // next scan at 6am
    let diff = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
    if (diff < 0) diff += 86400;
    return diff;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTotal((t) => (t <= 0 ? 86400 : t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function ScannerRibbon({
  ideasCount,
  postsAnalyzed,
}: {
  ideasCount: number;
  postsAnalyzed: number;
}) {
  const scannedCount = useCountUp(postsAnalyzed);
  const countdown = useCountdown();

  return (
    <div className="w-full max-w-[900px] bg-[rgba(255,255,255,0.03)] backdrop-blur-[30px] border border-[var(--glass-border)] rounded-2xl px-8 py-5 flex items-center gap-8 relative overflow-hidden mb-0">
      {/* Top copper line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--copper)] to-transparent opacity-25" />

      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="font-display text-[28px] font-normal text-[var(--text-display)] tracking-[-0.02em] leading-none">
          {scannedCount.toLocaleString()}
        </span>
        <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">
          SCANNED
        </span>
      </div>

      <div className="w-px h-7 bg-[rgba(255,255,255,0.06)] shrink-0" />

      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="font-display text-[28px] font-normal text-[var(--copper)] tracking-[-0.02em] leading-none">
          {ideasCount || 10}
        </span>
        <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">
          DISTILLED
        </span>
      </div>

      <div className="w-px h-7 bg-[rgba(255,255,255,0.06)] shrink-0" />

      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="font-display text-[28px] font-normal text-[var(--text-display)] tracking-[-0.02em] leading-none">
          3
        </span>
        <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">
          SOURCES
        </span>
      </div>

      <div className="w-px h-7 bg-[rgba(255,255,255,0.06)] shrink-0" />

      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="font-display text-[28px] font-normal text-[var(--text-display)] tracking-[-0.02em] leading-none">
          {countdown}
        </span>
        <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">
          NEXT SCAN
        </span>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 ml-auto">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[var(--copper)]"
          style={{ animation: "scan-pulse 2s ease-in-out infinite" }}
        />
        <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[var(--copper)]">
          LIVE
        </span>
      </div>
    </div>
  );
}
