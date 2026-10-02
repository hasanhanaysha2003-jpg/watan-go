import { createTheme } from "@mui/material/styles";

export const THEME_STORAGE_KEY = "watan-theme";
export const THEME_CHANGED_EVENT = "watan-theme-changed";

export function getInitialThemeMode() {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "dark";
}

export function applyThemeMode(mode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(mode);
  root.style.colorScheme = mode;
}

export function setThemeMode(mode) {
  applyThemeMode(mode);
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
  window.dispatchEvent(
    new CustomEvent(THEME_CHANGED_EVENT, { detail: { mode } }),
  );
}

const paletteByMode = {
  dark: {
    background: {
      default: "#101827",
      paper: "#162033",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#aab7ca",
      disabled: "#718096",
    },
    divider: "rgba(148, 163, 184, 0.24)",
    action: {
      hover: "rgba(148, 163, 184, 0.35)",
      selected: "rgba(16, 185, 129, 0.16)",
    },
  },
  light: {
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
      disabled: "#94a3b8",
    },
    divider: "rgba(203, 213, 225, 0.9)",
    action: {
      hover: "#cbd5e1",
      selected: "rgba(16, 185, 129, 0.12)",
    },
  },
};

export function createAppTheme(mode) {
  const palette = paletteByMode[mode];

  return createTheme({
    direction: "rtl",
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#f0b84f" : "#b7791f",
        contrastText: mode === "dark" ? "#111827" : "#ffffff",
      },
      success: {
        light: "#34d399",
        main: "#10b981",
        dark: "#059669",
        contrastText: "#ffffff",
      },
      warning: {
        light: "#fbbf24",
        main: "#f59e0b",
        dark: "#d97706",
      },
      error: {
        light: "#f87171",
        main: "#ef4444",
        dark: "#dc2626",
      },
      ...palette,
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: "'Tajawal','Cairo','Noto Sans Arabic',sans-serif",
      button: {
        textTransform: "none",
        fontWeight: 700,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
          },
        },
      },
    },
  });
}
