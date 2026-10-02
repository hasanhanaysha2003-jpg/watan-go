import { alpha } from "@mui/material/styles";

export const restaurantStyles = {
  // ── Page shell ──────────────────────────────────────────────
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

  // ── Hero ────────────────────────────────────────────────────
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

  // ── Search ──────────────────────────────────────────────────
  searchWrap: {
    position: "relative",
    zIndex: 1,
    px: { xs: 3, md: 6 },
    pb: 2,
    maxWidth: 640,
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
    "& .MuiInputBase-input": {
      fontSize: 15,
      py: 1.5,
    },
  }),

  // ── Grid section ────────────────────────────────────────────
  gridSection: {
    position: "relative",
    zIndex: 1,
    px: { xs: 3, md: 6 },
    pb: { xs: 6, md: 10 },
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

  // ── Restaurant card ─────────────────────────────────────────
  card: (theme) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: "background.paper",
    boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
    transition: theme.transitions.create(["transform", "box-shadow"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.12)}`,
    },
  }),

  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 2,
    p: 3,
    pb: 0,
  },

  cardAvatar: (theme) => ({
    width: 52,
    height: 52,
    borderRadius: 3,
    fontSize: 18,
    fontWeight: 700,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: "common.white",
    flexShrink: 0,
  }),

  cardName: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.3,
  },

  cardDescription: {
    mt: 0.5,
    fontSize: 13,
    color: "text.secondary",
    lineHeight: 1.6,
  },

  cardMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
    px: 3,
    pt: 2,
  },

  metaChip: (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    px: 1.5,
    py: 0.5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    bgcolor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.08)
        : alpha(theme.palette.common.black, 0.05),
    color: "text.secondary",
    border: `1px solid ${theme.palette.divider}`,
  }),

  featuredBox: (theme) => ({
    mx: 3,
    mt: 2,
    p: 2,
    borderRadius: 3,
    bgcolor: alpha(theme.palette.primary.main, 0.04),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  }),

  featuredLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "text.disabled",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    mb: 1,
  },

  featuredItemChip: (theme) => ({
    display: "inline-block",
    px: 1.5,
    py: 0.5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    bgcolor: "background.paper",
    border: `1px solid ${theme.palette.divider}`,
    color: "text.primary",
  }),

  cardActions: {
    p: 3,
    pt: 2,
    mt: "auto",
  },

  browseButton: (theme) => ({
    width: "100%",
    height: 44,
    borderRadius: 3,
    background: `linear-gradient(to left, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    color: "common.white",
    fontSize: 14,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
    transition: theme.transitions.create(["box-shadow", "transform"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      background: `linear-gradient(to left, ${theme.palette.primary.dark}, ${theme.palette.primary.dark})`,
      boxShadow: `0 10px 28px ${alpha(theme.palette.primary.main, 0.4)}`,
      transform: "translateY(-1px)",
    },
    "&:active": { transform: "scale(0.99)" },
  }),

  // ── Empty / loading states ───────────────────────────────────
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

  // ── Menu page ────────────────────────────────────────────────
  menuPage: (theme) => ({
    position: "relative",
    minHeight: "calc(100vh - 72px)",
    bgcolor: "background.default",
    fontFamily: theme.typography.fontFamily,
  }),

  menuLayout: {
    px: { xs: 2, md: 4, lg: 6 },
    pb: { xs: 6, md: 10 },
    maxWidth: 1280,
    mx: "auto",
    width: "100%",
  },

  sidebar: (theme) => ({
    borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: "background.paper",
    overflow: "hidden",
    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.06)}`,
    position: { md: "sticky" },
    top: { md: 24 },
  }),

  sidebarHero: (theme) => ({
    height: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.dark, 0.08)})`,
    fontSize: 56,
  }),

  sidebarContent: { p: 3 },

  sidebarRow: (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 2,
    py: 1.5,
    borderRadius: 2,
    bgcolor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.06)
        : alpha(theme.palette.common.black, 0.04),
  }),

  sidebarRowLabel: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    fontSize: 13,
    color: "text.secondary",
  },

  sidebarRowValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "text.primary",
  },

  menuSectionCard: (theme) => ({
    borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: "background.paper",
    boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
    p: 3,
    mb: 3,
  }),

  sectionLabel: (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 0.75,
    px: 1.5,
    py: 0.5,
    borderRadius: 999,
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: "primary.main",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    mb: 0.5,
  }),

  sectionTitle: { fontSize: 20, fontWeight: 800, mb: 2.5 },

  // ── Menu item card ──────────────────────────────────────────
  menuItemCard: (theme) => ({
    borderRadius: 3,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: alpha(theme.palette.action.hover, 0.4),
    p: 2.5,
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
    transition: theme.transitions.create(["box-shadow", "border-color"], {
      duration: theme.transitions.duration.shorter,
    }),
    "&:hover": {
      boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.08)}`,
      borderColor: theme.palette.primary.light,
    },
  }),

  menuItemAvatar: (theme) => ({
    width: 48,
    height: 48,
    borderRadius: 2.5,
    bgcolor: alpha(theme.palette.primary.main, 0.08),
    color: "primary.main",
    fontSize: 22,
    flexShrink: 0,
  }),

  menuItemName: { fontSize: 15, fontWeight: 700, lineHeight: 1.3 },

  menuItemDesc: {
    fontSize: 12,
    color: "text.secondary",
    lineHeight: 1.6,
    mt: 0.25,
  },

  priceChip: (theme) => ({
    px: 2,
    py: 0.5,
    borderRadius: 999,
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: "primary.main",
    fontSize: 13,
    fontWeight: 800,
    flexShrink: 0,
  }),

  addButton: (theme) => ({
    mt: "auto",
    height: 38,
    borderRadius: 2.5,
    background: `linear-gradient(to left, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    color: "common.white",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
    "&:hover": {
      boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.35)}`,
    },
  }),
};
