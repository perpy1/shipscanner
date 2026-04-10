import { getAllIdeas } from "@/lib/queries";
import { Category } from "@/types";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Categories — SideQuest" };

const ALL_CATEGORIES: Category[] = [
  "SaaS", "Developer Tool", "Marketplace", "AI/ML", "Productivity",
  "Social", "Fintech", "Health", "Education", "E-commerce",
];

export default async function CategoriesPage() {
  const allIdeas = await getAllIdeas();
  const categoryData: Record<string, { count: number; ideas: string[] }> = {};
  for (const idea of allIdeas) {
    if (!categoryData[idea.category]) {
      categoryData[idea.category] = { count: 0, ideas: [] };
    }
    categoryData[idea.category].count++;
    if (categoryData[idea.category].ideas.length < 3) {
      categoryData[idea.category].ideas.push(idea.name);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-12 py-12">
      <div className="mb-10">
        <div className="font-label text-[10px] tracking-[0.12em] uppercase text-[var(--copper)] mb-3">
          BROWSE BY CATEGORY
        </div>
        <h1 className="font-display text-4xl font-normal text-[var(--text-display)] tracking-[-0.02em] mb-2">
          Categories
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Find ideas that match your stack and interests.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_CATEGORIES.map((cat) => {
          const data = categoryData[cat] || { count: 0, ideas: [] };

          return (
            <Link
              key={cat}
              href={`/ideas?category=${encodeURIComponent(cat)}`}
              className="glass-card block group"
            >
              <div className="font-display text-[42px] text-[var(--text-display)] leading-none mb-2.5 tracking-[-0.02em]">
                {data.count}
              </div>
              <div className="font-label text-xs tracking-[0.08em] uppercase text-[var(--text-secondary)] mb-4 transition-colors duration-200 group-hover:text-[var(--copper)]">
                {cat}
              </div>
              {data.ideas.length > 0 && (
                <div className="flex flex-col gap-2 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  {data.ideas.map((name) => (
                    <span key={name} className="text-sm text-[var(--text-disabled)]">{name}</span>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
