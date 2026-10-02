import { Box, Stack, Typography } from "@mui/material";
import { authPageStyles } from "@/features/auth/auth-page.styles";
import { PASSWORD_STRENGTH_LABELS } from "@/features/auth/auth-form.utils";

export function PasswordStrengthMeter({ strength }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={[authPageStyles.passwordStrength, { alignItems: "center" }]}
    >
      <Box sx={authPageStyles.passwordStrengthTrack}>
        {[0, 1, 2, 3].map((index) => (
          <Box
            key={index}
            sx={authPageStyles.passwordStrengthBar(index < strength, strength)}
          />
        ))}
      </Box>
      <Typography sx={authPageStyles.passwordStrengthLabel}>
        {PASSWORD_STRENGTH_LABELS[strength]}
      </Typography>
    </Stack>
  );
}
