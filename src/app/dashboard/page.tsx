import { getAllIdeas } from "@/lib/queries";
import { IdeaCard } from "@/components/ideas/idea-card";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — SideQuest",
};

export default async function DashboardPage() {
  const allIdeas = await getAllIdeas({ sort: "viral" });
  const topIdeas = allIdeas.slice(0, 6);
  const topViral = allIdeas.length > 0 ? Math.max(...allIdeas.map((i) => i.viral_potential)) : 0;

  const stats = [
    { label: "Ideas generated", value: String(allIdeas.length) },
    { label: "Top potential", value: `${topViral}/5` },
    { label: "Saved ideas", value: "0", hint: "Tap Save on any idea" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1080px] px-8 py-12">
      <div className="mb-10">
        <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--accent)] mb-2">
          Your HQ
        </div>
        <h1 className="font-head text-[clamp(28px,4vw,40px)] leading-[1.05] text-[var(--text)] m-0">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-[var(--dim)]">Your saved ideas and top picks.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-[18px] sm:grid-cols-3 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 shadow-[var(--shadow)]">
            <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--mute)] mb-3">{s.label}</div>
            <div className="font-head text-[40px] leading-none text-[var(--text)]">{s.value}</div>
            {s.hint && <div className="text-xs text-[var(--mute)] mt-2">{s.hint}</div>}
          </div>
        ))}
      </div>

      {/* Top Ideas */}
      <section>
        <div className="flex items-end justify-between gap-5 flex-wrap mb-[34px]">
          <div>
            <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--accent)] mb-2">
              Highest potential
            </div>
            <h2 className="font-head text-[clamp(24px,3.5vw,34px)] leading-[1.05] text-[var(--text)] m-0">
              Most viral ideas
            </h2>
          </div>
          <span className="text-[13px] text-[var(--mute)]">{topIdeas.length} shown</span>
        </div>

        {topIdeas.length > 0 ? (
          <div className="grid-ideas grid gap-[18px] sm:grid-cols-2 items-start">
            {topIdeas.map((idea, i) => (
              <IdeaCard key={idea.id} idea={idea} index={i} />
            ))}
          </div>
        ) : (
          <div className="glass-card cursor-default text-center py-12">
            <p className="text-[var(--dim)]">No ideas yet. The next scan runs overnight.</p>
          </div>
        )}
      </section>
    </div>
  );
}
