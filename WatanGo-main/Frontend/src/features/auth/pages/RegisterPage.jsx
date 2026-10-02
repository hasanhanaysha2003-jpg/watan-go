import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Stack } from "@mui/material";
import { routeForRole, useAuth } from "@/lib/auth";
import { registerRequest } from "@/api/auth";
import {
  computePasswordStrength,
  validateRegisterForm,
} from "@/features/auth/auth-form.utils";
import { useAuthFormFeedback } from "@/features/auth/hooks/use-auth-form-feedback";
import { AuthPageShell } from "@/features/auth/components/AuthPageShell";
import { AuthBrandHeader } from "@/features/auth/components/AuthBrandHeader";
import { AuthNameField } from "@/features/auth/components/AuthNameField";
import { AuthPhoneField } from "@/features/auth/components/AuthPhoneField";
import { AuthPasswordField } from "@/features/auth/components/AuthPasswordField";
import { PasswordStrengthMeter } from "@/features/auth/components/PasswordStrengthMeter";
import { AuthSubmitButton } from "@/features/auth/components/AuthSubmitButton";
import { AuthFooterLink } from "@/features/auth/components/AuthFooterLink";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, setErrors, shake, clearFieldError, triggerShake } =
    useAuthFormFeedback();

  const passwordStrength = computePasswordStrength(password);
  const isConfirmValid =
    Boolean(confirm) && confirm === password && !errors.confirm;
  const isInvalid = !name || !phone || !password || !confirm;

  const validate = () => {
    const next = validateRegisterForm({ name, phone, password, confirm });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      triggerShake();
      return;
    }

    setLoading(true);
    const result = await registerRequest({
      fullName: name.trim(),
      phoneNumber: phone,
      password,
    });

    if (!result.ok) {
      setLoading(false);
      triggerShake();
      setErrors((previous) => ({ ...previous, phone: result.message }));
      toast.error(result.message);
      return;
    }

    login(result.user, result.token);
    toast.success("تم إنشاء الحساب وتسجيل الدخول بنجاح");
    navigate(routeForRole(result.user.role), { replace: true });
  };

  return (
    <AuthPageShell maxWidth={440} shake={shake}>
      <AuthBrandHeader title="إنشاء حساب جديد" subtitle="" />

      <Stack component="form" onSubmit={handleSubmit} spacing={2} noValidate>
        <AuthNameField
          value={name}
          onChange={(value) => {
            setName(value);
            clearFieldError("name");
          }}
          disabled={loading}
          error={errors.name}
          helperText={errors.name || " "}
        />

        <AuthPhoneField
          value={phone}
          onChange={(value) => {
            setPhone(value);
            clearFieldError("phone");
          }}
          disabled={loading}
          error={errors.phone}
          helperText={errors.phone || " "}
        />

        <AuthPasswordField
          id="password"
          label="كلمة المرور"
          value={password}
          onChange={(value) => {
            setPassword(value);
            clearFieldError("password");
          }}
          visible={showPwd}
          onToggleVisibility={() => setShowPwd((visible) => !visible)}
          disabled={loading}
          error={errors.password}
          helperText={errors.password || " "}
          placeholder="6 أحرف على الأقل"
          autoComplete="new-password"
        >
          {password ? (
            <PasswordStrengthMeter strength={passwordStrength} />
          ) : null}
        </AuthPasswordField>

        <AuthPasswordField
          id="confirm"
          label="تأكيد كلمة المرور"
          value={confirm}
          onChange={(value) => {
            setConfirm(value);
            clearFieldError("confirm");
          }}
          visible={showConfirm}
          onToggleVisibility={() => setShowConfirm((visible) => !visible)}
          disabled={loading}
          error={errors.confirm}
          helperText={errors.confirm || " "}
          placeholder="أعد إدخال كلمة المرور"
          autoComplete="new-password"
          isValid={isConfirmValid}
        />

        <AuthSubmitButton
          disabled={isInvalid}
          loading={loading}
          loadingText="جارٍ إنشاء الحساب..."
        >
          إنشاء الحساب
        </AuthSubmitButton>
      </Stack>

      <AuthFooterLink
        prompt="لديك حساب بالفعل؟"
        linkText="تسجيل الدخول"
        to="/login"
      />
    </AuthPageShell>
  );
}
