"use client";

import { useRef, useState } from "react";
import { Idea } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Check, X } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas-pro";

const difficultyLabel: Record<string, string> = {
  Weekend: "Penny Slots",
  Week: "Mid Stakes",
  Month: "High Roller",
};

export function SocialCard({ idea, open, onClose }: { idea: Idea; open: boolean; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: "#0c0c0c", scale: 2, useCORS: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopied(true);
          toast.success("Image copied! Paste it on Twitter.");
          setTimeout(() => setCopied(false), 3000);
        } catch {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sidequest-${idea.name.toLowerCase().replace(/\s+/g, "-")}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Image downloaded!");
        }
      }, "image/png");
    } catch { toast.error("Failed to generate image"); }
  }

  if (!open) return null;

  const dollars = "💰".repeat(Math.min(idea.viral_potential, 5));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200" />
      <div onClick={(e) => e.stopPropagation()} className="relative z-10 flex flex-col items-center gap-4 animate-in zoom-in-95 fade-in duration-200">
        <button onClick={onClose} className="absolute -top-2 -right-2 z-20 rounded-full bg-[#1a1a1a] border-2 border-[#333] p-1 text-[#555] hover:text-[#f0ebe0]">
          <X className="size-4" />
        </button>

        <div
          ref={cardRef}
          style={{
            width: 520, padding: 32,
            background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)",
            borderRadius: 16, border: "3px solid #333", fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>♦</span>
              <span style={{ fontFamily: "'PressStart2P', monospace", fontSize: 10, color: "#d4a017" }}>Side</span>
              <span style={{ fontFamily: "'PressStart2P', monospace", fontSize: 10, color: "#c0392b" }}>Quest</span>
            </div>
            <span style={{ fontSize: 12, color: "#555" }}>sidequest-gray.vercel.app</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span style={{ padding: "3px 10px", borderRadius: 6, background: "#1e1e1e", color: "#f0ebe0", fontSize: 11, border: "1px solid #333" }}>{idea.category}</span>
            <span style={{ padding: "3px 10px", borderRadius: 6, background: "rgba(212,160,23,0.1)", color: "#d4a017", fontSize: 11, border: "1px solid rgba(212,160,23,0.2)" }}>{difficultyLabel[idea.difficulty]}</span>
          </div>

          <div style={{ fontFamily: "'PressStart2P', monospace", fontSize: 18, color: "#d4a017", marginBottom: 8, lineHeight: 1.6 }}>{idea.name}</div>
          <div style={{ fontSize: 15, color: "#f0ebe0", marginBottom: 16, lineHeight: 1.6 }}>{idea.one_liner}</div>

          <div style={{ display: "flex", gap: 16, padding: "12px 16px", background: "#1e1e1e", borderRadius: 8, border: "1px solid #333", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 9, color: "#d4a017", marginBottom: 4, fontFamily: "'PressStart2P', monospace" }}>PAYOUT</div>
              <div style={{ fontSize: 14 }}>{dollars}</div>
            </div>
            <div style={{ width: 1, background: "#333" }} />
            <div>
              <div style={{ fontSize: 9, color: "#c0392b", marginBottom: 4, fontFamily: "'PressStart2P', monospace" }}>AUDIENCE</div>
              <div style={{ fontSize: 12, color: "#8a8575", lineHeight: 1.4 }}>{idea.target_audience}</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#555" }}>Found on {idea.source_platform === "reddit" ? "Reddit" : "Hacker News"}</span>
            <span style={{ fontFamily: "'PressStart2P', monospace", fontSize: 8, color: "#333" }}>JACKPOT IDEA</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleCopy} className="bg-[#c0392b] text-white font-bold hover:bg-[#e74c3c] border-0">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy Image"}
          </Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
