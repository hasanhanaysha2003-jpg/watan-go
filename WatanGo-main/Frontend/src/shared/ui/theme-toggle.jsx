import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { getInitialThemeMode, setThemeMode } from "@/shared/theme/app-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialThemeMode();
    setTheme(initial);
    setThemeMode(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeMode(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      aria-pressed={isDark}
      title={isDark ? "وضع فاتح" : "وضع داكن"}
      className="relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border border-border bg-secondary/60 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className="absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-primary-foreground shadow-md transition-all duration-300 ease-out"
        style={{
          right: mounted && !isDark ? "calc(100% - 2rem)" : "0.25rem",
        }}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
      <Sun
        className={`absolute right-2 h-4 w-4 transition-opacity ${isDark ? "opacity-40" : "opacity-0"}`}
      />
      <Moon
        className={`absolute left-2 h-4 w-4 transition-opacity ${isDark ? "opacity-0" : "opacity-40"}`}
      />
    </button>
  );
}
