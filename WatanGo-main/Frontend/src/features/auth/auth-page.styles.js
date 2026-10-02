import { alpha } from "@mui/material/styles";

export const authPageStyles = {
  page: (theme) => ({
    position: "relative",
    minHeight: "calc(100vh - 72px)",
    width: "100%",
    overflow: "hidden",
    bgcolor: "background.default",
    color: "text.primary",
    fontFamily: theme.typography.fontFamily,
    backgroundImage: [
      `radial-gradient(ellipse 80% 50% at 50% 0%, ${alpha(theme.palette.success.main, 0.1)}, transparent 60%)`,
      `radial-gradient(ellipse 60% 50% at 100% 100%, ${alpha(theme.palette.success.main, 0.06)}, transparent 60%)`,
    ].join(", "),
  }),
  gridOverlay: (theme) => ({
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    opacity: 0.04,
    backgroundImage: [
      `linear-gradient(${theme.palette.text.primary} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${theme.palette.text.primary} 1px, transparent 1px)`,
    ].join(", "),
    backgroundSize: "56px 56px",
    maskImage:
      "radial-gradient(ellipse 60% 50% at 50% 40%, black, transparent 80%)",
  }),
  pageContent: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    minHeight: "calc(100vh - 72px)",
    alignItems: "center",
    justifyContent: "center",
    px: 2,
    py: 5,
  },
  card:
    ({ maxWidth = 440, shake = false } = {}) =>
    (theme) => ({
      width: "100%",
      maxWidth,
      borderRadius: 5,
      border: `1px solid ${theme.palette.divider}`,
      bgcolor: "background.paper",
      p: { xs: 3.5, sm: 4 },
      boxShadow: `0 20px 60px -20px ${alpha(theme.palette.text.primary, 0.18)}`,
      animation: shake ? "shake 0.45s ease-in-out" : "none",
      "@keyframes shake": {
        "0%, 100%": { transform: "translateX(0)" },
        "20%": { transform: "translateX(-8px)" },
        "40%": { transform: "translateX(8px)" },
        "60%": { transform: "translateX(-6px)" },
        "80%": { transform: "translateX(6px)" },
      },
    }),
  header: (marginBottom = 3) => ({
    mb: marginBottom,
  }),
  brandLink: {
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    textDecoration: "none",
  },
  brandMark: (theme) => ({
    height: 48,
    width: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    background: `linear-gradient(to bottom right, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
    boxShadow: `0 10px 25px ${alpha(theme.palette.success.main, 0.3)}`,
  }),
  brandMarkText: {
    fontSize: 20,
    fontWeight: 700,
    color: "common.white",
  },
  brandTextStack: {
    lineHeight: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "text.primary",
  },
  brandSubtitle: {
    mt: 0.25,
    fontSize: 12,
    fontWeight: 500,
    color: "success.dark",
  },
  title: (marginTop = 2) => ({
    mt: marginTop,
    fontSize: marginTop > 2 ? 18 : 16,
    fontWeight: 700,
    color: "text.primary",
  }),
  subtitle: {
    mt: 0.5,
    fontSize: 14,
    color: "text.secondary",
  },
  fieldLabel: {
    display: "block",
    mb: 0.75,
    fontSize: 14,
    fontWeight: 600,
    color: "text.primary",
  },
  textField: (theme) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor: "background.paper",
      fontFamily: theme.typography.fontFamily,
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": { borderColor: theme.palette.action.hover },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.success.main,
        borderWidth: 2,
      },
      "&.Mui-error fieldset": {
        borderColor: theme.palette.error.light,
      },
    },
  }),
  validConfirmField: (theme) => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.success.main,
        borderWidth: 2,
      },
    },
  }),
  helperText: {
    fontSize: 12,
    color: "error.main",
    mx: 0,
    minHeight: "1.2em",
  },
  fieldIcon: {
    fontSize: 18,
    color: "text.disabled",
  },
  validIcon: {
    fontSize: 18,
    color: "success.main",
  },
  phonePrefix: {
    ml: 0.5,
    fontSize: 14,
    color: "text.disabled",
  },
  iconButton: {
    color: "text.disabled",
  },
  passwordStrength: {
    mt: -1,
    mb: 0.5,
  },
  passwordStrengthTrack: {
    display: "flex",
    flex: 1,
    gap: 0.5,
  },
  passwordStrengthBar: (active, strength) => (theme) => {
    const colors = [
      theme.palette.divider,
      theme.palette.error.light,
      theme.palette.warning.light,
      theme.palette.warning.main,
      theme.palette.success.main,
    ];

    return {
      height: 4,
      flex: 1,
      borderRadius: 999,
      bgcolor: active ? colors[strength] : theme.palette.divider,
      transition: theme.transitions.create("background-color", {
        duration: theme.transitions.duration.shortest,
      }),
    };
  },
  passwordStrengthLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "text.secondary",
  },
  forgotPasswordRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  forgotPasswordButton: {
    fontSize: 12,
    fontWeight: 600,
    color: "success.dark",
    textTransform: "none",
    minWidth: 0,
    p: 0,
    "&:hover": {
      color: "success.main",
      bgcolor: "transparent",
    },
  },
  termsText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "text.secondary",
  },
  termsHighlight: {
    fontWeight: 600,
    color: "success.dark",
  },
  submitButton: (theme) => ({
    height: 48,
    borderRadius: 3,
    background: `linear-gradient(to left, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
    color: "common.white",
    fontSize: 14,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: `0 10px 25px ${alpha(theme.palette.success.main, 0.3)}`,
    transition: theme.transitions.create(
      ["box-shadow", "transform", "background"],
      {
        duration: theme.transitions.duration.short,
      },
    ),
    "&:hover": {
      background: `linear-gradient(to left, ${theme.palette.success.dark}, ${theme.palette.success.dark})`,
      boxShadow: `0 15px 30px ${alpha(theme.palette.success.main, 0.4)}`,
    },
    "&:active": { transform: "scale(0.99)" },
    "&.Mui-disabled": {
      opacity: 0.5,
      color: "common.white",
      boxShadow: "none",
    },
  }),
  submitLoader: {
    color: "common.white",
    mr: 1,
  },
  securityNote: {
    pt: 0.5,
  },
  securityIcon: {
    fontSize: 14,
    color: "success.dark",
  },
  securityText: {
    fontSize: 12,
    color: "text.secondary",
  },
  footer: {
    mt: 3,
    borderTop: 1,
    borderColor: "divider",
    pt: 2.5,
    textAlign: "center",
  },
  footerText: {
    fontSize: 14,
    color: "text.secondary",
  },
  footerLink: {
    fontWeight: 700,
    color: "success.dark",
    textDecoration: "none",
  },
  footerHint: {
    mt: 1.5,
    fontSize: 12,
    color: "text.disabled",
  },
};
