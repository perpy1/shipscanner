import { Idea, DailyScan, Category, Difficulty } from "@/types";
import { seedIdeas, seedScans } from "./seed-data";

// Dynamic import to avoid errors when Supabase isn't configured
async function getSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const { createClient } = await import("./supabase/server");
  try {
    return await createClient();
  } catch {
    return null;
  }
}

export async function getTodayIdeas(): Promise<Idea[]> {
  const today = new Date().toISOString().split("T")[0];
  const supabase = await getSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("ideas")
      .select("*")
      .eq("scan_date", today)
      .order("viral_potential", { ascending: false });
    if (data && data.length > 0) return data as Idea[];
  }

  return seedIdeas.filter((idea) => idea.scan_date === today);
}

export async function getIdeasByDate(date: string): Promise<Idea[]> {
  const supabase = await getSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("ideas")
      .select("*")
      .eq("scan_date", date)
      .order("viral_potential", { ascending: false });
    if (data && data.length > 0) return data as Idea[];
  }

  return seedIdeas.filter((idea) => idea.scan_date === date);
}

export async function getAllIdeas(filters?: {
  category?: Category;
  difficulty?: Difficulty;
  sort?: "newest" | "viral" | "upvotes";
}): Promise<Idea[]> {
  const supabase = await getSupabase();

  if (supabase) {
    let query = supabase.from("ideas").select("*");

    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.difficulty) query = query.eq("difficulty", filters.difficulty);

    switch (filters?.sort) {
      case "viral":
        query = query.order("viral_potential", { ascending: false });
        break;
      case "upvotes":
        query = query.order("upvotes", { ascending: false });
        break;
      default:
        query = query.order("scan_date", { ascending: false });
    }

    const { data } = await query;
    if (data && data.length > 0) return data as Idea[];
  }

  // Seed data fallback
  let ideas = [...seedIdeas];
  if (filters?.category) ideas = ideas.filter((i) => i.category === filters.category);
  if (filters?.difficulty) ideas = ideas.filter((i) => i.difficulty === filters.difficulty);

  switch (filters?.sort) {
    case "viral":
      ideas.sort((a, b) => b.viral_potential - a.viral_potential);
      break;
    case "upvotes":
      ideas.sort((a, b) => b.upvotes - a.upvotes);
      break;
    default:
      ideas.sort((a, b) => b.scan_date.localeCompare(a.scan_date));
  }

  return ideas;
}

export async function getScanByDate(date: string): Promise<DailyScan | undefined> {
  const supabase = await getSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("daily_scans")
      .select("*")
      .eq("scan_date", date)
      .single();
    if (data) return data as DailyScan;
  }

  return seedScans.find((scan) => scan.scan_date === date);
}

export async function getAvailableDates(): Promise<string[]> {
  const supabase = await getSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("ideas")
      .select("scan_date")
      .order("scan_date", { ascending: false });
    if (data && data.length > 0) {
      const dates = [...new Set(data.map((d: { scan_date: string }) => d.scan_date))];
      return dates;
    }
  }

  const dates = [...new Set(seedIdeas.map((i) => i.scan_date))];
  return dates.sort((a, b) => b.localeCompare(a));
}

export async function getIdeaById(id: string): Promise<Idea | undefined> {
  const supabase = await getSupabase();

  if (supabase) {
    const { data } = await supabase.from("ideas").select("*").eq("id", id).single();
    if (data) return data as Idea;
  }

  return seedIdeas.find((idea) => idea.id === id);
}
