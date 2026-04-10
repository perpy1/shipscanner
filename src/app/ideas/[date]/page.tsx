import { getIdeasByDate, getAvailableDates, getScanByDate } from "@/lib/queries";
import { IdeaCard } from "@/components/ideas/idea-card";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await props.params;
  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return { title: `Ideas for ${formatted} — SideQuest`, description: `Curated app ideas from ${formatted}.` };
}

export default async function DatePage(props: { params: Promise<{ date: string }> }) {
  const { date } = await props.params;
  const dates = await getAvailableDates();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  const ideas = await getIdeasByDate(date);
  const scan = await getScanByDate(date);
  const currentIdx = dates.indexOf(date);
  const prevDate = currentIdx < dates.length - 1 ? dates[currentIdx + 1] : null;
  const nextDate = currentIdx > 0 ? dates[currentIdx - 1] : null;
  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-12 py-12">
      <div className="mb-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
          <Link href="/ideas" className="hover:text-[var(--copper)] transition-colors">Archive</Link>
          <span className="text-[var(--text-disabled)]">/</span>
          <span>{formatted}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-label text-[10px] tracking-[0.12em] uppercase text-[var(--copper)] mb-3">
              DAILY DROP
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-normal text-[var(--text-display)] tracking-[-0.02em] mb-2">
              {formatted}
            </h1>
            {scan && (
              <div className="mt-2 flex items-center gap-4 font-label text-[10px] tracking-[0.08em] uppercase text-[var(--text-secondary)]">
                <span>{scan.posts_analyzed} posts scanned</span>
                <span className="w-px h-3 bg-[rgba(255,255,255,0.06)]" />
                <span>{scan.sources_scraped} sources</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {prevDate ? (
              <Link
                href={`/ideas/${prevDate}`}
                className="font-label text-[10px] tracking-[0.06em] uppercase px-4 py-2 rounded-full border border-[var(--glass-border)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--copper)] hover:text-[var(--copper)]"
              >
                &larr; Prev
              </Link>
            ) : (
              <span className="font-label text-[10px] tracking-[0.06em] uppercase px-4 py-2 rounded-full border border-[var(--glass-border)] text-[var(--text-disabled)] opacity-50 cursor-not-allowed">
                &larr; Prev
              </span>
            )}
            {nextDate ? (
              <Link
                href={`/ideas/${nextDate}`}
                className="font-label text-[10px] tracking-[0.06em] uppercase px-4 py-2 rounded-full border border-[var(--glass-border)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--copper)] hover:text-[var(--copper)]"
              >
                Next &rarr;
              </Link>
            ) : (
              <span className="font-label text-[10px] tracking-[0.06em] uppercase px-4 py-2 rounded-full border border-[var(--glass-border)] text-[var(--text-disabled)] opacity-50 cursor-not-allowed">
                Next &rarr;
              </span>
            )}
          </div>
        </div>
      </div>

      {ideas.length > 0 ? (
        <div className="grid-ideas grid gap-8 sm:grid-cols-2">
          {ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)}
        </div>
      ) : (
        <div className="glass-card p-12 text-center cursor-default">
          <p className="text-[var(--text-secondary)]">No ideas distilled on this date.</p>
          <Link
            href="/ideas"
            className="inline-block mt-4 font-label text-[10px] tracking-[0.06em] uppercase px-5 py-2 rounded-full border border-[var(--glass-border)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--copper)] hover:text-[var(--copper)]"
          >
            Back to archive
          </Link>
        </div>
      )}
    </div>
  );
}
