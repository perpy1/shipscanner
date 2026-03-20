"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category, Difficulty } from "@/types";
import { ChevronDown } from "lucide-react";

const categories: Category[] = [
  "SaaS",
  "Developer Tool",
  "Marketplace",
  "AI/ML",
  "Productivity",
  "Fintech",
  "Social",
  "Health",
  "Education",
  "E-commerce",
];

const difficulties: Difficulty[] = ["Weekend", "Week", "Month"];

const sorts = [
  { value: "newest", label: "Newest" },
  { value: "viral", label: "Most Viral" },
  { value: "upvotes", label: "Most Upvoted" },
];

export function IdeaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const activeDifficulty = searchParams.get("difficulty") || "";
  const activeSort = searchParams.get("sort") || "newest";

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/ideas?${params.toString()}`);
  }

  const selectClass =
    "appearance-none bg-secondary border-2 border-border rounded-lg px-3 py-2 pr-8 text-sm font-mono text-foreground cursor-pointer hover:border-amber-500/40 focus:border-amber-500 focus:outline-none transition-colors";

  return (
    <div className="flex flex-wrap gap-3">
      {/* Category */}
      <div className="relative">
        <select
          value={activeCategory}
          onChange={(e) => setFilter("category", e.target.value)}
          className={selectClass}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
      </div>

      {/* Difficulty */}
      <div className="relative">
        <select
          value={activeDifficulty}
          onChange={(e) => setFilter("difficulty", e.target.value)}
          className={selectClass}
        >
          <option value="">All Difficulties</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>
              {d === "Weekend" ? "Weekend Quest" : d === "Week" ? "Week-long Raid" : "Epic Campaign"}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
      </div>

      {/* Sort */}
      <div className="relative">
        <select
          value={activeSort}
          onChange={(e) => setFilter("sort", e.target.value)}
          className={selectClass}
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
      </div>
    </div>
  );
}
