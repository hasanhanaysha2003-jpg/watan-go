import { InputAdornment, TextField } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { authPageStyles } from "@/features/auth/auth-page.styles";
import { AuthFormField } from "@/features/auth/components/AuthFormField";
import { PasswordToggleButton } from "@/features/auth/components/PasswordToggleButton";

export function AuthPasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggleVisibility,
  disabled,
  error,
  helperText,
  placeholder,
  autoComplete,
  isValid = false,
  children,
}) {
  return (
    <AuthFormField id={id} label={label}>
      <TextField
        id={id}
        type={visible ? "text" : "password"}
        fullWidth
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        error={Boolean(error)}
        helperText={helperText}
        slotProps={{
          htmlInput: { autoComplete },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={authPageStyles.fieldIcon} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {isValid ? (
                  <CheckCircleIcon sx={authPageStyles.validIcon} />
                ) : (
                  <PasswordToggleButton
                    visible={visible}
                    onClick={onToggleVisibility}
                    label={visible ? `إخفاء ${label}` : `إظهار ${label}`}
                  />
                )}
              </InputAdornment>
            ),
          },
          formHelperText: { sx: authPageStyles.helperText },
        }}
        sx={[
          authPageStyles.textField,
          isValid && authPageStyles.validConfirmField,
        ]}
      />
      {children}
    </AuthFormField>
  );
}
