"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem] text-text-main" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun
        className="h-[1.2rem] w-[1.2rem] text-text-main transition-all"
        style={{
          transform: isDark ? "rotate(90deg) scale(0)" : "rotate(0deg) scale(1)",
          opacity: isDark ? 0 : 1,
          position: isDark ? "absolute" : "relative",
        }}
      />
      <Moon
        className="h-[1.2rem] w-[1.2rem] text-text-main transition-all"
        style={{
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
          opacity: isDark ? 1 : 0,
          position: isDark ? "relative" : "absolute",
        }}
      />
    </button>
  );
}
