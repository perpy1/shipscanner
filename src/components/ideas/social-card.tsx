"use client";

import { useRef, useState } from "react";
import { Idea } from "@/types";
import { Copy, Check, X } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas-pro";

const diffColor: Record<string, string> = {
  Weekend: "#6FCF97",
  Week: "#E0B15B",
  Month: "#E07A8B",
};

export function SocialCard({ idea, open, onClose }: { idea: Idea; open: boolean; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: "#14161B", scale: 2, useCORS: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopied(true);
          toast.success("Image copied — paste it anywhere.");
          setTimeout(() => setCopied(false), 3000);
        } catch {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sidequest-${idea.name.toLowerCase().replace(/\s+/g, "-")}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Image downloaded.");
        }
      }, "image/png");
    } catch {
      toast.error("Failed to generate image");
    }
  }

  if (!open) return null;

  const platformLabel: Record<string, string> = {
    reddit: "Reddit",
    hackernews: "Hacker News",
    producthunt: "Product Hunt",
    stackoverflow: "Stack Overflow",
    github: "GitHub",
    appstore: "the App Store",
  };
  const platform = platformLabel[idea.source_platform] ?? idea.source_platform;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Share ${idea.name}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative z-10 flex flex-col items-center gap-4">
        <button onClick={onClose} aria-label="Close" className="absolute -top-2 -right-2 z-20 rounded-full bg-[#1A1D24] border border-[rgba(255,255,255,0.12)] p-1.5 text-[#9DA0A8] hover:text-[#ECEAE4]">
          <X className="size-4" />
        </button>

        {/* The shareable card */}
        <div
          ref={cardRef}
          style={{
            width: 520,
            padding: 36,
            background: "#14161B",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.09)",
            fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, color: "#ECEAE4" }}>SideQuest</span>
            <span style={{ fontSize: 12, color: "#6B6E76" }}>sidequest-gray.vercel.app</span>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2FA89B", marginBottom: 14 }}>
            {idea.category}
          </div>

          <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 38, color: "#ECEAE4", lineHeight: 1.05, marginBottom: 12 }}>
            {idea.name}
          </div>
          <div style={{ fontSize: 16, color: "#9DA0A8", lineHeight: 1.5, marginBottom: 24 }}>{idea.one_liner}</div>

          <div style={{ background: "#1A1D24", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 18px", marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B6E76", marginBottom: 6 }}>Who needs it</div>
            <div style={{ fontSize: 14, color: "#ECEAE4", lineHeight: 1.45 }}>{idea.target_audience}</div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: diffColor[idea.difficulty] ?? "#9DA0A8" }}>● {idea.difficulty}</span>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= idea.viral_potential ? "#2FA89B" : "rgba(255,255,255,0.06)" }} />
              ))}
            </span>
            <span style={{ fontSize: 12, color: "#6B6E76" }}>Found on {platform}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-[10px] cursor-pointer transition-all duration-200"
            style={{ background: "#2FA89B", color: "#14161B" }}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy image"}
          </button>
          <button onClick={onClose} className="text-sm font-semibold px-5 py-2.5 rounded-[10px] bg-[#1B1E26] text-[#ECEAE4] border border-[rgba(255,255,255,0.09)] cursor-pointer hover:text-[#2FA89B] transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
