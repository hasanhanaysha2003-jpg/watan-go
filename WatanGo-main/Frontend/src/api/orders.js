import { apiClient } from "./client";

function extractError(error, fallback) {
  const data = error.response?.data;
  return data?.message ?? data?.Message ?? data?.errors?.[0] ?? fallback;
}

export async function getOrderById(id) {
  try {
    const { data } = await apiClient.get(`/api/orders/${id}`);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل بيانات الطلب") };
  }
}

export async function getOrderLocationSnapshot(id) {
  try {
    const { data } = await apiClient.get(`/api/orders/${id}/location`);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل بيانات الموقع") };
  }
}
