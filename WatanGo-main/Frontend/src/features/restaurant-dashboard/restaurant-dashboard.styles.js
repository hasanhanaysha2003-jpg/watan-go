import { alpha } from "@mui/material/styles";

export const s = {
  // ── Stat grid
  statGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
    gap: 2,
    mb: 3,
  },
  statCard: (theme) => ({
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: alpha(theme.palette.action.hover, 0.3),
    p: 2.5,
  }),
  statLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "text.secondary",
  },
  statValue: (colorKey) => ({
    mt: 1,
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1,
    color:
      colorKey === "cyan"
        ? "info.main"
        : colorKey === "amber"
          ? "warning.main"
          : "primary.main",
  }),

  // ── Section card
  section: {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    overflow: "hidden",
  },
  sectionHead: {
    px: 3,
    py: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    borderBottom: "1px solid",
    borderColor: "divider",
    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3),
  },
  sectionTitle: { fontWeight: 700, fontSize: 17 },
  sectionSub: { mt: 0.5, fontSize: 13, color: "text.secondary" },
  sectionBody: { p: 2.5 },

  // ── Empty state
  empty: {
    py: 5,
    textAlign: "center",
    border: "1px dashed",
    borderColor: "divider",
    borderRadius: 2.5,
    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.2),
    color: "text.secondary",
  },

  // ── Order sections grid
  orderSectionGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
    gap: 2.5,
  },

  // ── Order card
  orderCard: (theme) => ({
    borderRadius: 2.5,
    border: "1px solid",
    borderColor: "divider",
    overflow: "hidden",
    transition: "box-shadow 0.2s, border-color 0.2s",
    "&:hover": {
      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
      borderColor: alpha(theme.palette.primary.main, 0.3),
    },
  }),
  orderCardHead: {
    px: 2,
    py: 1.25,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "divider",
    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.35),
  },
  orderCardBody: { p: 2 },
  orderInfoBox: {
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3),
    p: 1.5,
  },
  orderCardFoot: {
    px: 2,
    py: 1.5,
    borderTop: "1px solid",
    borderColor: "divider",
    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.2),
    display: "flex",
    gap: 1,
    flexWrap: "wrap",
    alignItems: "center",
  },

  // ── Meal card
  mealCard: (theme) => ({
    borderRadius: 4,
    border: "1px solid",
    borderColor: "divider",
    overflow: "hidden",
    transition: "all 0.25s ease",
    bgcolor: "background.paper",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
      borderColor: alpha(theme.palette.primary.main, 0.35),
    },
  }),
  mealCardHeader: (available) => (theme) => ({
    px: 2.5,
    pt: 2.5,
    pb: 2,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 1.5,
    background: available
      ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`
      : `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.13)}, ${alpha(theme.palette.warning.main, 0.03)})`,
    borderBottom: "1px solid",
    borderColor: "divider",
  }),
  mealPriceBadge: (theme) => ({
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "background.paper",
    border: "1.5px solid",
    borderColor: alpha(theme.palette.primary.main, 0.3),
    borderRadius: 3,
    px: 1.5,
    py: 1,
    minWidth: 56,
    boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
  }),
  mealCardBody: { px: 2.5, py: 1.75 },
  mealCardFooter: {
    px: 2.5,
    pb: 2.5,
    display: "flex",
    gap: 1,
  },
  mealName: { fontWeight: 800, fontSize: 16, letterSpacing: 0.2 },
  mealDesc: {
    mt: 0.4,
    fontSize: 12.5,
    color: "text.secondary",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    opacity: 0.85,
  },

  // ── Meal grid
  mealGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "repeat(3, 1fr)" },
    gap: 2.5,
    mt: 2,
  },

  // ── Stats strip
  statsStrip: {
    display: "flex",
    gap: 1.5,
    flexWrap: "wrap",
    mb: 3,
  },
  statPill: (color) => (theme) => ({
    display: "flex",
    alignItems: "center",
    gap: 1,
    borderRadius: 3,
    border: "1px solid",
    borderColor:
      color === "success"
        ? alpha(theme.palette.success.main, 0.3)
        : color === "warning"
          ? alpha(theme.palette.warning.main, 0.3)
          : color === "primary"
            ? alpha(theme.palette.primary.main, 0.3)
            : "divider",
    bgcolor:
      color === "success"
        ? alpha(theme.palette.success.main, 0.08)
        : color === "warning"
          ? alpha(theme.palette.warning.main, 0.08)
          : color === "primary"
            ? alpha(theme.palette.primary.main, 0.08)
            : alpha(theme.palette.action.hover, 0.4),
    px: 2,
    py: 1,
  }),

  // ── Meal form
  mealForm: {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.2),
    p: 3,
    mb: 3,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
    gap: 2,
    mt: 2,
  },
  fullSpan: { gridColumn: { md: "span 2" } },
};
