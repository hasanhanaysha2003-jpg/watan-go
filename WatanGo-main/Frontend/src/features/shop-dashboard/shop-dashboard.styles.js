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

  // ── Market item row
  itemRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    py: 1.5,
    px: 0.5,
    gap: 2,
    flexWrap: "wrap",
  },
  itemAvatar: (theme) => ({
    width: 36,
    height: 36,
    fontSize: 15,
    fontWeight: 700,
    bgcolor: alpha(theme.palette.primary.main, 0.12),
    color: "primary.main",
    flexShrink: 0,
  }),

  // ── Low-stock alert section
  alertSection: {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "warning.main",
    overflow: "hidden",
    mb: 0,
  },
  alertHead: {
    px: 3,
    py: 2,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    borderBottom: "1px solid",
    borderColor: "divider",
    bgcolor: (theme) => alpha(theme.palette.warning.main, 0.06),
  },
  alertGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 2,
    p: 2.5,
  },
  alertItem: (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 2.5,
    border: "1px solid",
    borderColor: alpha(theme.palette.warning.main, 0.3),
    bgcolor: alpha(theme.palette.warning.main, 0.05),
    px: 2,
    py: 1.5,
  }),
};
