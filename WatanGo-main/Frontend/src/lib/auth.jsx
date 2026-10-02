import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TOKEN_STORAGE_KEY } from "@/api/client";

const USER_STORAGE_KEY = "watan_go_user";
const PENDING_LOGIN_ROLE_KEY = "watan_go_pending_login_role";
const AUTH_CHANGED_EVENT = "watan_go_auth_changed";

export const ROLES = [
  {
    value: "customer",
    label: "مستخدم",
    emoji: "🙋",
    route: "/dashboard/customer",
    desc: "اطلب طعام، تسوّق، احجز رحلة",
  },
  {
    value: "driver",
    label: "سائق",
    emoji: "🚗",
    route: "/dashboard/driver",
    desc: "استلم طلبات التوصيل والرحلات",
  },
  {
    value: "restaurant",
    label: "صاحب مطعم",
    emoji: "🍔",
    route: "/dashboard/restaurant",
    desc: "أدر قائمتك والطلبات الواردة",
  },
  {
    value: "shop",
    label: "صاحب محل",
    emoji: "🏪",
    route: "/dashboard/shop",
    desc: "أدر منتجاتك ومخزون متجرك",
  },
  {
    value: "admin",
    label: "أدمن المنصة",
    emoji: "🛡️",
    route: "/dashboard/admin",
    desc: "إشراف كامل على المنظومة",
  },
];

export const PUBLIC_REGISTER_ROLES = ROLES.filter((r) => r.value !== "admin");

export function isPublicRegisterRole(role) {
  return role !== "admin";
}

export function routeForRole(role) {
  return ROLES.find((r) => r.value === role)?.route ?? "/";
}

export function redirectToOwnDashboard(user) {
  return user ? routeForRole(user.role) : "/login";
}

export function labelForRole(role) {
  return ROLES.find((r) => r.value === role)?.label ?? role;
}

export function emojiForRole(role) {
  return ROLES.find((r) => r.value === role)?.emoji ?? "👤";
}

export function getDashboardNavLinks(role) {
  switch (role) {
    case "customer":
      return [
        { to: "/restaurants", label: "طلب طعام" },
        { to: "/shops", label: "تسوق" },
        { to: "/ride-request", label: "رحلات" },
      ];
    case "driver":
      return [
        { to: "/dashboard/driver", label: "الطلبات" },
        { to: "/dashboard/driver", label: "التوصيل" },
      ];
    case "shop":
      return [
        { to: "/dashboard/shop", label: "المنتجات" },
        { to: "/dashboard/shop", label: "الطلبات" },
      ];
    case "admin":
      return [{ to: "/dashboard/admin", label: "لوحة الإدارة" }];
    default:
      return [];
  }
}

export function setPendingLoginRole(role) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_LOGIN_ROLE_KEY, role);
}

export function getPendingLoginRole() {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_LOGIN_ROLE_KEY);
  return raw && isPublicRegisterRole(raw) ? raw : null;
}

export function clearPendingLoginRole() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_LOGIN_ROLE_KEY);
}

function readUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function notifyChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}

export function getAuth() {
  return readUser();
}

export function getToken() {
  return readToken();
}

export function setAuth(user, token) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  notifyChange();
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  notifyChange();
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(readToken);

  useEffect(() => {
    const sync = () => {
      setUser(readUser());
      setToken(readToken());
    };
    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const login = useCallback((nextUser, nextToken) => {
    setAuth(nextUser, nextToken);
    setUser(nextUser);
    setToken(nextToken ?? readToken());
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [user, token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export function getRegisteredAccounts() {
  return [];
}

export function saveRegisteredAccounts() {}

export function ensureInitialAdminAccount() {
  return null;
}

export function findRegisteredAccountByPhone() {
  return null;
}

export async function registerAccount() {
  return { ok: false, message: "Use registerRequest from @/api instead" };
}

export async function authenticateAccount() {
  return { ok: false, reason: "deprecated" };
}
