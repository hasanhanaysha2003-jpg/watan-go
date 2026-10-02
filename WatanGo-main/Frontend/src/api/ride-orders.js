import { apiClient } from "./client";

function extractError(error, fallback) {
  const data = error.response?.data;
  return data?.message ?? data?.Message ?? data?.errors?.[0] ?? fallback;
}

export async function createRideOrderRequest(payload) {
  try {
    const { data } = await apiClient.post("/api/ride-orders", payload);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل إرسال طلب الرحلة") };
  }
}

export async function getMyRideOrders() {
  try {
    const { data } = await apiClient.get("/api/ride-orders/my");
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل سجل الرحلات") };
  }
}

export async function getRideOrderById(id) {
  try {
    const { data } = await apiClient.get(`/api/ride-orders/${id}`);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل بيانات الرحلة") };
  }
}

export async function getRideLocationSnapshot(id) {
  try {
    const { data } = await apiClient.get(`/api/ride-orders/${id}/location`);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل بيانات الموقع") };
  }
}
