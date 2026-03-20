"use client";

import { useRef, useState } from "react";
import { Idea } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Check, X } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas-pro";

const difficultyLabel: Record<string, string> = {
  Weekend: "Weekend Quest",
  Week: "Week-long Raid",
  Month: "Epic Campaign",
};

export function SocialCard({
  idea,
  open,
  onClose,
}: {
  idea: Idea;
  open: boolean;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0f0e17",
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopied(true);
          toast.success("Image copied! Paste it on Twitter.");
          setTimeout(() => setCopied(false), 3000);
        } catch {
          // Fallback: download
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sidequest-${idea.name.toLowerCase().replace(/\s+/g, "-")}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Image downloaded!");
        }
      }, "image/png");
    } catch {
      toast.error("Failed to generate image");
    }
  }

  if (!open) return null;

  const flames = "🔥".repeat(idea.viral_potential);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex flex-col items-center gap-4 animate-in zoom-in-95 fade-in duration-200"
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 rounded-full bg-card border-2 border-border p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        {/* The shareable card */}
        <div
          ref={cardRef}
          style={{
            width: 520,
            padding: 32,
            background: "linear-gradient(135deg, #0f0e17 0%, #1a1932 50%, #0f0e17 100%)",
            borderRadius: 16,
            border: "3px solid #2e2c50",
            fontFamily: "monospace",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>📜</span>
              <span style={{ fontFamily: "'PressStart2P', monospace", fontSize: 10, color: "#f59e0b" }}>Side</span>
              <span style={{ fontFamily: "'PressStart2P', monospace", fontSize: 10, color: "#06b6d4" }}>Quest</span>
            </div>
            <span style={{ fontSize: 12, color: "#8b8aa0" }}>sidequest-gray.vercel.app</span>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span style={{
              padding: "3px 10px",
              borderRadius: 6,
              background: "#242240",
              color: "#e5e5e5",
              fontSize: 11,
              border: "1px solid #2e2c50",
            }}>
              {idea.category}
            </span>
            <span style={{
              padding: "3px 10px",
              borderRadius: 6,
              background: "rgba(245, 158, 11, 0.1)",
              color: "#f59e0b",
              fontSize: 11,
              border: "1px solid rgba(245, 158, 11, 0.2)",
            }}>
              {difficultyLabel[idea.difficulty]}
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontFamily: "'PressStart2P', monospace",
            fontSize: 18,
            color: "#f59e0b",
            marginBottom: 8,
            lineHeight: 1.6,
          }}>
            {idea.name}
          </div>

          {/* One-liner */}
          <div style={{ fontSize: 15, color: "#e5e5e5", marginBottom: 16, lineHeight: 1.6 }}>
            {idea.one_liner}
          </div>

          {/* Stats row */}
          <div style={{
            display: "flex",
            gap: 16,
            padding: "12px 16px",
            background: "#242240",
            borderRadius: 8,
            border: "1px solid #2e2c50",
            marginBottom: 16,
          }}>
            <div>
              <div style={{ fontSize: 9, color: "#f59e0b", marginBottom: 4, fontFamily: "'PressStart2P', monospace" }}>VIRAL</div>
              <div style={{ fontSize: 14 }}>{flames}</div>
            </div>
            <div style={{ width: 1, background: "#2e2c50" }} />
            <div>
              <div style={{ fontSize: 9, color: "#06b6d4", marginBottom: 4, fontFamily: "'PressStart2P', monospace" }}>AUDIENCE</div>
              <div style={{ fontSize: 12, color: "#8b8aa0", lineHeight: 1.4 }}>{idea.target_audience}</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#8b8aa0" }}>
              Found on {idea.source_platform === "reddit" ? "Reddit" : "Hacker News"}
            </span>
            <span style={{ fontFamily: "'PressStart2P', monospace", fontSize: 8, color: "#4b4970" }}>
              QUEST AVAILABLE
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCopy}
            className="bg-amber-500 text-black font-bold hover:bg-amber-400 border-0"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy Image"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
