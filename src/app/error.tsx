"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="font-display text-[64px] text-[var(--danger)] leading-none mb-4">
        ERR
      </div>
      <p className="text-lg font-medium text-[var(--text-display)] mb-2">Something went wrong</p>
      <p className="mb-8 text-[var(--text-secondary)]">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="font-label text-[11px] tracking-[0.06em] uppercase px-7 py-3.5 rounded-full bg-[var(--copper)] text-[var(--bg)] transition-all duration-200 hover:opacity-85 cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
