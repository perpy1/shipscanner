import {
  getIdeasByDate,
  getAvailableDates,
  getScanByDate,
} from "@/lib/queries";
import { IdeaCard } from "@/components/ideas/idea-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Cpu } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await props.params;
  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return {
    title: `Ideas for ${formatted} — SideQuest`,
    description: `AI-generated app ideas from ${formatted}. Sourced from real pain points on Reddit, HN, and Product Hunt.`,
  };
}

export default async function DatePage(props: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await props.params;
  const dates = await getAvailableDates();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const ideas = await getIdeasByDate(date);
  const scan = await getScanByDate(date);

  const currentIdx = dates.indexOf(date);
  const prevDate =
    currentIdx < dates.length - 1 ? dates[currentIdx + 1] : null;
  const nextDate = currentIdx > 0 ? dates[currentIdx - 1] : null;

  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link
            href="/ideas"
            className="hover:text-amber-400 transition-colors"
          >
            All Ideas
          </Link>
          <ChevronRight className="size-3" />
          <span>{formatted}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-pixel text-[10px] text-amber-400 mb-2">
              DAILY DROP
            </p>
            <h1 className="text-2xl font-bold tracking-tight">{formatted}</h1>
            {scan && (
              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs font-mono">
                  <Cpu className="mr-1 size-3" />
                  {scan.posts_analyzed} posts scanned
                </Badge>
                <span>{scan.sources_scraped} sources</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {prevDate ? (
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-mono"
                render={<Link href={`/ideas/${prevDate}`} />}
              >
                <ChevronLeft className="size-4" />
                Prev
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="text-xs font-mono" disabled>
                <ChevronLeft className="size-4" />
                Prev
              </Button>
            )}
            {nextDate ? (
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-mono"
                render={<Link href={`/ideas/${nextDate}`} />}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="text-xs font-mono" disabled>
                Next
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {ideas.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      ) : (
        <div className="pixel-border rounded-lg bg-card p-12 text-center">
          <p className="text-muted-foreground">
            No ideas found for this date.
          </p>
          <Button
            variant="outline"
            className="mt-4 font-mono text-xs"
            render={<Link href="/ideas" />}
          >
            Browse all ideas
          </Button>
        </div>
      )}
    </div>
  );
}
