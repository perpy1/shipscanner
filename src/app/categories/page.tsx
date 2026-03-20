import { getAllIdeas } from "@/lib/queries";
import { Category } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Cloud,
  Code,
  ShoppingCart,
  Brain,
  Zap,
  Users,
  DollarSign,
  Heart,
  GraduationCap,
  Store,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories — SideQuest",
};

const categoryIcons: Record<Category, typeof Cloud> = {
  SaaS: Cloud,
  "Developer Tool": Code,
  Marketplace: ShoppingCart,
  "AI/ML": Brain,
  Productivity: Zap,
  Social: Users,
  Fintech: DollarSign,
  Health: Heart,
  Education: GraduationCap,
  "E-commerce": Store,
};

const categoryColors: Record<Category, string> = {
  SaaS: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "Developer Tool": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  Marketplace: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  "AI/ML": "text-violet-400 bg-violet-500/10 border-violet-500/20",
  Productivity: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Social: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Fintech: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Health: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Education: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  "E-commerce": "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

const ALL_CATEGORIES: Category[] = [
  "SaaS", "Developer Tool", "Marketplace", "AI/ML", "Productivity",
  "Social", "Fintech", "Health", "Education", "E-commerce",
];

export default async function CategoriesPage() {
  const allIdeas = await getAllIdeas();

  const counts: Record<string, number> = {};
  for (const idea of allIdeas) {
    counts[idea.category] = (counts[idea.category] ?? 0) + 1;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <p className="font-pixel text-[10px] text-cyan-400 mb-2">SELECT YOUR CLASS</p>
        <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick your class. Find quests that match your skills.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_CATEGORIES.map((cat) => {
          const Icon = categoryIcons[cat];
          const color = categoryColors[cat];
          const count = counts[cat] ?? 0;

          return (
            <Link
              key={cat}
              href={`/ideas?category=${encodeURIComponent(cat)}`}
              className="pixel-border rounded-lg bg-card p-5 transition-all duration-200 hover:translate-y-[-2px] block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex size-10 items-center justify-center rounded-lg border ${color}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{cat}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{count} quest{count !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Browse →
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
