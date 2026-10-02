import { Stack, Typography } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { authPageStyles } from "@/features/auth/auth-page.styles";

export function AuthSecurityNote() {
  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={[
        authPageStyles.securityNote,
        { alignItems: "center", justifyContent: "center" },
      ]}
    >
      <VerifiedUserIcon sx={authPageStyles.securityIcon} />
      <Typography sx={authPageStyles.securityText}>
        بياناتك محمية بتشفير عالي المستوى
      </Typography>
    </Stack>
  );
}
