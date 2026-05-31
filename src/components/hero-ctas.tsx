"use client";

import { playTap } from "@/lib/sounds";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
}

export function HeroCtas() {
  return (
    <div className="flex gap-3 mt-8 flex-wrap">
      <button
        onClick={() => { playTap(); scrollTo("ideas"); }}
        className="text-[15px] font-semibold px-6 py-3.5 rounded-[10px] border cursor-pointer transition-all duration-200"
        style={{ background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" }}
      >
        See today&apos;s drop
      </button>
      <button
        onClick={() => { playTap(); scrollTo("how"); }}
        className="text-[15px] font-semibold px-6 py-3.5 rounded-[10px] bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] cursor-pointer transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        How it works
      </button>
    </div>
  );
}
