"use client";

import { useState, useCallback, useEffect } from "react";
import { Idea } from "@/types";
import { playClick, playTap } from "@/lib/sounds";
import { generateClaudePrompt } from "@/lib/generate-prompt";
import { useSavedIdeas } from "@/lib/use-saved-ideas";
import { SocialCard } from "./social-card";

const difficultyConfig: Record<string, { label: string; cssVar: string }> = {
  Weekend: { label: "Weekend", cssVar: "var(--diff-weekend)" },
  Week: { label: "Week", cssVar: "var(--diff-week)" },
  Month: { label: "Month", cssVar: "var(--diff-month)" },
};

/** Difficulty pill — colored dot + label */
function DiffPill({ difficulty }: { difficulty: string }) {
  const d = difficultyConfig[difficulty] || difficultyConfig.Weekend;
  return (
    <span className="inline-flex items-center gap-[7px] text-xs font-semibold" style={{ color: d.cssVar }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.cssVar }} />
      {d.label}
    </span>
  );
}

/** Viral potential dots */
function Viral({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-1" title={`Viral potential ${n}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
          style={{ background: i <= n ? "var(--accent)" : "var(--line)" }}
        />
      ))}
    </span>
  );
}

/** Prompt modal — kept for the spotlight / standalone "generate prompt" use */
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
      role="dialog"
      aria-modal="true"
      aria-label={`Build prompt for ${idea.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playTap();
          onClose();
        }
      }}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => { playTap(); onClose(); }}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[var(--border)] bg-transparent text-[var(--mute)] text-base cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          &times;
        </button>

        <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--accent)] mb-3">
          Build prompt
        </div>
        <div className="font-head text-4xl text-[var(--text)] leading-[1.05] mb-2">
          {idea.name}
        </div>
        <div className="text-[15px] text-[var(--dim)] leading-relaxed mb-6">
          {idea.one_liner}
        </div>

        <div className="prompt-box mb-4">{prompt}</div>

        <div className="flex gap-2.5 items-center">
          <button
            onClick={handleCopy}
            className="text-sm font-semibold px-[18px] py-[11px] rounded-[10px] border cursor-pointer transition-all duration-200"
            style={
              copied
                ? { background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" }
                : { background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" }
            }
          >
            {copied ? "✓  Copied to clipboard" : "Copy build prompt"}
          </button>
          <button
            onClick={() => { playTap(); onClose(); }}
            className="text-sm font-semibold px-4 py-[11px] rounded-[10px] text-[var(--dim)] bg-transparent border border-[var(--border)] cursor-pointer transition-colors duration-200 hover:text-[var(--text)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/** Idea card — gentle expand-in-place with inline detail + build prompt */
export function IdeaCardModal({ idea, index, featured }: { idea: Idea; index?: number; featured?: boolean }) {
  const [active, setActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { isSaved, toggle } = useSavedIdeas();
  const saved = isSaved(idea.id);
  const prompt = generateClaudePrompt(idea);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt).then(() => {
      playClick(true);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  function toggleCard(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("button, a")) return;
    const isOpening = !active;
    playClick(isOpening);
    setActive(isOpening);

    const grid = (e.currentTarget as HTMLElement).closest(".grid-ideas");
    if (grid) {
      if (isOpening) {
        grid.classList.add("has-active");
      } else {
        const otherActives = grid.querySelectorAll(".glass-card.active");
        if (otherActives.length <= 1) grid.classList.remove("has-active");
      }
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      (e.currentTarget as HTMLElement).click();
    }
  }

  return (
    <>
    <div
      className={`glass-card flex flex-col ${active ? "active" : ""} ${featured ? "featured" : ""}`}
      style={{ gridColumn: active ? "1 / -1" : "auto" }}
      onClick={toggleCard}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
      aria-expanded={active}
    >
      {/* Top row — index + category/featured */}
      <div className="flex items-center justify-between">
        <span className="font-head text-lg text-[var(--mute)]">
          {String((index ?? 0) + 1).padStart(2, "0")}
        </span>
        <span className="text-[11.5px] font-semibold tracking-[0.1em] uppercase text-[var(--accent)]">
          {featured ? "Idea of the day" : idea.category}
        </span>
      </div>

      {/* Name */}
      <h3 className="card-name font-head text-[25px] text-[var(--text)] leading-[1.05] mt-4 transition-colors duration-300">
        {idea.name}
      </h3>

      {/* Liner */}
      <p className="text-[15px] text-[var(--dim)] leading-[1.5] mt-2.5">
        {idea.one_liner}
      </p>

      {/* Footer — difficulty + viral + chevron */}
      <div className="flex items-center justify-between mt-[22px] pt-[18px] border-t border-[var(--line)]">
        <div className="flex items-center gap-4">
          <DiffPill difficulty={idea.difficulty} />
          <Viral n={idea.viral_potential} />
        </div>
        <span className="card-arrow flex text-[var(--mute)] transition-transform duration-[250ms]">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6l4 4 4-4" /></svg>
        </span>
      </div>

      {/* Expandable detail */}
      <div className="card-detail">
        <div className="mt-[22px] pt-[22px] border-t border-[var(--line)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              ["Pain point", idea.pain_point],
              ["Who needs it", idea.target_audience],
              ["Monetization", idea.monetization],
            ].map(([k, v]) => (
              <div key={k} className="panel-item">
                <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--mute)] mb-1.5">{k}</div>
                <div className="text-sm text-[var(--text)] leading-[1.5]">{v}</div>
              </div>
            ))}
          </div>

          {/* Build prompt */}
          <div className="panel-actions mt-6">
            <div className="flex items-baseline justify-between gap-3.5 mb-2.5">
              <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--mute)] whitespace-nowrap">Build prompt</span>
            </div>
            <div className="prompt-box">{prompt}</div>
            <div className="flex gap-2.5 mt-3.5">
              <button
                onClick={handleCopy}
                className="text-sm font-semibold px-[18px] py-2.5 rounded-[10px] cursor-pointer transition-all duration-200 border"
                style={{ background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" }}
              >
                {copied ? "✓  Copied to clipboard" : "Copy build prompt"}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); playTap(); toggle(idea.id); }}
                aria-pressed={saved}
                className="text-sm font-semibold px-[18px] py-2.5 rounded-[10px] cursor-pointer transition-all duration-200 border"
                style={
                  saved
                    ? { background: "var(--accent-soft)", color: "var(--accent)", borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)" }
                    : { background: "var(--surface)", color: "var(--text)", borderColor: "var(--border)" }
                }
              >
                {saved ? "✓ Saved" : "Save"}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); playTap(); setShowShare(true); }}
                className="text-sm font-semibold px-[18px] py-2.5 rounded-[10px] bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] cursor-pointer transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Share
              </button>
              {idea.source_urls?.[0] && (
                <a
                  href={idea.source_urls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { e.stopPropagation(); playTap(); }}
                  className="text-sm font-semibold px-[18px] py-2.5 rounded-[10px] bg-transparent text-[var(--dim)] border border-[var(--border)] cursor-pointer transition-all duration-200 hover:text-[var(--text)] inline-flex items-center"
                >
                  View source
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <SocialCard idea={idea} open={showShare} onClose={() => setShowShare(false)} />
    </>
  );
}
