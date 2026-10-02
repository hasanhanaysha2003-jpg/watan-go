import { apiClient } from "./client";

function extractError(error, fallback) {
  const data = error.response?.data;
  return data?.message ?? data?.Message ?? data?.errors?.[0] ?? fallback;
}

export async function getRestaurantOrders(restaurantId) {
  try {
    const { data } = await apiClient.get("/api/restaurants/my/orders", {
      params: { restaurantId },
    });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل الطلبات") };
  }
}

export async function updateRestaurantOrderStatus(orderId, status, restaurantId) {
  try {
    await apiClient.put(
      `/api/restaurants/my/orders/${orderId}/status`,
      { status },
      { params: { restaurantId } },
    );
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحديث حالة الطلب") };
  }
}
