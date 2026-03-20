"use client";

import { Idea } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Flame, Sparkles } from "lucide-react";
import { IdeaCardModal } from "./idea-card-modal";

export function SpotlightCard({ idea }: { idea: Idea }) {
  return (
    <div className="relative">
      {/* Amber glow */}
      <div className="absolute inset-0 rounded-lg bg-amber-500/10 blur-xl" />

      <div className="relative pixel-border rounded-lg bg-card p-6 sm:p-8 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
        {/* Editor's Pick badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-amber-500 text-black font-pixel text-[9px] border-0">
            <Sparkles className="size-3 mr-1" />
            EDITOR&apos;S PICK
          </Badge>
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

        {/* Idea details inline */}
        <h3 className="font-pixel text-base sm:text-lg text-amber-400 mb-2 leading-relaxed">
          {idea.name}
        </h3>
        <p className="text-base text-foreground/90 leading-relaxed mb-3">
          {idea.one_liner}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {idea.description}
        </p>

        {/* Details grid */}
        <div className="grid gap-3 sm:grid-cols-3 mb-4">
          <div className="rounded-lg bg-secondary p-3 border border-border/60">
            <p className="font-pixel text-[7px] text-amber-400 mb-1">THE PROBLEM</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{idea.pain_point}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 border border-border/60">
            <p className="font-pixel text-[7px] text-cyan-400 mb-1">WHO NEEDS IT</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{idea.target_audience}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 border border-border/60">
            <p className="font-pixel text-[7px] text-emerald-400 mb-1">GOLD POTENTIAL</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{idea.monetization}</p>
          </div>
        </div>

        {/* Click to expand */}
        <IdeaCardModal idea={idea} />
      </div>
    </div>
  );
}
