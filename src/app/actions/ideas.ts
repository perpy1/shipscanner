"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upvoteIdea(ideaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Check if already upvoted
  const { data: existing } = await supabase
    .from("idea_upvotes")
    .select("id")
    .eq("user_id", user.id)
    .eq("idea_id", ideaId)
    .single();

  if (existing) {
    // Remove upvote
    await supabase.from("idea_upvotes").delete().eq("id", existing.id);
    await supabase.rpc("decrement_upvotes", { idea_id: ideaId });
  } else {
    // Add upvote
    await supabase
      .from("idea_upvotes")
      .insert({ user_id: user.id, idea_id: ideaId });
    await supabase.rpc("increment_upvotes", { idea_id: ideaId });
  }

  revalidatePath("/ideas");
  return { success: true };
}

export async function saveIdea(ideaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase
    .from("saved_ideas")
    .insert({ user_id: user.id, idea_id: ideaId });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function unsaveIdea(ideaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase
    .from("saved_ideas")
    .delete()
    .eq("user_id", user.id)
    .eq("idea_id", ideaId);

  revalidatePath("/dashboard");
  return { success: true };
}
