"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send } from "lucide-react";

export function SubscribeForm() {
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
        toast.success("Quest accepted! Check your inbox tomorrow.");
        setEmail("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to join. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 border-2 border-border bg-secondary px-4 placeholder:text-muted-foreground/40 focus:border-amber-500/60"
        required
      />
      <Button
        type="submit"
        disabled={loading}
        className="bg-amber-500 text-black font-bold hover:bg-amber-400 border-0 px-5"
      >
        {loading ? "Joining..." : "Join"}
        {!loading && <Send className="ml-1.5 size-3.5" />}
      </Button>
    </form>
  );
}
