import { alpha } from "@mui/material/styles";

export const rideTrackingStyles = {
  // ── Page shell ───────────────────────────────────────────────
  page: (theme) => ({
    position: "relative",
    minHeight: "calc(100vh - 72px)",
    bgcolor: "background.default",
    color: "text.primary",
    fontFamily: "'IBM Plex Sans Arabic', 'Noto Sans Arabic', sans-serif",
    backgroundImage: [
      `radial-gradient(1200px 600px at 10% -10%, ${alpha(theme.palette.info.light, 0.14)}, transparent 60%)`,
      `radial-gradient(900px 520px at 90% 0%, ${alpha(theme.palette.primary.light, 0.1)}, transparent 60%)`,
      `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.98)} 0%, ${alpha(theme.palette.background.default, 0.94)} 100%)`,
    ].join(", "),
    overflowX: "hidden",
  }),

  // ── Header strip ─────────────────────────────────────────────
  header: {
    position: "relative",
    zIndex: 1,
    pt: { xs: 6, md: 8 },
    pb: { xs: 3, md: 4 },
    px: { xs: 3, md: 6 },
    maxWidth: 1200,
    mx: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
    animation: "trackHeroIn 0.6s ease both",
    "@keyframes trackHeroIn": {
      from: { opacity: 0, transform: "translateY(14px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  },

  eyebrow: (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 0.75,
    px: 1.75,
    py: 0.65,
    borderRadius: 999,
    border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
    bgcolor: alpha(theme.palette.info.main, 0.09),
    color: "info.main",
    fontSize: 12,
    fontWeight: 700,
    width: "fit-content",
    alignSelf: "flex-end",
    boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.12)}`,
  }),

  title: {
    fontSize: { xs: 24, md: 34 },
    fontWeight: 900,
    lineHeight: 1.25,
    textAlign: "right",
  },

  // ── Layout ────────────────────────────────────────────────────
  content: {
    position: "relative",
    zIndex: 1,
    px: { xs: 2, md: 6 },
    pb: { xs: 6, md: 10 },
    pt: 0,
    maxWidth: 1200,
    mx: "auto",
    display: "grid",
    gap: { xs: 3, md: 4 },
    gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
    alignItems: "start",
  },

  // ── Map container ─────────────────────────────────────────────
  mapCard: (theme) => ({
    borderRadius: 5,
    overflow: "hidden",
    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
    boxShadow: `0 20px 48px ${alpha(theme.palette.common.black, 0.12)}`,
    animation: "trackCardIn 0.7s ease both",
    "@keyframes trackCardIn": {
      from: { opacity: 0, transform: "translateY(18px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  }),

  mapWrapper: {
    height: { xs: 340, sm: 420, md: 520 },
    "& .leaflet-container": {
      height: "100%",
      width: "100%",
      fontFamily: "inherit",
    },
  },

  // ── Status bar below map ──────────────────────────────────────
  statusBar: (theme) => ({
    px: 2.5,
    py: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
    bgcolor: alpha(theme.palette.background.paper, 0.92),
    flexWrap: "wrap",
  }),

  connectionDot: (status) => (theme) => {
    const color =
      status === "connected"
        ? theme.palette.success.main
        : status === "connecting"
          ? theme.palette.warning.main
          : status === "error"
            ? theme.palette.error.main
            : theme.palette.text.disabled;
    return {
      width: 8,
      height: 8,
      borderRadius: "50%",
      bgcolor: color,
      flexShrink: 0,
      boxShadow:
        status === "connected"
          ? `0 0 6px ${alpha(theme.palette.success.main, 0.7)}`
          : "none",
      animation:
        status === "connected" ? "trackPulse 2s ease infinite" : "none",
      "@keyframes trackPulse": {
        "0%, 100%": { opacity: 1 },
        "50%": { opacity: 0.4 },
      },
    };
  },

  connectionLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "text.secondary",
  },

  lastUpdateLabel: {
    fontSize: 11.5,
    color: "text.disabled",
    ml: "auto",
  },

  // ── Side panel ────────────────────────────────────────────────
  sidePanel: {
    display: "flex",
    flexDirection: "column",
    gap: 2.5,
    animation: "trackSideIn 0.7s ease both",
    "@keyframes trackSideIn": {
      from: { opacity: 0, transform: "translateY(16px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  },

  infoCard: (theme) => ({
    borderRadius: 5,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    bgcolor: alpha(theme.palette.background.paper, 0.92),
    boxShadow: `0 16px 36px ${alpha(theme.palette.common.black, 0.08)}`,
    p: 3,
  }),

  infoCardTitle: {
    fontSize: 15,
    fontWeight: 800,
    mb: 2.5,
    textAlign: "right",
  },

  infoRow: (theme) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    py: 1.5,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
    "&:last-child": { borderBottom: "none", pb: 0 },
    flexDirection: "row-reverse",
  }),

  infoLabel: {
    fontSize: 12,
    color: "text.secondary",
    fontWeight: 600,
    flexShrink: 0,
    minWidth: 80,
    textAlign: "right",
  },

  infoValue: {
    fontSize: 13.5,
    fontWeight: 700,
    textAlign: "right",
    flex: 1,
    wordBreak: "break-word",
  },

  statusChip: (status) => (theme) => {
    const map = {
      pending: [theme.palette.warning.main, 0.12],
      assigned: [theme.palette.info.main, 0.12],
      completed: [theme.palette.success.main, 0.12],
      cancelled: [theme.palette.error.main, 0.12],
    };
    const [color, opacity] = map[status] ?? map.pending;
    return {
      px: 1.5,
      py: 0.5,
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      bgcolor: alpha(color, opacity),
      color,
      display: "inline-block",
    };
  },

  // ── Geo error alert ───────────────────────────────────────────
  geoAlert: (theme) => ({
    borderRadius: 4,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.35)}`,
    bgcolor: alpha(theme.palette.warning.main, 0.07),
    p: 2,
    display: "flex",
    alignItems: "flex-start",
    gap: 1.25,
    fontSize: 13,
    color: "warning.dark",
  }),

  // ── Back button ───────────────────────────────────────────────
  backLink: (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    px: 3,
    py: 1.4,
    borderRadius: 999,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    bgcolor: alpha(theme.palette.background.paper, 0.82),
    color: "text.primary",
    fontSize: 14,
    fontWeight: 700,
    textDecoration: "none",
    transition: "all 0.15s",
    boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.06)}`,
    "&:hover": {
      bgcolor: alpha(theme.palette.primary.main, 0.07),
      transform: "translateY(-1px)",
    },
  }),

  // ── Loading / error states ────────────────────────────────────
  centeredBox: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 2,
    textAlign: "center",
    px: 4,
  },

  errorCard: (theme) => ({
    borderRadius: 5,
    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
    bgcolor: alpha(theme.palette.error.main, 0.06),
    p: 4,
    textAlign: "center",
    maxWidth: 440,
    mx: "auto",
  }),
};
