import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { authPageStyles } from "@/features/auth/auth-page.styles";

export function PasswordToggleButton({ visible, onClick, label }) {
  return (
    <IconButton
      onClick={onClick}
      size="small"
      aria-label={label}
      sx={authPageStyles.iconButton}
    >
      {visible ? (
        <VisibilityOffIcon fontSize="small" />
      ) : (
        <VisibilityIcon fontSize="small" />
      )}
    </IconButton>
  );
}
