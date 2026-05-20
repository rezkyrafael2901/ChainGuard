"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("chainguard-theme");
    const shouldDark = saved ? saved === "dark" : true;
    setDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("chainguard-theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="rounded-full border border-slate-300/60 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
      aria-label="Toggle dark mode"
    >
      {dark ? "☾ Dark" : "☀ Light"}
    </button>
  );
}
