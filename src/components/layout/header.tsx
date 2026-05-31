"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { playTap } from "@/lib/sounds";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Today" },
    { href: "/categories", label: "Categories" },
    { href: "/ideas", label: "Archive" },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex items-center justify-between px-6 sm:px-8 py-[15px] sticky top-0 z-50 border-b border-[var(--line)] backdrop-blur-[12px]" style={{ background: "color-mix(in srgb, var(--bg) 82%, transparent)" }}>
      <Link
        href="/"
        onClick={playTap}
        className="font-head text-[21px] text-[var(--text)] hover:opacity-80 transition-opacity"
      >
        SideQuest
      </Link>

      <div className="flex items-center gap-1 text-[12.5px] font-semibold">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={playTap}
            className={`px-3.5 py-2 rounded-full transition-all duration-200 ${
              isActive(item.href)
                ? "text-[var(--accent)] bg-[var(--accent-soft)]"
                : "text-[var(--dim)] hover:text-[var(--text)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
