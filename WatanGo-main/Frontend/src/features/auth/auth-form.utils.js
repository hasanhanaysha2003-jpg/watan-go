export const PASSWORD_STRENGTH_LABELS = [
  "-",
  "ضعيفة",
  "مقبولة",
  "جيدة",
  "قوية",
];

const LOCAL_PHONE_PATTERN = /^0\d{9}$/;
const MIN_PASSWORD_LENGTH = 1;

export function isValidLocalPhone(value) {
  return LOCAL_PHONE_PATTERN.test(value);
}

export function computePasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) || /[\u0600-\u06FF]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

function hasValidPassword(password) {
  return password.length >= MIN_PASSWORD_LENGTH;
}

export function validateLoginForm({ phone, password }) {
  const errors = {};
  if (!isValidLocalPhone(phone))
    errors.phone = "أدخل رقم الهاتف مثل 0594000002";
  if (!hasValidPassword(password)) errors.password = "كلمة المرور مطلوبة";
  return errors;
}

export function validateRegisterForm({ name, phone, password, confirm }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = "الاسم قصير جدًا";
  if (!isValidLocalPhone(phone))
    errors.phone = "أدخل رقم الهاتف مثل 0594000002";
  if (!hasValidPassword(password)) errors.password = "كلمة المرور مطلوبة";
  if (confirm !== password) errors.confirm = "كلمتا المرور غير متطابقتين";
  return errors;
}
