import { alpha } from "@mui/material/styles";

export const dashboardStyles = {
  page: (theme) => ({
    position: "relative",
    minHeight: "calc(100vh - 72px)",
    bgcolor: "background.default",
    color: "text.primary",
    fontFamily: "'IBM Plex Sans Arabic', 'Noto Sans Arabic', sans-serif",
    backgroundImage: [
      `radial-gradient(1200px 600px at 10% -10%, ${alpha(theme.palette.primary.light, 0.16)}, transparent 60%)`,
      `radial-gradient(900px 520px at 90% 0%, ${alpha(theme.palette.info.light, 0.12)}, transparent 60%)`,
      `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.98)} 0%, ${alpha(theme.palette.background.default, 0.94)} 45%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
    ].join(", "),
    overflowX: "hidden",
  }),

  hero: {
    position: "relative",
    zIndex: 1,
    pt: { xs: 7, md: 9 },
    pb: { xs: 4, md: 5 },
    px: { xs: 3, md: 6 },
    textAlign: "right",
    maxWidth: 1200,
    mx: "auto",
    animation: "dashHeroIn 0.6s ease both",
    "@keyframes dashHeroIn": {
      from: { opacity: 0, transform: "translateY(14px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  },

  heroEyebrow: (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 0.75,
    px: 1.75,
    py: 0.65,
    borderRadius: 999,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
    bgcolor: alpha(theme.palette.primary.main, 0.08),
    color: "primary.main",
    fontSize: 12,
    fontWeight: 700,
    mb: 2,
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
  }),

  heroTitle: {
    fontSize: { xs: 28, md: 40 },
    fontWeight: 900,
    lineHeight: 1.25,
    mb: 0.75,
  },

  heroSubtitle: {
    fontSize: { xs: 14, md: 15.5 },
    color: "text.secondary",
  },

  content: {
    position: "relative",
    zIndex: 1,
    px: { xs: 3, md: 6 },
    pb: { xs: 7, md: 12 },
    pt: 1,
    maxWidth: 1200,
    mx: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  // ── Stats ─────────────────────────────────────────────────────
  statsGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
    gap: 2.5,
  },

  statCard: (color) => (theme) => ({
    borderRadius: 4,
    border: `1px solid ${alpha(theme.palette[color].main, 0.18)}`,
    bgcolor: alpha(theme.palette[color].main, 0.06),
    p: 2.5,
    boxShadow: `0 8px 24px ${alpha(theme.palette[color].main, 0.1)}`,
    animation: "dashCardIn 0.6s ease both",
    "@keyframes dashCardIn": {
      from: { opacity: 0, transform: "translateY(14px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  }),

  statIcon: (color) => (theme) => ({
    width: 44,
    height: 44,
    borderRadius: 3,
    bgcolor: alpha(theme.palette[color].main, 0.14),
    color: `${color}.main`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2,
  }),

  statValue: {
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1,
    mb: 0.5,
  },

  statLabel: {
    fontSize: 13,
    color: "text.secondary",
  },

  // ── Service shortcuts ─────────────────────────────────────────
  shortcutsGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
    gap: 2,
  },

  shortcutCard: (color) => (theme) => ({
    borderRadius: 4,
    border: `1px solid ${alpha(theme.palette[color].main, 0.14)}`,
    bgcolor: alpha(theme.palette.background.paper, 0.85),
    p: 2.5,
    display: "flex",
    alignItems: "center",
    gap: 2,
    cursor: "pointer",
    textDecoration: "none",
    color: "inherit",
    transition: "all 0.18s",
    boxShadow: `0 6px 18px ${alpha(theme.palette.common.black, 0.06)}`,
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 12px 28px ${alpha(theme.palette[color].main, 0.18)}`,
      border: `1px solid ${alpha(theme.palette[color].main, 0.3)}`,
      bgcolor: alpha(theme.palette[color].main, 0.05),
    },
  }),

  shortcutIcon: (color) => (theme) => ({
    width: 48,
    height: 48,
    borderRadius: 3,
    bgcolor: alpha(theme.palette[color].main, 0.12),
    color: `${color}.main`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),

  // ── Activity section ──────────────────────────────────────────
  activitySection: (theme) => ({
    borderRadius: 5,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    bgcolor: alpha(theme.palette.background.paper, 0.9),
    boxShadow: `0 16px 40px ${alpha(theme.palette.common.black, 0.08)}`,
    overflow: "hidden",
  }),

  activityHeader: {
    px: 3,
    pt: 3,
    pb: 2.5,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 2,
  },

  filterTabs: {
    display: "flex",
    gap: 1,
    flexWrap: "wrap",
  },

  filterTab: (active) => (theme) => ({
    px: 2.5,
    py: 0.85,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border: active
      ? `1px solid ${alpha(theme.palette.primary.main, 0.5)}`
      : `1px solid ${theme.palette.divider}`,
    bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : "transparent",
    color: active ? "primary.main" : "text.secondary",
    transition: "all 0.15s",
    userSelect: "none",
    background: "none",
    fontFamily: "inherit",
    "&:hover": {
      bgcolor: active
        ? alpha(theme.palette.primary.main, 0.15)
        : "action.hover",
    },
  }),

  statusSelect: (theme) => ({
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 2,
    minWidth: 170,
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(theme.palette.divider, 1),
    },
  }),

  activityList: {
    px: 3,
    pb: 1,
  },

  activityItem: (theme) => ({
    py: 2.5,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    "&:last-child": { borderBottom: "none" },
    display: "flex",
    alignItems: "flex-start",
    gap: 2,
  }),

  itemIcon: (type) => (theme) => ({
    width: 42,
    height: 42,
    borderRadius: 3,
    bgcolor:
      type === "order"
        ? alpha(theme.palette.warning.main, 0.12)
        : alpha(theme.palette.info.main, 0.12),
    color: type === "order" ? "warning.main" : "info.main",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    mt: 0.25,
  }),

  itemTitle: {
    fontSize: 14.5,
    fontWeight: 700,
    mb: 0.4,
  },

  itemMeta: {
    fontSize: 12.5,
    color: "text.secondary",
    display: "flex",
    flexWrap: "wrap",
    gap: 1.5,
    alignItems: "center",
  },

  statusChip: (status) => (theme) => {
    const map = {
      pending: [theme.palette.warning.main, 0.12],
      accepted: [theme.palette.info.main, 0.12],
      assigned: [theme.palette.info.main, 0.12],
      preparing: [theme.palette.secondary.main, 0.15],
      ready_for_pickup: [theme.palette.info.main, 0.12],
      picked_up: [theme.palette.secondary.main, 0.15],
      on_the_way: [theme.palette.secondary.main, 0.15],
      completed: [theme.palette.success.main, 0.12],
      cancelled: [theme.palette.error.main, 0.12],
    };
    const [color, opacity] = map[status] ?? map.pending;
    return {
      px: 1.5,
      py: 0.4,
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      bgcolor: alpha(color, opacity),
      color,
      display: "inline-block",
      whiteSpace: "nowrap",
      flexShrink: 0,
    };
  },

  // ── Table ─────────────────────────────────────────────────────
  tableContainer: {
    overflowX: "auto",
  },

  tableHead: (theme) => ({
    "& .MuiTableCell-head": {
      fontWeight: 700,
      fontSize: 12.5,
      color: "text.secondary",
      bgcolor: alpha(theme.palette.background.default, 0.7),
      borderBottom: `2px solid ${alpha(theme.palette.divider, 0.8)}`,
      whiteSpace: "nowrap",
      py: 1.5,
    },
  }),

  tableRow: (theme) => ({
    "&:hover": {
      bgcolor: alpha(theme.palette.action.hover, 0.5),
    },
    "&:last-child td": { borderBottom: "none" },
  }),

  tableCell: {
    fontSize: 13.5,
    py: 1.75,
    borderColor: "divider",
  },

  emptyState: (theme) => ({
    py: 8,
    textAlign: "center",
    color: "text.secondary",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1.5,
    border: `2px dashed ${alpha(theme.palette.divider, 1)}`,
    borderRadius: 4,
    m: 3,
  }),

  paginationBox: {
    px: 3,
    py: 2.5,
    display: "flex",
    justifyContent: "center",
    borderTop: "1px solid",
    borderColor: "divider",
  },

  loadingBox: {
    py: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  errorBox: (theme) => ({
    m: 3,
    p: 2.5,
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
    bgcolor: alpha(theme.palette.error.main, 0.06),
    color: "error.main",
    fontSize: 14,
    textAlign: "center",
  }),
};
