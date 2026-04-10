import { getTodayIdeas, getAllIdeas, getAvailableDates } from "@/lib/queries";
import { IdeaCard } from "@/components/ideas/idea-card";
import { SpotlightCard } from "@/components/ideas/spotlight-card";
import { MarqueeTicker } from "@/components/layout/marquee-ticker";
import { ScannerRibbon } from "@/components/scanner-ribbon";
import { ArchiveSection } from "@/components/archive-section";
import Link from "next/link";

export default async function Home() {
  const todayIdeas = await getTodayIdeas();
  const allIdeas = await getAllIdeas();
  const dates = await getAvailableDates();

  // Compute category counts
  const categoryCounts: Record<string, { count: number; ideas: string[] }> = {};
  for (const idea of allIdeas) {
    if (!categoryCounts[idea.category]) {
      categoryCounts[idea.category] = { count: 0, ideas: [] };
    }
    categoryCounts[idea.category].count++;
    if (categoryCounts[idea.category].ideas.length < 3) {
      categoryCounts[idea.category].ideas.push(idea.name);
    }
  }

  const spotlight = todayIdeas[0];

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="text-center px-6 sm:px-12 pt-24 pb-0 flex flex-col items-center">
        {/* Eyebrow */}
        <div className="font-label text-[11px] tracking-[0.12em] uppercase text-[var(--copper)] mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--copper)] opacity-40" />
          CURATED DAILY
          <span className="w-8 h-px bg-[var(--copper)] opacity-40" />
        </div>

        {/* Title */}
        <h1 className="font-display text-6xl sm:text-[96px] font-normal text-[var(--text-display)] tracking-[-0.04em] leading-none mb-6">
          SIDE <span className="text-[var(--copper)]">QUEST</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg font-light text-[var(--text-secondary)] leading-relaxed max-w-[500px] mb-9">
          The internet&apos;s pain points, distilled into{" "}
          <strong className="text-[var(--copper)] font-normal">10 buildable ideas</strong>{" "}
          every morning. No noise. Just signal.
        </p>

        {/* CTA buttons */}
        <div className="flex gap-3 mb-12">
          <a
            href="#ideas"
            className="font-label text-[11px] tracking-[0.06em] uppercase px-7 py-3.5 rounded-full bg-[var(--copper)] text-[var(--bg)] cursor-pointer transition-all duration-200 hover:opacity-85 hover:-translate-y-px shadow-[0_4px_20px_rgba(196,149,106,0.15)] hover:shadow-[0_8px_32px_rgba(196,149,106,0.25)] inline-block"
          >
            TODAY&apos;S DROP &darr;
          </a>
          <a
            href="#how"
            className="font-label text-[11px] tracking-[0.06em] uppercase px-7 py-3.5 rounded-full bg-transparent text-[var(--text-primary)] border border-[var(--glass-border)] cursor-pointer transition-all duration-200 hover:border-[var(--copper)] hover:text-[var(--copper)] inline-block"
          >
            HOW IT WORKS
          </a>
        </div>

        {/* Scanner ribbon */}
        <ScannerRibbon ideasCount={todayIdeas.length} postsAnalyzed={847} />
        {/* Scan sweep */}
        <div className="w-full max-w-[900px] h-0.5 bg-[rgba(255,255,255,0.03)] rounded-[1px] overflow-hidden">
          <div className="h-full w-0 bg-gradient-to-r from-transparent via-[var(--copper)] to-transparent" style={{ animation: "sweep 3s ease-in-out infinite" }} />
        </div>
      </section>

      <div className="h-16" />

      {/* ── Ticker ── */}
      <MarqueeTicker ideas={todayIdeas} />

      {/* ── Spotlight ── */}
      {spotlight && (
        <div className="mt-16">
          <SpotlightCard idea={spotlight} />
        </div>
      )}

      {/* ── Ideas Grid ── */}
      <div id="ideas" className="px-6 sm:px-12 py-16">
        <div className="flex justify-between items-baseline mb-8">
          <span className="font-label text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">
            TODAY&apos;S IDEAS
          </span>
          <span className="font-label text-[11px] text-[var(--text-disabled)]">
            {todayIdeas.length} AVAILABLE
          </span>
        </div>

        {todayIdeas.length > 0 ? (
          <div className="grid-ideas grid grid-cols-1 sm:grid-cols-2 gap-8">
            {todayIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-16 text-center cursor-default">
            <p className="text-[var(--text-secondary)]">
              No ideas distilled yet today. Check back soon.
            </p>
          </div>
        )}
      </div>

      {/* ── Categories ── */}
      <div id="categories" className="px-6 sm:px-12 py-24 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex justify-between items-baseline mb-8">
          <span className="font-label text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">
            CATEGORIES
          </span>
          <span className="font-label text-[11px] text-[var(--text-disabled)]">
            {Object.keys(categoryCounts).length} CATEGORIES
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(categoryCounts).map(([cat, data]) => (
            <Link
              key={cat}
              href={`/ideas?category=${encodeURIComponent(cat)}`}
              className="glass-card hover:cursor-pointer block"
            >
              <div className="font-display text-[42px] text-[var(--text-display)] leading-none mb-2.5 tracking-[-0.02em]">
                {data.count}
              </div>
              <div className="font-label text-xs tracking-[0.08em] uppercase text-[var(--text-secondary)] mb-4 transition-colors duration-200 group-hover:text-[var(--copper)]">
                {cat}
              </div>
              <div className="flex flex-col gap-2 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                {data.ideas.map((name) => (
                  <span key={name} className="text-sm text-[var(--text-disabled)]">{name}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Archive ── */}
      <ArchiveSection dates={dates} />

      {/* ── How It Works ── */}
      <div id="how" className="px-6 sm:px-12 py-24 border-t border-[rgba(255,255,255,0.06)]">
        <div className="font-label text-[10px] tracking-[0.12em] uppercase text-[var(--text-secondary)] mb-12 text-center">
          HOW IT WORKS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-[900px] mx-auto">
          {[
            {
              num: "01",
              title: "Scan the noise",
              desc: "Bots sweep Reddit, HN, and Product Hunt overnight for complaints and unmet needs.",
            },
            {
              num: "02",
              title: "Distill the signal",
              desc: "AI reduces hundreds of posts to 10 actionable ideas with full context.",
            },
            {
              num: "03",
              title: "Pick and ship",
              desc: "Generate a build prompt, open your editor, and start building.",
            },
          ].map((step) => (
            <div key={step.num} className="glass-card text-center cursor-default p-8">
              <div className="font-display text-[42px] text-[var(--copper)] leading-none mb-4">
                {step.num}
              </div>
              <div className="text-base font-medium text-[var(--text-display)] mb-2">
                {step.title}
              </div>
              <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
