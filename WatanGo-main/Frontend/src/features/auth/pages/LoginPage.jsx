import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Stack } from "@mui/material";
import { clearPendingLoginRole, routeForRole, useAuth } from "@/lib/auth";
import { loginRequest } from "@/api/auth";
import { consumeLoginRequiredMessage } from "@/shared/routing/route-guards";
import { validateLoginForm } from "@/features/auth/auth-form.utils";
import { useAuthFormFeedback } from "@/features/auth/hooks/use-auth-form-feedback";
import { AuthPageShell } from "@/features/auth/components/AuthPageShell";
import { AuthBrandHeader } from "@/features/auth/components/AuthBrandHeader";
import { AuthPhoneField } from "@/features/auth/components/AuthPhoneField";
import { AuthPasswordField } from "@/features/auth/components/AuthPasswordField";
import { AuthSubmitButton } from "@/features/auth/components/AuthSubmitButton";
import { AuthFooterLink } from "@/features/auth/components/AuthFooterLink";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState("0595200005");
  const [password, setPassword] = useState("User@1234");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, setErrors, shake, clearFieldError, triggerShake } =
    useAuthFormFeedback();

  useEffect(() => {
    clearPendingLoginRole();
    const message = consumeLoginRequiredMessage();
    if (message) toast.info(message);
  }, []);

  const validate = () => {
    const next = validateLoginForm({ phone, password });
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
    const result = await loginRequest({
      phoneNumber: phone,
      password,
    });

    if (!result.ok) {
      setLoading(false);
      triggerShake();
      setErrors({ password: result.message });
      toast.error(result.message);
      return;
    }

    login(result.user, result.token);
    toast.success(`أهلاً ${result.user.name}، تم تسجيل الدخول بنجاح`);
    navigate(routeForRole(result.user.role), { replace: true });
  };

  const isInvalid = !phone || !password;

  return (
    <AuthPageShell maxWidth={420} shake={shake}>
      <AuthBrandHeader
        title="تسجيل الدخول"
        subtitle="أدخل رقم هاتفك وكلمة المرور للمتابعة"
        titleMarginTop={2.5}
        marginBottom={4}
      />

      <Stack component="form" onSubmit={handleSubmit} spacing={2} noValidate>
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
          placeholder="أدخل كلمة المرور"
          autoComplete="current-password"
        />

        <AuthSubmitButton
          disabled={isInvalid}
          loading={loading}
          loadingText="جارٍ تسجيل الدخول..."
        >
          تسجيل الدخول
        </AuthSubmitButton>
      </Stack>

      <AuthFooterLink
        prompt="ليس لديك حساب؟"
        linkText="إنشاء حساب جديد"
        to="/register"
      />
    </AuthPageShell>
  );
}
