import { Link as RouterLink } from "react-router-dom";
import { Box, Link as MuiLink, Typography } from "@mui/material";
import { authPageStyles } from "@/features/auth/auth-page.styles";

export function AuthFooterLink({ prompt, linkText, to, hint }) {
  return (
    <Box sx={authPageStyles.footer}>
      <Typography sx={authPageStyles.footerText}>
        {prompt}{" "}
        <MuiLink
          component={RouterLink}
          to={to}
          underline="none"
          sx={authPageStyles.footerLink}
        >
          {linkText}
        </MuiLink>
      </Typography>
      {hint ? (
        <Typography sx={authPageStyles.footerHint}>{hint}</Typography>
      ) : null}
    </Box>
  );
}
