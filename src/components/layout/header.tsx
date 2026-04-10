"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { playTap } from "@/lib/sounds";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "TODAY" },
    { href: "/categories", label: "CATEGORIES" },
    { href: "/ideas", label: "ARCHIVE" },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex items-center justify-between px-6 sm:px-12 py-5 backdrop-blur-[20px] bg-[rgba(10,10,12,0.6)] border-b border-[rgba(255,255,255,0.06)] sticky top-0 z-50">
      <Link
        href="/"
        onClick={playTap}
        className="font-display text-lg text-[var(--text-display)] tracking-[-0.02em] flex items-center gap-2.5 hover:opacity-80 transition-opacity"
      >
        {/* Scroll parchment icon */}
        <svg className="text-[var(--copper)] shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 0 0-2 2v3h12v11" />
          <path d="M4 7h12" />
        </svg>
        SIDE <span className="text-[var(--copper)]">QUEST</span>
      </Link>

      <div className="flex gap-8 font-label text-[10px] tracking-[0.1em] uppercase">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={playTap}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive(item.href)
                ? "text-[var(--copper)] bg-[rgba(196,149,106,0.1)]"
                : "text-[var(--text-disabled)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
