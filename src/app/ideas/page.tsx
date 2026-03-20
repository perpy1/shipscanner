import { Suspense } from "react";
import { getAllIdeas, getAvailableDates } from "@/lib/queries";
import { IdeaCard } from "@/components/ideas/idea-card";
import { IdeaFilters } from "@/components/ideas/idea-filters";
import { Category, Difficulty } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quest Board — SideQuest",
  description: "Browse all curated app ideas, filtered by category, difficulty, and viral potential.",
};

async function IdeasGrid({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? (params.category as Category) : undefined;
  const difficulty = typeof params.difficulty === "string" ? (params.difficulty as Difficulty) : undefined;
  const sort = typeof params.sort === "string" ? (params.sort as "newest" | "viral" | "upvotes") : undefined;

  const ideas = await getAllIdeas({ category, difficulty, sort });

  if (ideas.length === 0) {
    return (
      <div className="pixel-border rounded-lg bg-card p-12 text-center">
        <p className="text-muted-foreground">No quests match your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}

export default async function IdeasPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const dates = await getAvailableDates();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-pixel text-[10px] text-amber-400 mb-2">
            QUEST BOARD
          </p>
          <h1 className="text-2xl font-bold tracking-tight">All Quests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {dates.length} day{dates.length !== 1 ? "s" : ""} of curated ideas from the wild
          </p>
        </div>
        <div className="flex gap-2">
          {dates.slice(0, 3).map((date) => (
            <Button
              key={date}
              variant="outline"
              size="sm"
              className="text-xs font-mono"
              render={<Link href={`/ideas/${date}`} />}
            >
              <Calendar className="mr-1 size-3" />
              {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <Suspense>
          <IdeaFilters />
        </Suspense>
      </div>

      <Suspense fallback={<IdeasSkeleton />}>
        <IdeasGrid searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

function IdeasSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 animate-pulse pixel-border rounded-lg bg-card" />
      ))}
    </div>
  );
}
