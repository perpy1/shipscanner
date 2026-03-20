"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6">
        <AlertCircle className="size-8 text-rose-400" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
      <p className="mb-8 text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <Button
        className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400 border-0"
        onClick={reset}
      >
        Try Again
      </Button>
    </div>
  );
}
