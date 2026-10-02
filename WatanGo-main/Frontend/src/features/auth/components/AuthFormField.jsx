import { Box, Typography } from "@mui/material";
import { authPageStyles } from "@/features/auth/auth-page.styles";

function FieldLabel({ htmlFor, children }) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      sx={authPageStyles.fieldLabel}
    >
      {children}
    </Typography>
  );
}

export function AuthFormField({ id, label, children }) {
  return (
    <Box>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
    </Box>
  );
}
