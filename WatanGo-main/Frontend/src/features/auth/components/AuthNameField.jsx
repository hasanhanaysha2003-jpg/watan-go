import { InputAdornment, TextField } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import { authPageStyles } from "@/features/auth/auth-page.styles";
import { AuthFormField } from "@/features/auth/components/AuthFormField";

export function AuthNameField({
  value,
  onChange,
  disabled,
  error,
  helperText,
}) {
  return (
    <AuthFormField id="name" label="الاسم الكامل">
      <TextField
        id="name"
        type="text"
        fullWidth
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="مثلاً: أحمد محمد"
        disabled={disabled}
        error={Boolean(error)}
        helperText={helperText}
        slotProps={{
          htmlInput: { autoComplete: "name" },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon sx={authPageStyles.fieldIcon} />
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
