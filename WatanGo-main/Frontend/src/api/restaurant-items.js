import { apiClient } from "./client";

function extractError(error, fallback) {
  const data = error.response?.data;
  return data?.message ?? data?.Message ?? data?.errors?.[0] ?? fallback;
}

/** Returns the list of ALL restaurants owned by the caller. */
export async function getMyRestaurants() {
  try {
    const { data } = await apiClient.get("/api/restaurants/my");
    // Backend now returns an array
    return { ok: true, data: Array.isArray(data) ? data : [data] };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل بيانات المطاعم") };
  }
}

export async function getRestaurantItems(restaurantId) {
  try {
    const { data } = await apiClient.get(`/api/restaurants/${restaurantId}/items`);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل قائمة الأصناف") };
  }
}

export async function createRestaurantItem(restaurantId, payload) {
  try {
    const { data } = await apiClient.post(`/api/restaurants/${restaurantId}/items`, payload);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل إضافة الصنف") };
  }
}

export async function updateRestaurantItem(restaurantId, itemId, payload) {
  try {
    await apiClient.put(`/api/restaurants/${restaurantId}/items/${itemId}`, payload);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تعديل الصنف") };
  }
}

export async function deleteRestaurantItem(restaurantId, itemId) {
  try {
    await apiClient.delete(`/api/restaurants/${restaurantId}/items/${itemId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل حذف الصنف") };
  }
}
