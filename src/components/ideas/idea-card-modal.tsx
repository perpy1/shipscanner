"use client";

import { useState, useCallback, useEffect } from "react";
import { Idea } from "@/types";
import { playClick, playTap } from "@/lib/sounds";
import { generateClaudePrompt } from "@/lib/generate-prompt";

const difficultyConfig: Record<string, { label: string; cssClass: string }> = {
  Weekend: { label: "WEEKEND", cssClass: "diff-easy" },
  Week: { label: "WEEK", cssClass: "diff-mid" },
  Month: { label: "MONTH", cssClass: "diff-hard" },
};

const platformLabel: Record<string, string> = {
  reddit: "REDDIT",
  hackernews: "HN",
  producthunt: "PH",
};

/** Prompt modal — shared by cards and spotlight */
export function PromptModal({
  idea,
  open,
  onClose,
}: {
  idea: Idea;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const prompt = generateClaudePrompt(idea);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt).then(() => {
      playClick(true);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [prompt]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playTap();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`modal-overlay ${open ? "open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playTap();
          onClose();
        }
      }}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={() => { playTap(); onClose(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[var(--glass-border)] bg-transparent text-[var(--text-disabled)] text-base cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-[var(--copper)] hover:text-[var(--copper)]"
        >
          &times;
        </button>

        {/* Eyebrow */}
        <div className="font-label text-[10px] tracking-[0.1em] uppercase text-[var(--copper)] mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--copper)]" style={{ animation: "scan-pulse 2s ease-in-out infinite" }} />
          BUILD WITH CLAUDE
        </div>

        {/* Name */}
        <div className="font-display text-4xl font-normal text-[var(--text-display)] tracking-[-0.02em] leading-[1.1] mb-2">
          {idea.name}
        </div>

        {/* Liner */}
        <div className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-6">
          {idea.one_liner}
        </div>

        {/* Prompt */}
        <div className="font-label text-[9px] tracking-[0.1em] uppercase text-[var(--text-secondary)] mb-2">
          GENERATED PROMPT
        </div>
        <div className="prompt-box mb-5">
          {prompt}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 items-center">
          <button
            onClick={handleCopy}
            className={`font-label text-[11px] tracking-[0.06em] uppercase px-7 py-3 rounded-full border-none cursor-pointer transition-all duration-200 flex items-center gap-2 ${
              copied
                ? "bg-[var(--success)] text-[var(--bg)]"
                : "bg-[var(--copper)] text-[var(--bg)] hover:opacity-85"
            }`}
          >
            {copied ? "COPIED" : "COPY TO CLIPBOARD"}
          </button>
          <button
            onClick={() => { playTap(); onClose(); }}
            className="font-label text-[10px] tracking-[0.06em] uppercase text-[var(--text-disabled)] bg-transparent border-none cursor-pointer px-4 py-3 transition-colors duration-200 hover:text-[var(--text-secondary)]"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

/** Glass card with inline expand detail */
export function IdeaCardModal({ idea }: { idea: Idea }) {
  const [active, setActive] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const diff = difficultyConfig[idea.difficulty] || difficultyConfig.Weekend;

  function toggleCard(e: React.MouseEvent) {
    // Don't toggle if clicking a button inside
    if ((e.target as HTMLElement).closest("button")) return;
    const isOpening = !active;
    playClick(isOpening);
    setActive(isOpening);

    // Toggle has-active on parent grid
    const grid = (e.currentTarget as HTMLElement).closest(".grid-ideas");
    if (grid) {
      if (isOpening) {
        grid.classList.add("has-active");
      } else {
        // Check if any other card is active
        const otherActives = grid.querySelectorAll(".glass-card.active");
        if (otherActives.length <= 1) grid.classList.remove("has-active");
      }
    }
  }

  return (
    <>
      <div
        className={`glass-card ${active ? "active" : ""}`}
        onClick={toggleCard}
      >
        {/* Top row — difficulty + potential dots */}
        <div className="flex justify-between items-center mb-4">
          <span className={`font-label text-[9px] tracking-[0.08em] uppercase px-2.5 py-1 rounded-full border ${diff.cssClass}`}>
            {diff.label}
          </span>
          <div className="flex gap-[3px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  i < idea.viral_potential ? "bg-[var(--copper)]" : "bg-[var(--text-disabled)]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="card-name text-xl font-medium text-[var(--text-display)] mb-2 leading-snug transition-colors duration-300">
          {idea.name}
        </div>

        {/* Liner */}
        <div className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
          {idea.one_liner}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <span className="font-label text-[10px] tracking-[0.06em] uppercase text-[var(--text-disabled)]">
            {platformLabel[idea.source_platform] || idea.source_platform}
          </span>
          <div className="card-arrow w-7 h-7 rounded-full border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[var(--text-disabled)] text-sm transition-all duration-300 cubic-bezier(0.25,0.1,0.25,1)">
            &rarr;
          </div>
        </div>

        {/* Expandable detail */}
        <div className="card-detail">
          <div className="pt-5 mt-5 border-t border-[rgba(255,255,255,0.06)]">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="panel-item flex flex-col gap-1">
                <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">PAIN POINT</span>
                <span className="text-[13px] text-[var(--text-primary)] leading-relaxed">{idea.pain_point}</span>
              </div>
              <div className="panel-item flex flex-col gap-1">
                <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">AUDIENCE</span>
                <span className="text-[13px] text-[var(--text-primary)] leading-relaxed">{idea.target_audience}</span>
              </div>
              <div className="panel-item flex flex-col gap-1">
                <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">MONETIZATION</span>
                <span className="text-[13px] text-[var(--text-primary)] leading-relaxed">{idea.monetization}</span>
              </div>
              <div className="panel-item flex flex-col gap-1">
                <span className="font-label text-[9px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">POTENTIAL</span>
                <span className="text-[13px] text-[var(--copper)] leading-relaxed">{idea.viral_potential} / 5</span>
              </div>
            </div>
            <div className="panel-actions flex gap-2.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playTap();
                  setShowPrompt(true);
                }}
                className="font-label text-[10px] tracking-[0.06em] uppercase px-5 py-2.5 rounded-full bg-[var(--copper)] text-[var(--bg)] border-none cursor-pointer transition-all duration-200 hover:opacity-85"
              >
                GENERATE PROMPT
              </button>
              {idea.source_urls?.[0] && (
                <a
                  href={idea.source_urls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    playTap();
                  }}
                  className="font-label text-[10px] tracking-[0.06em] uppercase px-5 py-2.5 rounded-full bg-transparent text-[var(--text-primary)] border border-[var(--glass-border)] cursor-pointer transition-all duration-200 hover:border-[rgba(255,255,255,0.15)] inline-flex items-center"
                >
                  VIEW SOURCE
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <PromptModal idea={idea} open={showPrompt} onClose={() => setShowPrompt(false)} />
    </>
  );
}
