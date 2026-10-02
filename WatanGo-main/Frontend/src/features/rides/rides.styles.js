import { alpha } from "@mui/material/styles";

export const rideStyles = {
  // ── Page shell ───────────────────────────────────────────────
  page: (theme) => ({
    position: "relative",
    minHeight: "calc(100vh - 72px)",
    bgcolor: "background.default",
    color: "text.primary",
    fontFamily: "'IBM Plex Sans Arabic', 'Noto Sans Arabic', sans-serif",
    backgroundImage: [
      `radial-gradient(1200px 600px at 10% -10%, ${alpha(theme.palette.warning.light, 0.24)}, transparent 60%)`,
      `radial-gradient(900px 520px at 90% 0%, ${alpha(theme.palette.info.light, 0.18)}, transparent 60%)`,
      `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.98)} 0%, ${alpha(theme.palette.background.default, 0.94)} 45%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
    ].join(", "),
    overflowX: "hidden",
  }),

  gridOverlay: (theme) => ({
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    opacity: 0.045,
    backgroundImage: [
      `linear-gradient(${theme.palette.text.primary} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${theme.palette.text.primary} 1px, transparent 1px)`,
    ].join(", "),
    backgroundSize: "64px 64px",
    maskImage:
      "radial-gradient(ellipse 80% 45% at 50% 0%, black, transparent 80%)",
  }),

  // ── Hero ─────────────────────────────────────────────────────
  hero: (theme) => ({
    position: "relative",
    zIndex: 1,
    pt: { xs: 7, md: 10 },
    pb: { xs: 5, md: 7 },
    px: { xs: 3, md: 6 },
    textAlign: "center",
    maxWidth: 760,
    mx: "auto",
    display: "grid",
    gap: 1.5,
    animation: "rideHeroIn 0.7s ease both",
    "@keyframes rideHeroIn": {
      from: { opacity: 0, transform: "translateY(16px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: "-20px 10% auto",
      height: 120,
      background: `radial-gradient(60% 80% at 50% 0%, ${alpha(
        theme.palette.warning.main,
        0.18,
      )}, transparent 70%)`,
      zIndex: -1,
      pointerEvents: "none",
    },
  }),

  heroEyebrow: (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    width: "fit-content",
    justifySelf: "center",
    px: 2,
    py: 0.75,
    borderRadius: 999,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
    bgcolor: alpha(theme.palette.primary.main, 0.08),
    color: "primary.main",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.2,
    mb: 1,
    boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.16)}`,
  }),

  heroTitle: {
    fontSize: { xs: 30, md: 46 },
    fontWeight: 900,
    lineHeight: 1.2,
    mb: 0.5,
  },

  heroSubtitle: {
    fontSize: { xs: 14.5, md: 16 },
    color: "text.secondary",
    maxWidth: 560,
    mx: "auto",
  },

  // ── Content wrapper ──────────────────────────────────────────
  content: {
    position: "relative",
    zIndex: 1,
    px: { xs: 3, md: 6 },
    pb: { xs: 7, md: 12 },
    pt: 3,
    maxWidth: 1200,
    mx: "auto",
  },

  grid: {
    display: "grid",
    gap: { xs: 3, md: 4 },
    gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
    alignItems: "start",
  },

  // ── Card panel ───────────────────────────────────────────────
  card: (theme) => ({
    borderRadius: 5,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
    bgcolor: alpha(theme.palette.background.paper, 0.92),
    backgroundImage: `linear-gradient(180deg, ${alpha(
      theme.palette.background.paper,
      0.98,
    )} 0%, ${alpha(theme.palette.background.paper, 0.88)} 100%)`,
    boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.1)}`,
    p: { xs: 2.5, md: 3.5 },
    backdropFilter: "blur(8px)",
    animation: "rideCardIn 0.7s ease both",
    "@keyframes rideCardIn": {
      from: { opacity: 0, transform: "translateY(18px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  }),

  cardTitle: {
    fontSize: 20,
    fontWeight: 800,
    mb: 3,
  },

  // ── Location fields ──────────────────────────────────────────
  locationBox: (theme) => ({
    borderRadius: 4,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    bgcolor: alpha(theme.palette.background.paper, 0.7),
    p: 2.5,
    mb: 2.5,
    boxShadow: `0 10px 24px ${alpha(theme.palette.common.black, 0.06)}`,
  }),

  locationBoxError: (theme) => ({
    borderRadius: 4,
    border: `1px solid ${alpha(theme.palette.error.main, 0.5)}`,
    bgcolor: alpha(theme.palette.error.main, 0.05),
    p: 2.5,
    mb: 2.5,
    boxShadow: `0 10px 24px ${alpha(theme.palette.common.black, 0.06)}`,
  }),

  locationHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 2,
  },

  locationLabel: {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    fontSize: 13.5,
    fontWeight: 800,
  },

  actionButton: (color) => (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 0.75,
    px: 2,
    py: 0.85,
    borderRadius: 999,
    border: `1px solid ${alpha(theme.palette[color].main, 0.3)}`,
    bgcolor: alpha(theme.palette[color].main, 0.08),
    color: `${color}.main`,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.15s",
    "&:hover": {
      bgcolor: alpha(theme.palette[color].main, 0.18),
      boxShadow: `0 6px 16px ${alpha(theme.palette[color].main, 0.2)}`,
      transform: "translateY(-1px)",
    },
    "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
  }),

  addressRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
  },

  addressText: {
    fontSize: 14.5,
    lineHeight: 1.6,
    flex: 1,
  },

  clearButton: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "text.secondary",
    flexShrink: 0,
    borderRadius: 999,
    "&:hover": { color: "text.primary", bgcolor: "action.hover" },
  },

  placeholderText: {
    fontSize: 13.5,
    color: "text.secondary",
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mt: 1,
    fontSize: 12,
  },

  // ── Trip summary ─────────────────────────────────────────────
  summaryBox: {
    mt: 3.5,
    display: "flex",
    flexDirection: "column",
    gap: 2.5,
  },

  deliveryTypeBadge: (deliveryType) => (theme) => ({
    borderRadius: 4,
    border: `1px solid ${
      deliveryType === "internal"
        ? alpha(theme.palette.info.main, 0.4)
        : deliveryType === "external"
          ? alpha(theme.palette.primary.main, 0.4)
          : theme.palette.divider
    }`,
    bgcolor:
      deliveryType === "internal"
        ? alpha(theme.palette.info.main, 0.08)
        : deliveryType === "external"
          ? alpha(theme.palette.primary.main, 0.08)
          : alpha(theme.palette.action.hover, 0.3),
    p: 2,
    boxShadow: `0 12px 26px ${alpha(theme.palette.common.black, 0.08)}`,
  }),

  deliveryTypePill: (deliveryType) => (theme) => ({
    px: 1.5,
    py: 0.45,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    bgcolor:
      deliveryType === "internal"
        ? alpha(theme.palette.info.main, 0.15)
        : alpha(theme.palette.primary.main, 0.15),
    color: deliveryType === "internal" ? "info.main" : "primary.main",
  }),

  statsGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
    gap: 2,
  },

  statCard: (theme) => ({
    borderRadius: 4,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    bgcolor: alpha(theme.palette.background.paper, 0.7),
    p: 2.25,
    boxShadow: `0 10px 20px ${alpha(theme.palette.common.black, 0.06)}`,
  }),

  statCardHighlight: (theme) => ({
    borderRadius: 4,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
    bgcolor: alpha(theme.palette.primary.main, 0.08),
    p: 2.25,
    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
  }),

  statLabel: {
    fontSize: 12,
    color: "text.secondary",
    mb: 0.5,
  },

  statValue: {
    fontSize: 22,
    fontWeight: 900,
  },

  // ── Right column ─────────────────────────────────────────────
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 2.5,
    alignSelf: "start",
    position: { lg: "sticky" },
    top: { lg: 24 },
    animation: "rideSideIn 0.7s ease both",
    "@keyframes rideSideIn": {
      from: { opacity: 0, transform: "translateY(16px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  },

  confirmButton: (theme) => ({
    width: "100%",
    height: 58,
    borderRadius: 999,
    backgroundImage: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.warning.main})`,
    backgroundSize: "200% 200%",
    color: "common.white",
    fontSize: 15.5,
    fontWeight: 800,
    textTransform: "none",
    letterSpacing: 0.2,
    boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.3)}`,
    "&:hover": {
      boxShadow: `0 18px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
      transform: "translateY(-1px)",
    },
    "&.Mui-disabled": {
      background: "action.disabledBackground",
      color: "common.white",
      boxShadow: "none",
    },
    transition: "all 0.25s",
    animation: "rideButtonGlow 8s ease infinite",
    "@keyframes rideButtonGlow": {
      "0%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0% 50%" },
    },
  }),

  confirmButtonSuccess: {
    width: "100%",
    height: 58,
    borderRadius: 999,
    bgcolor: "success.main",
    color: "common.white",
    fontSize: 15.5,
    fontWeight: 800,
    textTransform: "none",
    boxShadow: "0 14px 28px rgba(22, 163, 74, 0.28)",
    "&:hover": { bgcolor: "success.dark" },
  },

  errorAlert: (theme) => ({
    borderRadius: 4,
    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
    bgcolor: alpha(theme.palette.error.main, 0.08),
    p: 2.25,
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
    fontSize: 14,
    color: "error.main",
    boxShadow: `0 10px 20px ${alpha(theme.palette.error.main, 0.12)}`,
  }),

  // ── Bottom links ─────────────────────────────────────────────
  linksRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1.5,
    mt: 5,
    justifyContent: { xs: "center", md: "flex-start" },
    animation: "rideLinksIn 0.7s ease both",
    "@keyframes rideLinksIn": {
      from: { opacity: 0, transform: "translateY(12px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  },

  backLink: (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    px: 3.5,
    py: 1.6,
    borderRadius: 999,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
    bgcolor: alpha(theme.palette.background.paper, 0.8),
    color: "text.primary",
    fontSize: 14,
    fontWeight: 700,
    textDecoration: "none",
    transition: "all 0.15s",
    boxShadow: `0 8px 18px ${alpha(theme.palette.common.black, 0.06)}`,
    "&:hover": {
      bgcolor: alpha(theme.palette.primary.main, 0.08),
      transform: "translateY(-1px)",
    },
  }),
};
