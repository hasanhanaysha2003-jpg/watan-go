import { apiClient } from "./client";

function extractError(error, fallback) {
  const data = error.response?.data;
  return data?.message ?? data?.Message ?? data?.errors?.[0] ?? fallback;
}

export async function getRestaurants({ name, minRating, maxDeliveryFee } = {}) {
  try {
    const params = {};
    if (name) params.name = name;
    if (minRating != null) params.minRating = minRating;
    if (maxDeliveryFee != null) params.maxDeliveryFee = maxDeliveryFee;
    const { data } = await apiClient.get("/api/restaurants", { params });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل المطاعم") };
  }
}

export async function getRestaurantById(id) {
  try {
    const { data } = await apiClient.get(`/api/restaurants/${id}`);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "المطعم غير موجود") };
  }
}

export async function createRestaurant(payload) {
  try {
    const { data } = await apiClient.post("/api/restaurants", payload);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل إنشاء المطعم") };
  }
}

export async function updateRestaurant(id, payload) {
  try {
    await apiClient.put(`/api/restaurants/${id}`, payload);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحديث المطعم") };
  }
}

export async function deleteRestaurant(id) {
  try {
    await apiClient.delete(`/api/restaurants/${id}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل حذف المطعم") };
  }
}
