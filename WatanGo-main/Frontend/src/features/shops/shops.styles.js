import { alpha } from "@mui/material/styles";

export const shopStyles = {
  // ── Page shell ───────────────────────────────────────────────
  page: (theme) => ({
    position: "relative",
    minHeight: "calc(100vh - 72px)",
    bgcolor: "background.default",
    color: "text.primary",
    fontFamily: theme.typography.fontFamily,
    backgroundImage: [
      `radial-gradient(ellipse 80% 50% at 50% 0%, ${alpha(theme.palette.primary.main, 0.08)}, transparent 60%)`,
      `radial-gradient(ellipse 60% 50% at 100% 100%, ${alpha(theme.palette.primary.main, 0.04)}, transparent 60%)`,
    ].join(", "),
  }),

  gridOverlay: (theme) => ({
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    opacity: 0.03,
    backgroundImage: [
      `linear-gradient(${theme.palette.text.primary} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${theme.palette.text.primary} 1px, transparent 1px)`,
    ].join(", "),
    backgroundSize: "56px 56px",
    maskImage:
      "radial-gradient(ellipse 70% 40% at 50% 0%, black, transparent 80%)",
  }),

  // ── Hero ─────────────────────────────────────────────────────
  hero: {
    position: "relative",
    zIndex: 1,
    pt: { xs: 6, md: 10 },
    pb: { xs: 4, md: 6 },
    px: { xs: 3, md: 6 },
    textAlign: "center",
  },

  heroEyebrow: (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    px: 2,
    py: 0.75,
    borderRadius: 999,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
    bgcolor: alpha(theme.palette.primary.main, 0.08),
    color: "primary.main",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.5,
    mb: 3,
  }),

  heroTitle: {
    fontSize: { xs: 28, md: 40 },
    fontWeight: 800,
    lineHeight: 1.2,
    mb: 1.5,
  },

  heroSubtitle: {
    fontSize: { xs: 14, md: 16 },
    color: "text.secondary",
    maxWidth: 480,
    mx: "auto",
  },

  // ── Filters section ──────────────────────────────────────────
  filtersWrap: {
    position: "relative",
    zIndex: 1,
    px: { xs: 3, md: 6 },
    pb: 1,
    maxWidth: 1280,
    mx: "auto",
  },

  searchField: (theme) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 4,
      bgcolor: "background.paper",
      fontFamily: theme.typography.fontFamily,
      boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.06)}`,
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": { borderColor: theme.palette.primary.light },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
    "& .MuiInputBase-input": { fontSize: 15, py: 1.5 },
  }),

  categoryChipBase: (theme) => ({
    px: 2,
    py: 0.75,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: `1px solid ${theme.palette.divider}`,
    bgcolor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.06)
        : alpha(theme.palette.common.black, 0.04),
    color: "text.secondary",
    transition: "all 0.15s",
    userSelect: "none",
    "&:hover": {
      borderColor: "primary.light",
      color: "primary.main",
    },
  }),

  categoryChipActive: (theme) => ({
    px: 2,
    py: 0.75,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: "primary.main",
    userSelect: "none",
  }),

  inStockToggle: (active, theme) =>
    active
      ? {
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          px: 2,
          py: 0.75,
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          border: `1px solid ${alpha(theme.palette.success.main, 0.4)}`,
          bgcolor: alpha(theme.palette.success.main, 0.1),
          color: "success.main",
          userSelect: "none",
        }
      : {
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          px: 2,
          py: 0.75,
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.06)
              : alpha(theme.palette.common.black, 0.04),
          color: "text.secondary",
          userSelect: "none",
          "&:hover": { borderColor: "success.light", color: "success.main" },
        },

  // ── Grid section ─────────────────────────────────────────────
  gridSection: {
    position: "relative",
    zIndex: 1,
    px: { xs: 3, md: 6 },
    pb: { xs: 6, md: 10 },
    pt: 2,
    maxWidth: 1280,
    mx: "auto",
    width: "100%",
  },

  resultsCount: {
    mb: 3,
    fontSize: 14,
    color: "text.secondary",
    fontWeight: 500,
  },

  // ── Market item card ─────────────────────────────────────────
  itemCard: (theme) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: "background.paper",
    boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
    p: 3,
    transition: theme.transitions.create(["transform", "box-shadow"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.12)}`,
    },
  }),

  itemCardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 2,
    mb: 1.5,
  },

  itemAvatar: (theme) => ({
    width: 52,
    height: 52,
    borderRadius: 3,
    fontSize: 18,
    fontWeight: 700,
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: "primary.main",
    flexShrink: 0,
  }),

  categoryBadge: (theme) => ({
    display: "inline-block",
    px: 1.5,
    py: 0.4,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: "primary.main",
    mb: 0.75,
  }),

  outOfStockBadge: (theme) => ({
    display: "inline-block",
    px: 1.5,
    py: 0.4,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    bgcolor: alpha(theme.palette.error.main, 0.1),
    color: "error.main",
    ml: 0.75,
  }),

  itemName: { fontSize: 17, fontWeight: 700, lineHeight: 1.3, mb: 0.5 },

  itemDesc: { fontSize: 13, color: "text.secondary", lineHeight: 1.6 },

  itemDivider: (theme) => ({
    width: "100%",
    height: "1px",
    bgcolor: "divider",
    my: 2,
  }),

  itemFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    mb: 1,
  },

  ratingChip: (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    px: 1.25,
    py: 0.4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    bgcolor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.08)
        : alpha(theme.palette.common.black, 0.05),
    color: "text.secondary",
    border: `1px solid ${theme.palette.divider}`,
  }),

  priceText: {
    fontSize: 22,
    fontWeight: 800,
    color: "primary.main",
  },

  addButton: (theme) => ({
    width: "100%",
    mt: 2,
    height: 42,
    borderRadius: 3,
    background: `linear-gradient(to left, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    color: "common.white",
    fontSize: 14,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
    "&:hover": {
      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
      transform: "translateY(-1px)",
    },
    "&.Mui-disabled": {
      background: "action.disabledBackground",
      boxShadow: "none",
    },
    transition: "all 0.2s",
  }),

  // ── Empty / loading states ────────────────────────────────────
  emptyBox: (theme) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    borderRadius: 4,
    border: `1px dashed ${theme.palette.divider}`,
    bgcolor: alpha(theme.palette.action.hover, 0.5),
    textAlign: "center",
    p: 6,
    gap: 1.5,
  }),

  emptyIcon: (theme) => ({
    width: 64,
    height: 64,
    borderRadius: 4,
    bgcolor: alpha(theme.palette.primary.main, 0.08),
    color: "primary.main",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 1,
  }),
};
