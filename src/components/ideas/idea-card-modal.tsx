"use client";

import { useState } from "react";
import { Idea } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, ExternalLink, X, Share2, Cpu, Copy, ChevronDown, ChevronUp, Users } from "lucide-react";
import { SocialCard } from "./social-card";
import { playClickSound } from "@/lib/sounds";
import { generateClaudePrompt } from "@/lib/generate-prompt";
import { toast } from "sonner";

const difficultyConfig: Record<string, { label: string; color: string }> = {
  Weekend: { label: "Weekend Quest", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  Week: { label: "Week-long Raid", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  Month: { label: "Epic Campaign", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

const platformLabel: Record<string, string> = {
  reddit: "Reddit",
  hackernews: "Hacker News",
  producthunt: "Product Hunt",
};

export function IdeaCardModal({ idea }: { idea: Idea }) {
  const [open, setOpen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const diff = difficultyConfig[idea.difficulty] || difficultyConfig.Weekend;

  function handleOpen() {
    playClickSound();
    setOpen(true);
  }

  function handleCopyPrompt() {
    const prompt = generateClaudePrompt(idea);
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard!", { className: "font-mono text-xs" });
  }

  return (
    <>
      {/* Card trigger */}
      <button
        onClick={handleOpen}
        className="pixel-border rounded-lg bg-card p-5 text-left transition-all duration-200 hover:translate-y-[-2px] cursor-pointer w-full"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px] font-mono">
              {idea.category}
            </Badge>
            <Badge variant="outline" className={`text-[10px] ${diff.color}`}>
              {diff.label}
            </Badge>
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Flame
                key={i}
                className={`size-3 ${
                  i < idea.viral_potential
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>
        <h3 className="text-base font-bold leading-snug mb-1">{idea.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {idea.one_liner}
        </p>
        <p className="text-[13px] text-muted-foreground/60 leading-relaxed line-clamp-2">
          {idea.description}
        </p>

        {/* Footer indicators */}
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
            {platformLabel[idea.source_platform]}
          </Badge>
          {idea.upvotes > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
              <Users className="size-3" />
              {idea.upvotes} interested
            </span>
          )}
        </div>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto pixel-border rounded-lg bg-card p-6 sm:p-8 animate-in zoom-in-95 fade-in duration-200"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>

            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-xs font-mono">
                {idea.category}
              </Badge>
              <Badge variant="outline" className={`text-xs ${diff.color}`}>
                {diff.label}
              </Badge>
              {idea.upvotes > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <Users className="size-3.5" />
                  {idea.upvotes} builders interested
                </span>
              )}
              <div className="flex items-center gap-0.5 ml-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Flame
                    key={i}
                    className={`size-4 ${
                      i < idea.viral_potential
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Title */}
            <h2 className="font-pixel text-lg sm:text-xl text-amber-400 mb-2 leading-relaxed">
              {idea.name}
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed mb-4">
              {idea.one_liner}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {idea.description}
            </p>

            {/* Details grid */}
            <div className="grid gap-3 sm:grid-cols-3 mb-6">
              <div className="rounded-lg bg-secondary p-4 border border-border/60">
                <p className="font-pixel text-[8px] text-amber-400 mb-2">PROBLEM</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {idea.pain_point}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-4 border border-border/60">
                <p className="font-pixel text-[8px] text-cyan-400 mb-2">WHO NEEDS IT</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {idea.target_audience}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-4 border border-border/60">
                <p className="font-pixel text-[8px] text-emerald-400 mb-2">REVENUE</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {idea.monetization}
                </p>
              </div>
            </div>

            {/* Build with Claude */}
            <div className="mb-6">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-violet-400 border-violet-500/30 hover:bg-violet-500/10"
                onClick={() => setShowPrompt(!showPrompt)}
              >
                <Cpu className="size-4" />
                Build with Claude
                {showPrompt ? <ChevronUp className="size-3 ml-auto" /> : <ChevronDown className="size-3 ml-auto" />}
              </Button>
              {showPrompt && (
                <div className="mt-2 relative">
                  <textarea
                    readOnly
                    value={generateClaudePrompt(idea)}
                    className="w-full rounded-lg bg-secondary border border-border p-3 text-xs font-mono text-muted-foreground leading-relaxed resize-none h-48"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 text-xs"
                    onClick={handleCopyPrompt}
                  >
                    <Copy className="size-3" />
                    Copy
                  </Button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t-2 border-border pt-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs font-mono">
                  {platformLabel[idea.source_platform]}
                </Badge>
                <a
                  href={idea.source_urls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-amber-400 transition-colors"
                >
                  View source <ExternalLink className="size-3" />
                </a>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
                onClick={() => {
                  setOpen(false);
                  setShowShare(true);
                }}
              >
                <Share2 className="size-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}

      <SocialCard idea={idea} open={showShare} onClose={() => setShowShare(false)} />
    </>
  );
}
