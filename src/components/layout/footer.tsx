export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] py-8 px-6 sm:px-12">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-display text-sm text-[var(--text-display)] tracking-[-0.02em] flex items-center gap-2">
          <svg className="text-[var(--copper)] shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 0 0-2 2v3h12v11" />
            <path d="M4 7h12" />
          </svg>
          SIDE <span className="text-[var(--copper)]">QUEST</span>
        </div>
        <p className="font-label text-[10px] tracking-[0.08em] uppercase text-[var(--text-disabled)]">
          Fresh ideas distilled daily
        </p>
      </div>
    </footer>
  );
}
