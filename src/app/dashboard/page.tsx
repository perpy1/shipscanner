import { getAllIdeas } from "@/lib/queries";
import { IdeaCard } from "@/components/ideas/idea-card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Sparkles, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — SideQuest",
};

export default async function DashboardPage() {
  const allIdeas = await getAllIdeas({ sort: "viral" });
  const topIdeas = allIdeas.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="font-pixel text-[10px] text-amber-400 mb-2">
          YOUR HQ
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your saved ideas and top picks
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <div className="pixel-border rounded-lg bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-amber-400" />
            <span className="font-pixel text-[9px] text-muted-foreground">IDEAS GENERATED</span>
          </div>
          <p className="text-3xl font-bold">{allIdeas.length}</p>
        </div>
        <div className="pixel-border rounded-lg bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-4 text-cyan-400" />
            <span className="font-pixel text-[9px] text-muted-foreground">TOP VIRAL SCORE</span>
          </div>
          <p className="text-3xl font-bold">
            {allIdeas.length > 0 ? Math.max(...allIdeas.map(i => i.viral_potential)) : 0}/5
          </p>
        </div>
        <div className="pixel-border rounded-lg bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="size-4 text-emerald-400" />
            <span className="font-pixel text-[9px] text-muted-foreground">SAVED IDEAS</span>
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="text-xs text-muted-foreground mt-1">Click the bookmark on any card</p>
        </div>
      </div>

      {/* Top Ideas */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="size-5 text-amber-400" />
          <h2 className="text-xl font-semibold">Most Viral Ideas</h2>
          <Badge variant="secondary" className="font-mono text-xs">{topIdeas.length}</Badge>
        </div>

        {topIdeas.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="pixel-border rounded-lg bg-card p-12 text-center">
            <Bookmark className="mx-auto mb-3 size-8 text-muted-foreground/40" />
            <p className="text-muted-foreground">
              No ideas yet. Run a scan first!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
