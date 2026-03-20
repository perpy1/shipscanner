import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scroll } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Scroll className="size-5 text-amber-400" />
          <span className="font-pixel text-sm" style={{ letterSpacing: "-1px" }}>
            <span className="text-amber-400">Side</span>
            <span className="text-cyan-400">Quest</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-amber-400 text-xs" render={<Link href="/ideas" />}>
            Quest Board
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-amber-400 text-xs" render={<Link href="/categories" />}>
            Classes
          </Button>
          <Button size="sm" className="bg-amber-500 text-black font-bold hover:bg-amber-400 border-0 text-xs" render={<Link href="/ideas" />}>
            Start Quest
          </Button>
        </nav>
      </div>
    </header>
  );
}
