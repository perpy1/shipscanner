import { getTodayIdeas, getAllIdeas, getAvailableDates, getScanByDate } from "@/lib/queries";
import { IdeaCard } from "@/components/ideas/idea-card";
import { ArchiveSection } from "@/components/archive-section";
import { HeroCtas } from "@/components/hero-ctas";
import { SubscribeForm } from "@/components/subscribe-form";
import { SUBSTACK_URL } from "@/lib/substack";
import Link from "next/link";

export default async function Home() {
  const todayIdeas = await getTodayIdeas();
  const allIdeas = await getAllIdeas();
  const dates = await getAvailableDates();

  const today = new Date().toISOString().split("T")[0];
  const scan = await getScanByDate(today);
  const scanned = scan?.posts_analyzed ?? null;

  const longDate = new Date(today + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Category counts
  const categoryCounts: Record<string, { count: number; ideas: string[] }> = {};
  for (const idea of allIdeas) {
    if (!categoryCounts[idea.category]) categoryCounts[idea.category] = { count: 0, ideas: [] };
    categoryCounts[idea.category].count++;
    if (categoryCounts[idea.category].ideas.length < 3) categoryCounts[idea.category].ideas.push(idea.name);
  }

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <header className="mx-auto w-full max-w-[1080px] px-8 pt-[clamp(54px,9vw,100px)] pb-[clamp(36px,5vw,56px)]">
        <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--accent)] mb-5">
          Today · {longDate}
        </div>
        <h1 className="font-head text-[clamp(50px,9vw,98px)] leading-[0.98] text-[var(--text)] m-0">
          SideQuest
        </h1>
        <p className="text-[clamp(17px,2.2vw,21px)] leading-[1.55] text-[var(--dim)] max-w-[600px] mt-6">
          The internet&apos;s pain points, distilled into{" "}
          <em className="not-italic text-[var(--text)] font-semibold">ten buildable ideas</em>{" "}
          every morning. No noise — just the signal worth building.
        </p>
        <HeroCtas />
        <div className="mt-[26px] text-[13px] text-[var(--mute)]">
          {scanned ? `${scanned.toLocaleString()} posts scanned overnight` : "Scanned overnight"} · {todayIdeas.length || 10} ideas survived the cut
        </div>
      </header>

      {/* ── Ideas Grid ── */}
      <section id="ideas" className="mx-auto w-full max-w-[1080px] px-8 py-11">
        <div className="flex items-end justify-between gap-5 flex-wrap mb-[34px]">
          <div>
            <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--accent)] mb-2">
              Today&apos;s drop
            </div>
            <h2 className="font-head text-[clamp(28px,4vw,40px)] leading-[1.05] text-[var(--text)] m-0">
              Ten ideas worth building
            </h2>
          </div>
          <span className="text-[13px] text-[var(--mute)]">Sorted by potential · tap to expand</span>
        </div>

        {todayIdeas.length > 0 ? (
          <div className="grid-ideas grid grid-cols-1 md:grid-cols-2 gap-[18px] items-start">
            {todayIdeas.map((idea, i) => (
              <IdeaCard key={idea.id} idea={idea} index={i} featured={i === 0} />
            ))}
          </div>
        ) : (
          <div className="glass-card cursor-default text-center py-16">
            <p className="text-[var(--dim)]">No ideas distilled yet today — check back in the morning.</p>
          </div>
        )}
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="mx-auto w-full max-w-[1080px] px-8 py-11 border-t border-[var(--line)]">
        <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--accent)] mb-2">
          Browse
        </div>
        <h2 className="font-head text-[clamp(28px,4vw,40px)] leading-[1.05] text-[var(--text)] m-0 mb-[34px]">
          By category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {Object.entries(categoryCounts).map(([cat, data]) => (
            <Link key={cat} href={`/ideas?category=${encodeURIComponent(cat)}`} className="glass-card block">
              <div className="font-head text-[42px] text-[var(--text)] leading-none mb-2.5">{data.count}</div>
              <div className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--accent)] mb-4">{cat}</div>
              <div className="flex flex-col gap-2 pt-4 border-t border-[var(--line)]">
                {data.ideas.map((name, i) => (
                  <span key={`${cat}-${i}`} className="text-sm text-[var(--mute)]">{name}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Archive ── */}
      <ArchiveSection dates={dates} />

      {/* ── Newsletter (Substack) ── */}
      <section className="mx-auto w-full max-w-[1080px] px-8 py-11 border-t border-[var(--line)]">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow)] p-8 sm:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-[520px]">
            <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--accent)] mb-2">
              The newsletter
            </div>
            <h2 className="font-head text-[clamp(24px,3.5vw,34px)] leading-[1.1] text-[var(--text)] m-0 mb-2">
              Build the idea. Then grow it.
            </h2>
            <p className="text-[15px] text-[var(--dim)] leading-[1.55] m-0 mb-4">
              SideQuest shows you what to build. The newsletter shows you how to market it —
              creator growth, content systems, and AI automations that actually ship.
            </p>
            <SubscribeForm />
            <a
              href={SUBSTACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3.5 text-[13px] font-semibold text-[var(--dim)] hover:text-[var(--accent)] transition-colors"
            >
              Read past issues on Substack →
            </a>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="mx-auto w-full max-w-[1080px] px-8 py-11 border-t border-[var(--line)]">
        <div className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--accent)] mb-2">
          The pipeline
        </div>
        <h2 className="font-head text-[clamp(28px,4vw,40px)] leading-[1.05] text-[var(--text)] m-0">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-9 mt-7">
          {[
            { n: "01", t: "Scan the noise", d: "Every night we crawl Hacker News, Stack Exchange, GitHub and app store reviews for what people are actually complaining about." },
            { n: "02", t: "Distill the signal", d: "AI clusters the gripes, sets aside the noise, and shapes the ten most buildable into real product ideas." },
            { n: "03", t: "Pick and ship", d: "Open any idea for the pain point, audience and pricing — then copy a build prompt straight into your editor." },
          ].map((step) => (
            <div key={step.n}>
              <div className="font-head text-[34px] text-[var(--accent)]">{step.n}</div>
              <h3 className="font-head text-xl text-[var(--text)] mt-3 mb-2">{step.t}</h3>
              <p className="text-sm text-[var(--dim)] leading-[1.6] m-0">{step.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
