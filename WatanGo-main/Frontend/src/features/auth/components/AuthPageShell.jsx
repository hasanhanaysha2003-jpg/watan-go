import { Box, Paper } from "@mui/material";
import { authPageStyles } from "@/features/auth/auth-page.styles";

export function AuthPageShell({ children, maxWidth = 440, shake = false }) {
  return (
    <Box dir="rtl" sx={authPageStyles.page}>
      <Box sx={authPageStyles.gridOverlay} />

      <Box sx={authPageStyles.pageContent}>
        <Paper elevation={0} sx={authPageStyles.card({ maxWidth, shake })}>
          {children}
        </Paper>
      </Box>
    </Box>
  );
}
