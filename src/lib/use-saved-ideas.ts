"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "sq:saved";
const EVENT = "sq:saved-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * localStorage-backed saved ideas (no account required).
 * Syncs across components in the same tab via a custom event,
 * and across tabs via the native `storage` event.
 */
export function useSavedIdeas() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(read());
    const sync = () => setSaved(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — no-op */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  return { saved, count: saved.length, toggle, isSaved };
}
