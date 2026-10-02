import { apiClient } from "./client";

function extractError(error, fallback) {
  const data = error.response?.data;
  return data?.message ?? data?.Message ?? data?.errors?.[0] ?? fallback;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export async function getCart() {
  try {
    const { data } = await apiClient.get("/api/cart");
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل السلة") };
  }
}

export async function addCartItem(payload) {
  try {
    const { data } = await apiClient.post("/api/cart/items", payload);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: extractError(error, "فشل إضافة العنصر للسلة"),
    };
  }
}

export async function updateCartItem(id, quantity) {
  try {
    const { data } = await apiClient.put(`/api/cart/items/${id}`, { quantity });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحديث الكمية") };
  }
}

export async function removeCartItem(id) {
  try {
    const { data } = await apiClient.delete(`/api/cart/items/${id}`);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل حذف العنصر") };
  }
}

export async function clearCart() {
  try {
    const { data } = await apiClient.delete("/api/cart");
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تفريغ السلة") };
  }
}

export async function checkout(notes) {
  try {
    const params = notes ? { notes } : {};
    const { data } = await apiClient.post("/api/cart/checkout", null, {
      params,
    });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تأكيد الطلب") };
  }
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function getMyOrders() {
  try {
    const { data } = await apiClient.get("/api/orders/my");
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل الطلبات") };
  }
}

export async function getOrderById(id) {
  try {
    const { data } = await apiClient.get(`/api/orders/${id}`);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "الطلب غير موجود") };
  }
}

export async function getAllOrders(status) {
  try {
    const params = status ? { status } : {};
    const { data } = await apiClient.get("/api/orders", { params });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل الطلبات") };
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const { data } = await apiClient.put(`/api/orders/${id}/status`, {
      status,
    });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحديث حالة الطلب") };
  }
}
