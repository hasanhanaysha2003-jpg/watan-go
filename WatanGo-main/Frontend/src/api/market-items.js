import { apiClient } from "./client";

function extractError(error, fallback) {
  const data = error.response?.data;
  return data?.message ?? data?.Message ?? data?.errors?.[0] ?? fallback;
}

export async function getMarketItems({
  name,
  category,
  minPrice,
  maxPrice,
  inStock,
} = {}) {
  try {
    const params = {};
    if (name) params.name = name;
    if (category) params.category = category;
    if (minPrice != null) params.minPrice = minPrice;
    if (maxPrice != null) params.maxPrice = maxPrice;
    if (inStock) params.inStock = true;
    const { data } = await apiClient.get("/api/market-items", { params });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل المنتجات") };
  }
}

export async function getMarketItemById(id) {
  try {
    const { data } = await apiClient.get(`/api/market-items/${id}`);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "المنتج غير موجود") };
  }
}

export async function createMarketItem(payload) {
  try {
    const { data } = await apiClient.post("/api/market-items", payload);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل إنشاء المنتج") };
  }
}

export async function updateMarketItem(id, payload) {
  try {
    await apiClient.put(`/api/market-items/${id}`, payload);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحديث المنتج") };
  }
}

export async function deleteMarketItem(id) {
  try {
    await apiClient.delete(`/api/market-items/${id}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل حذف المنتج") };
  }
}
