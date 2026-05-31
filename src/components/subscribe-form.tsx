"use client";

import { useState } from "react";
import { toast } from "sonner";

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("You're in — check your inbox to confirm.");
        setEmail("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to subscribe. Try again.");
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
        className="text-[15px] font-semibold px-5 py-3 rounded-[10px] cursor-pointer transition-all duration-200 disabled:opacity-60 whitespace-nowrap"
        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
      >
        {loading ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
