import Link from "next/link";
import { Scroll } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 border-2 border-amber-500/20 mb-6">
        <Scroll className="size-8 text-amber-400" />
      </div>
      <h1 className="font-pixel text-lg text-amber-400 mb-2">404</h1>
      <p className="mb-2 text-lg font-bold">Quest Not Found</p>
      <p className="mb-8 text-muted-foreground text-center">
        This page doesn&apos;t exist. Maybe it&apos;s your next app idea?
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-amber-500 text-black font-bold px-5 py-2 text-sm hover:bg-amber-400 transition-colors"
      >
        Back to Base
      </Link>
    </div>
  );
}
