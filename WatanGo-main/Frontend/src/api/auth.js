import { apiClient } from "./client";

const BACKEND_TO_FRONTEND_ROLE = {
  Admin: "admin",
  User: "customer",
  Driver: "driver",
  RestaurantOwner: "restaurant",
  MarketOwner: "shop",
};

const FRONTEND_TO_BACKEND_ROLE = {
  admin: "Admin",
  customer: "User",
  driver: "Driver",
  restaurant: "RestaurantOwner",
  shop: "MarketOwner",
};

export function mapBackendRole(role) {
  return BACKEND_TO_FRONTEND_ROLE[role] ?? "customer";
}

export function mapFrontendRole(role) {
  return FRONTEND_TO_BACKEND_ROLE[role] ?? "User";
}

function normalizeAuthResponse(data) {
  return {
    token: data.token,
    expiresAtUtc: data.expiresAtUtc,
    user: {
      name: data.fullName,
      phone: data.phoneNumber,
      role: mapBackendRole(data.role),
    },
  };
}

function extractErrorMessage(error, fallback) {
  const data = error.response?.data;
  return data?.message ?? data?.Message ?? data?.errors?.[0] ?? fallback;
}

export async function loginRequest({ phoneNumber, password }) {
  try {
    const { data } = await apiClient.post("/api/Authentication/login", {
      phoneNumber,
      password,
    });
    return { ok: true, ...normalizeAuthResponse(data) };
  } catch (error) {
    return {
      ok: false,
      message: extractErrorMessage(error, "تعذّر تسجيل الدخول"),
    };
  }
}

export async function registerRequest({ fullName, phoneNumber, password }) {
  try {
    const { data } = await apiClient.post("/api/Authentication/register", {
      fullName,
      phoneNumber,
      password,
    });
    return { ok: true, ...normalizeAuthResponse(data) };
  } catch (error) {
    return {
      ok: false,
      message: extractErrorMessage(error, "تعذّر إنشاء الحساب"),
    };
  }
}
