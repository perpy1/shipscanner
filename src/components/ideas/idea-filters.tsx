"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category, Difficulty } from "@/types";
import { playTap } from "@/lib/sounds";

const categories: Category[] = [
  "SaaS", "Developer Tool", "Marketplace", "AI/ML", "Productivity",
  "Fintech", "Social", "Health", "Education", "E-commerce",
];

const difficulties: Difficulty[] = ["Weekend", "Week", "Month"];

const difficultyLabels: Record<Difficulty, string> = {
  Weekend: "Weekend",
  Week: "Week",
  Month: "Month",
};

const sorts = [
  { value: "newest", label: "Newest" },
  { value: "viral", label: "Highest Potential" },
  { value: "upvotes", label: "Most Upvoted" },
];

export function IdeaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const activeDifficulty = searchParams.get("difficulty") || "";
  const activeSort = searchParams.get("sort") || "newest";

  function setFilter(key: string, value: string) {
    playTap();
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    router.push(`/ideas?${params.toString()}`);
  }

  function PillButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
      <button
        onClick={onClick}
        className={`font-label text-[10px] tracking-[0.08em] uppercase px-4 py-2 rounded-full border cursor-pointer transition-all duration-200 ${
          active
            ? "text-[var(--copper)] bg-[rgba(196,149,106,0.1)] border-[rgba(196,149,106,0.3)]"
            : "text-[var(--text-disabled)] bg-transparent border-[var(--glass-border)] hover:text-[var(--text-primary)] hover:border-[rgba(255,255,255,0.15)]"
        }`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Category pills */}
      <PillButton active={!activeCategory} onClick={() => setFilter("category", "")}>
        All
      </PillButton>
      {categories.map((cat) => (
        <PillButton
          key={cat}
          active={activeCategory === cat}
          onClick={() => setFilter("category", activeCategory === cat ? "" : cat)}
        >
          {cat}
        </PillButton>
      ))}

      {/* Separator */}
      <div className="w-px h-7 bg-[rgba(255,255,255,0.06)] self-center mx-2" />

      {/* Difficulty pills */}
      {difficulties.map((d) => (
        <PillButton
          key={d}
          active={activeDifficulty === d}
          onClick={() => setFilter("difficulty", activeDifficulty === d ? "" : d)}
        >
          {difficultyLabels[d]}
        </PillButton>
      ))}

      {/* Separator */}
      <div className="w-px h-7 bg-[rgba(255,255,255,0.06)] self-center mx-2" />

      {/* Sort pills */}
      {sorts.map((s) => (
        <PillButton
          key={s.value}
          active={activeSort === s.value}
          onClick={() => setFilter("sort", s.value)}
        >
          {s.label}
        </PillButton>
      ))}
    </div>
  );
}
