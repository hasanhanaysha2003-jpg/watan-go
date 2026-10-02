import { apiClient } from "./client";

function extractError(error, fallback) {
  const data = error.response?.data;
  return data?.message ?? data?.Message ?? data?.errors?.[0] ?? fallback;
}

export async function getMyOrders(params = {}) {
  try {
    const { data } = await apiClient.get("/api/orders/my", { params });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل الطلبات") };
  }
}

export async function getMyRides(params = {}) {
  try {
    const { data } = await apiClient.get("/api/ride-orders/my", { params });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل الرحلات") };
  }
}
