import { InputAdornment, TextField } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { authPageStyles } from "@/features/auth/auth-page.styles";
import { AuthFormField } from "@/features/auth/components/AuthFormField";

export function AuthPhoneField({
  value,
  onChange,
  disabled,
  error,
  helperText,
}) {
  return (
    <AuthFormField id="phone" label="رقم الهاتف">
      <TextField
        id="phone"
        type="tel"
        fullWidth
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="0594000002"
        disabled={disabled}
        error={Boolean(error)}
        helperText={helperText}
        slotProps={{
          htmlInput: {
            inputMode: "numeric",
            autoComplete: "tel",
            dir: "ltr",
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIphoneIcon sx={authPageStyles.fieldIcon} />
              </InputAdornment>
            ),
          },
          formHelperText: { sx: authPageStyles.helperText },
        }}
        sx={authPageStyles.textField}
      />
    </AuthFormField>
  );
}
