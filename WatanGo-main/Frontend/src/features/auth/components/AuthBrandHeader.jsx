import { Link as RouterLink } from "react-router-dom";
import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import { authPageStyles } from "@/features/auth/auth-page.styles";

export function AuthBrandHeader({
  title,
  subtitle,
  titleMarginTop = 2,
  marginBottom = 3,
}) {
  return (
    <Stack
      sx={[
        authPageStyles.header(marginBottom),
        { alignItems: "center", textAlign: "center" },
      ]}
    >
      <MuiLink
        component={RouterLink}
        to="/"
        underline="none"
        sx={authPageStyles.brandLink}
      >
        <Box sx={authPageStyles.brandMark}>
          <Typography sx={authPageStyles.brandMarkText}>و</Typography>
        </Box>
        <Stack
          sx={[authPageStyles.brandTextStack, { alignItems: "flex-start" }]}
        >
          <Typography sx={authPageStyles.brandTitle}>وطن جو</Typography>
          <Typography dir="ltr" sx={authPageStyles.brandSubtitle}>
            Watan Go
          </Typography>
        </Stack>
      </MuiLink>
      <Typography sx={authPageStyles.title(titleMarginTop)}>{title}</Typography>
      <Typography sx={authPageStyles.subtitle}>{subtitle}</Typography>
    </Stack>
  );
}
