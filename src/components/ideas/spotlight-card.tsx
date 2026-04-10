"use client";

import { useState } from "react";
import { Idea } from "@/types";
import { playClick, playTap } from "@/lib/sounds";
import { PromptModal } from "./idea-card-modal";

const difficultyLabel: Record<string, string> = {
  Weekend: "Weekend Project",
  Week: "Week Sprint",
  Month: "Month Campaign",
};

export function SpotlightCard({ idea }: { idea: Idea }) {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <>
      <div className="spotlight-wrap mx-6 sm:mx-12 mb-16">
        <div
          className="bg-[var(--bg)] backdrop-blur-[30px] rounded-[19px] p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 sm:gap-12 relative z-[1]"
        >
          {/* Left content */}
          <div>
            <div className="font-label text-[10px] tracking-[0.12em] uppercase text-[var(--copper)] mb-4">
              IDEA OF THE DAY
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-normal text-[var(--text-display)] tracking-[-0.02em] leading-[1.05] mb-4">
              {idea.name}
            </h2>
            <p className="text-base font-light text-[var(--text-secondary)] leading-relaxed mb-7">
              {idea.one_liner}. {idea.description}
            </p>
            <button
              onClick={() => {
                playClick(true);
                setShowPrompt(true);
              }}
              className="inline-flex items-center gap-2.5 font-label text-[11px] tracking-[0.06em] uppercase px-7 py-3.5 rounded-full bg-[var(--copper)] text-[var(--bg)] border-none cursor-pointer transition-all duration-200 hover:opacity-85 hover:translate-x-0.5"
            >
              GENERATE BUILD PROMPT <span>&rarr;</span>
            </button>
          </div>

          {/* Right details */}
          <div className="flex flex-col">
            <div className="flex justify-between items-baseline py-3.5 border-b border-[rgba(255,255,255,0.06)]">
              <span className="font-label text-[10px] tracking-[0.08em] uppercase text-[var(--text-secondary)]">PAIN POINT</span>
              <span className="text-sm text-[var(--text-primary)] text-right max-w-[55%]">{idea.pain_point}</span>
            </div>
            <div className="flex justify-between items-baseline py-3.5 border-b border-[rgba(255,255,255,0.06)]">
              <span className="font-label text-[10px] tracking-[0.08em] uppercase text-[var(--text-secondary)]">AUDIENCE</span>
              <span className="text-sm text-[var(--text-primary)] text-right max-w-[55%]">{idea.target_audience}</span>
            </div>
            <div className="flex justify-between items-baseline py-3.5 border-b border-[rgba(255,255,255,0.06)]">
              <span className="font-label text-[10px] tracking-[0.08em] uppercase text-[var(--text-secondary)]">MONETIZATION</span>
              <span className="text-sm text-[var(--text-primary)] text-right max-w-[55%]">{idea.monetization}</span>
            </div>
            <div className="flex justify-between items-baseline py-3.5 border-b border-[rgba(255,255,255,0.06)]">
              <span className="font-label text-[10px] tracking-[0.08em] uppercase text-[var(--text-secondary)]">DIFFICULTY</span>
              <span className="text-sm text-right max-w-[55%]" style={{ color: idea.difficulty === "Month" ? "var(--danger)" : idea.difficulty === "Week" ? "var(--warning)" : "var(--success)" }}>
                {difficultyLabel[idea.difficulty] || idea.difficulty}
              </span>
            </div>
            <div className="flex justify-between items-baseline py-3.5">
              <span className="font-label text-[10px] tracking-[0.08em] uppercase text-[var(--text-secondary)]">POTENTIAL</span>
              <span className="text-sm text-[var(--copper)] text-right">{idea.viral_potential} / 5</span>
            </div>
          </div>
        </div>
      </div>

      <PromptModal idea={idea} open={showPrompt} onClose={() => setShowPrompt(false)} />
    </>
  );
}
