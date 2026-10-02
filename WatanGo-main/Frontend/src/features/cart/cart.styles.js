import { alpha } from "@mui/material/styles";

export const cartStyles = {
  // ── Page shell ────────────────────────────────────────────────────────────
  page: (theme) => ({
    position: "relative",
    minHeight: "calc(100vh - 72px)",
    bgcolor: "background.default",
    color: "text.primary",
    fontFamily: theme.typography.fontFamily,
    backgroundImage: [
      `radial-gradient(ellipse 80% 50% at 50% 0%, ${alpha(theme.palette.primary.main, 0.07)}, transparent 60%)`,
      `radial-gradient(ellipse 60% 50% at 100% 100%, ${alpha(theme.palette.primary.main, 0.03)}, transparent 60%)`,
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

  // ── Hero ──────────────────────────────────────────────────────────────────
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
    maxWidth: 520,
    mx: "auto",
  },

  // ── Content section ───────────────────────────────────────────────────────
  contentSection: {
    position: "relative",
    zIndex: 1,
    px: { xs: 3, md: 6 },
    pb: { xs: 6, md: 10 },
    pt: 2,
    maxWidth: 1280,
    mx: "auto",
    width: "100%",
  },

  // ── Two-column grid ───────────────────────────────────────────────────────
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", lg: "1.15fr 0.85fr" },
    gap: 4,
    alignItems: "start",
  },

  // ── Cart item card ────────────────────────────────────────────────────────
  itemCard: (theme) => ({
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "flex-start", sm: "center" },
    justifyContent: "space-between",
    gap: 2,
    borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: "background.paper",
    boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
    p: 3,
    transition: theme.transitions.create(["box-shadow"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      boxShadow: `0 8px 28px ${alpha(theme.palette.common.black, 0.1)}`,
    },
  }),

  itemAvatar: (theme) => ({
    width: 56,
    height: 56,
    borderRadius: 3,
    fontSize: 20,
    fontWeight: 700,
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: "primary.main",
    flexShrink: 0,
  }),

  itemTypeBadge: (type, theme) => ({
    display: "inline-block",
    px: 1.25,
    py: 0.3,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    mb: 0.5,
    bgcolor:
      type === "restaurant"
        ? alpha(theme.palette.warning.main, 0.1)
        : alpha(theme.palette.success.main, 0.1),
    color: type === "restaurant" ? "warning.dark" : "success.dark",
  }),

  itemName: { fontSize: 16, fontWeight: 700, lineHeight: 1.3 },

  itemVendor: { fontSize: 12, color: "text.secondary", mt: 0.25 },

  itemPrice: { fontSize: 17, fontWeight: 800, color: "primary.main", mt: 0.5 },

  // ── Quantity controls ─────────────────────────────────────────────────────
  qtyGroup: {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
  },

  qtyBtn: (theme) => ({
    minWidth: 0,
    width: 34,
    height: 34,
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.05)
        : alpha(theme.palette.common.black, 0.04),
    color: "text.primary",
    "&:hover": {
      bgcolor:
        theme.palette.mode === "dark"
          ? alpha(theme.palette.common.white, 0.1)
          : alpha(theme.palette.common.black, 0.08),
    },
    transition: "all 0.15s",
  }),

  qtyValue: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 15,
    fontWeight: 700,
  },

  deleteBtn: (theme) => ({
    minWidth: 0,
    width: 34,
    height: 34,
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
    bgcolor: alpha(theme.palette.error.main, 0.06),
    color: "error.main",
    "&:hover": {
      bgcolor: alpha(theme.palette.error.main, 0.12),
    },
    transition: "all 0.15s",
    ml: 1,
  }),

  // ── Order summary sidebar ─────────────────────────────────────────────────
  sidebar: (theme) => ({
    borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: "background.paper",
    boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
    p: 3.5,
    position: { lg: "sticky" },
    top: { lg: 24 },
  }),

  sidebarEyebrow: (theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 0.75,
    px: 1.5,
    py: 0.5,
    borderRadius: 999,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    bgcolor: alpha(theme.palette.primary.main, 0.07),
    color: "primary.main",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
    mb: 1.5,
  }),

  sidebarTitle: { fontSize: 20, fontWeight: 800, mb: 2.5 },

  notesField: (theme) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor:
        theme.palette.mode === "dark"
          ? alpha(theme.palette.common.white, 0.04)
          : alpha(theme.palette.common.black, 0.02),
      fontFamily: theme.typography.fontFamily,
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": { borderColor: theme.palette.primary.light },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
    "& .MuiInputBase-input": { fontSize: 14, py: 1.25 },
    "& .MuiInputLabel-root": { fontFamily: theme.typography.fontFamily },
  }),

  divider: { my: 2.5 },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 1.25,
  },

  summaryLabel: { fontSize: 14, color: "text.secondary" },

  summaryValue: { fontSize: 14, fontWeight: 600 },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 2,
  },

  totalLabel: { fontSize: 16, fontWeight: 800 },

  totalValue: { fontSize: 22, fontWeight: 800, color: "primary.main" },

  checkoutBtn: (theme) => ({
    width: "100%",
    mt: 3,
    height: 50,
    borderRadius: 3,
    background: `linear-gradient(to left, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    color: "common.white",
    fontSize: 15,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: `0 4px 18px ${alpha(theme.palette.primary.main, 0.3)}`,
    "&:hover": {
      boxShadow: `0 8px 28px ${alpha(theme.palette.primary.main, 0.4)}`,
      transform: "translateY(-1px)",
    },
    "&.Mui-disabled": {
      background: "action.disabledBackground",
      boxShadow: "none",
    },
    transition: "all 0.2s",
  }),

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyBox: (theme) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 340,
    borderRadius: 4,
    border: `1px dashed ${theme.palette.divider}`,
    bgcolor: alpha(theme.palette.action.hover, 0.5),
    textAlign: "center",
    p: 6,
    gap: 1.5,
  }),

  emptyIcon: (theme) => ({
    width: 72,
    height: 72,
    borderRadius: 4,
    bgcolor: alpha(theme.palette.primary.main, 0.08),
    color: "primary.main",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 1,
  }),

  emptyActionBtn: (variant, theme) =>
    variant === "primary"
      ? {
          px: 3,
          py: 1.25,
          borderRadius: 3,
          background: `linear-gradient(to left, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          color: "common.white",
          fontSize: 14,
          fontWeight: 700,
          textTransform: "none",
          boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
          "&:hover": { transform: "translateY(-1px)" },
          transition: "all 0.2s",
        }
      : {
          px: 3,
          py: 1.25,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          color: "text.primary",
          fontSize: 14,
          fontWeight: 600,
          textTransform: "none",
          transition: "all 0.2s",
        },
};
