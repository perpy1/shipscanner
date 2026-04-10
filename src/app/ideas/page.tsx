import { Suspense } from "react";
import { getAllIdeas, getAvailableDates } from "@/lib/queries";
import { IdeaCard } from "@/components/ideas/idea-card";
import { IdeaFilters } from "@/components/ideas/idea-filters";
import { Category, Difficulty } from "@/types";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive — SideQuest",
  description: "Browse all curated app ideas, filtered by category, difficulty, and potential.",
};

async function IdeasGrid({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? (params.category as Category) : undefined;
  const difficulty = typeof params.difficulty === "string" ? (params.difficulty as Difficulty) : undefined;
  const sort = typeof params.sort === "string" ? (params.sort as "newest" | "viral" | "upvotes") : undefined;
  const ideas = await getAllIdeas({ category, difficulty, sort });

  if (ideas.length === 0) {
    return (
      <div className="glass-card p-12 text-center cursor-default">
        <p className="text-[var(--text-secondary)]">No ideas match your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid-ideas grid gap-8 sm:grid-cols-2">
      {ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)}
    </div>
  );
}

export default async function IdeasPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const dates = await getAvailableDates();

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-12 py-12">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <div className="font-label text-[10px] tracking-[0.12em] uppercase text-[var(--copper)] mb-3">
            FULL ARCHIVE
          </div>
          <h1 className="font-display text-4xl font-normal text-[var(--text-display)] tracking-[-0.02em] mb-2">
            All Ideas
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {dates.length} day{dates.length !== 1 ? "s" : ""} of curated ideas distilled
          </p>
        </div>
        <div className="flex gap-2">
          {dates.slice(0, 3).map((date) => (
            <Link
              key={date}
              href={`/ideas/${date}`}
              className="font-label text-[10px] tracking-[0.06em] uppercase px-4 py-2 rounded-full border border-[var(--glass-border)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--copper)] hover:text-[var(--copper)]"
            >
              {new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <Suspense><IdeaFilters /></Suspense>
      </div>

      <Suspense fallback={<IdeasSkeleton />}>
        <IdeasGrid searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

function IdeasSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 animate-pulse glass-card" />
      ))}
    </div>
  );
}
