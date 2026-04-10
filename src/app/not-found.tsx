import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="font-display text-[96px] text-[var(--copper)] leading-none mb-4">
        404
      </div>
      <p className="text-lg font-medium text-[var(--text-display)] mb-2">Page not found</p>
      <p className="mb-8 text-[var(--text-secondary)] text-center max-w-md">
        This page doesn&apos;t exist. Maybe it&apos;s your next app idea?
      </p>
      <Link
        href="/"
        className="font-label text-[11px] tracking-[0.06em] uppercase px-7 py-3.5 rounded-full bg-[var(--copper)] text-[var(--bg)] transition-all duration-200 hover:opacity-85"
      >
        Back to SideQuest
      </Link>
    </div>
  );
}
