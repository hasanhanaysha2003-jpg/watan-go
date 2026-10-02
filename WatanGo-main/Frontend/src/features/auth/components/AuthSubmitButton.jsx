import { Button, CircularProgress } from "@mui/material";
import { authPageStyles } from "@/features/auth/auth-page.styles";

export function AuthSubmitButton({ disabled, loading, loadingText, children }) {
  return (
    <Button
      type="submit"
      disabled={disabled || loading}
      fullWidth
      sx={authPageStyles.submitButton}
    >
      {loading ? (
        <>
          <CircularProgress size={16} sx={authPageStyles.submitLoader} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
