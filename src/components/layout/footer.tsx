import { Scroll } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Scroll className="size-4 text-amber-400" />
          <span className="font-pixel text-[10px]">SideQuest</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Built for vibe coders. Ship something cool today.
        </p>
      </div>
    </footer>
  );
}
