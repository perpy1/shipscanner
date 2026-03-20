import { getTodayIdeas } from "@/lib/queries";
import { IdeaCard } from "@/components/ideas/idea-card";
import { SpotlightCard } from "@/components/ideas/spotlight-card";
import { HeroTypewriter } from "@/components/hero-typewriter";
import { Badge } from "@/components/ui/badge";
import { Swords, Cpu, Scroll, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const todayIdeas = await getTodayIdeas();

  const sortedByViral = [...todayIdeas].sort((a, b) => b.viral_potential - a.viral_potential);
  const spotlightIdea = sortedByViral[0] ?? null;
  const remainingIdeas = spotlightIdea
    ? todayIdeas.filter((i) => i.id !== spotlightIdea.id)
    : todayIdeas;

  return (
    <div className="flex flex-col scanlines">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <div className="pointer-events-none absolute top-[-200px] left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-amber-500/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/[0.04] blur-[100px]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-8 border-amber-500/30 bg-amber-500/5 text-amber-400 font-pixel text-[9px]"
          >
            <Sparkles className="mr-1.5 size-3" />
            NEW QUEST AVAILABLE
          </Badge>

          <HeroTypewriter />

          <p className="mx-auto mt-8 max-w-xl text-base text-muted-foreground leading-relaxed">
            The internet complained all night. We took notes. Here are{" "}
            <strong className="text-amber-400">10 problems</strong> worth
            building.
          </p>

          <div className="mt-10">
            <Button
              size="lg"
              className="bg-amber-500 text-black font-bold hover:bg-amber-400 border-0 text-sm px-8"
              render={<Link href="/ideas" />}
            >
              Browse Quests
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Spotlight — Idea of the Day */}
      {spotlightIdea && (
        <section className="relative px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="font-pixel text-[10px] text-amber-400 mb-4 text-center">
              IDEA OF THE DAY
            </p>
            <SpotlightCard idea={spotlightIdea} />
          </div>
        </section>
      )}

      {/* Today's Ideas */}
      <section className="relative px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-pixel text-[10px] text-amber-400 mb-2">
                DAILY LOOT DROP
              </p>
              <h2 className="text-2xl font-bold tracking-tight">
                Today&apos;s Quests
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Freshly scouted this morning. Pick one and start building.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-amber-400 text-xs"
              render={<Link href="/ideas" />}
            >
              All Quests
              <ArrowRight className="ml-1 size-3" />
            </Button>
          </div>
          {remainingIdeas.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {remainingIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className="pixel-border rounded-lg p-16 text-center bg-card">
              <Cpu className="mx-auto mb-4 size-8 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                Today&apos;s quest board hasn&apos;t loaded yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="font-pixel text-[10px] text-cyan-400 mb-2 text-center">
            HOW TO PLAY
          </p>
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight">
            Three steps to your next app
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Swords,
                step: "01",
                title: "We scout",
                desc: "Our bots raid Reddit, HN, and Product Hunt every morning — finding the complaints, the frustrations, the \"why doesn't this exist\" posts.",
                color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
              },
              {
                icon: Cpu,
                step: "02",
                title: "We curate",
                desc: "Hundreds of posts get distilled into 10 legit app ideas — complete with who needs it, how to charge, and how hard it is to build.",
                color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
              },
              {
                icon: Scroll,
                step: "03",
                title: "You ship",
                desc: "Pick a quest that vibes with you, open your editor, and start building. Weekend projects to month-long campaigns — your call.",
                color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="pixel-border rounded-lg bg-card p-5 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex size-10 items-center justify-center rounded-lg border ${step.color}`}>
                    <step.icon className="size-5" />
                  </div>
                  <span className="font-pixel text-[10px] text-muted-foreground/40">
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
