"use client";

import { useState } from "react";
import { toast } from "sonner";
import { subscribeUrl } from "@/lib/substack";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    // Hand off to Substack's hosted subscribe page (email prefilled) — it
    // handles the captcha/confirmation that the API blocks server-side.
    window.open(subscribeUrl(email), "_blank", "noopener,noreferrer");
    toast.success("Finishing on Substack — confirm in the new tab.");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className={`flex w-full gap-2.5 ${compact ? "max-w-md" : "max-w-[460px]"}`}>
      <input
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-label="Email address"
        className="flex-1 text-[15px] px-4 py-3 rounded-[10px] bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] placeholder:text-[var(--mute)] outline-none transition-colors duration-200 focus:border-[var(--accent)]"
      />
      <button
        type="submit"
        className="text-[15px] font-semibold px-5 py-3 rounded-[10px] cursor-pointer transition-all duration-200 whitespace-nowrap"
        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
      >
        Subscribe
      </button>
    </form>
  );
}
