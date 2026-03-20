"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogIn } from "lucide-react";

export function SignInButton() {
  async function handleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignIn}>
      <LogIn className="size-4" />
      Sign In
    </Button>
  );
}
