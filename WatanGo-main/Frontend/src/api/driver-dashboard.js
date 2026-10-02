import { apiClient } from "./client";

function extractError(error, fallback) {
  const data = error.response?.data;
  return data?.message ?? data?.Message ?? data?.errors?.[0] ?? fallback;
}

// ─── Stats (home-page cards) ──────────────────────────────────────────────────

/** GET /api/driver/stats → DriverStatsDto */
export async function getDriverStats() {
  try {
    const { data } = await apiClient.get("/api/driver/stats");
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل إحصائيات السائق") };
  }
}

// ─── Pending orders (home-page list) ─────────────────────────────────────────

/** GET /api/driver/pending-orders → PendingRideDto[] */
export async function getDriverPendingOrders() {
  try {
    const { data } = await apiClient.get("/api/driver/pending-orders");
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل الطلبات المعلقة") };
  }
}

// ─── Driver's own rides (orders tab) ─────────────────────────────────────────

/**
 * GET /api/driver/my-rides
 * @param {{ status?: string, page?: number, pageSize?: number }} options
 */
export async function getDriverMyRides({ status, page = 1, pageSize = 50 } = {}) {
  try {
    const params = { page, pageSize };
    if (status) params.status = status;
    const { data } = await apiClient.get("/api/driver/my-rides", { params });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل رحلاتي") };
  }
}

// ─── Ride actions ─────────────────────────────────────────────────────────────

/**
 * PUT /api/ride-orders/{id}/assign
 * Driver assigns themselves to a pending ride.
 */
export async function acceptDriverRide(rideId) {
  try {
    await apiClient.put(`/api/ride-orders/${rideId}/assign`);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل قبول الرحلة") };
  }
}

/**
 * PUT /api/ride-orders/{id}/complete
 * Driver marks their assigned ride as completed.
 */
export async function completeDriverRide(rideId) {
  try {
    await apiClient.put(`/api/ride-orders/${rideId}/complete`);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل إكمال الرحلة") };
  }
}

// NOTE: reject and complete ride have no backend endpoint yet.
// They are handled locally in the frontend hooks.

// ─── Shop / restaurant orders (الطلبات tab) ──────────────────────────────────

/**
 * GET /api/orders/available
 * Returns Pending orders with no driver assigned — for browsing.
 */
export async function getAvailableOrders() {
  try {
    const { data } = await apiClient.get("/api/orders/available");
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل الطلبات المتاحة") };
  }
}

/**
 * GET /api/orders/my-deliveries
 * Returns orders currently assigned to this driver.
 * @param {{ status?: string, page?: number, pageSize?: number }} options
 */
export async function getMyDeliveries({ status, page = 1, pageSize = 20 } = {}) {
  try {
    const params = { page, pageSize };
    if (status) params.status = status;
    const { data } = await apiClient.get("/api/orders/my-deliveries", { params });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل طلبات التوصيل") };
  }
}

/**
 * PUT /api/orders/{id}/accept-delivery
 * Driver accepts a shop/restaurant order for delivery.
 */
export async function acceptOrder(orderId) {
  try {
    const { data } = await apiClient.put(`/api/orders/${orderId}/accept-delivery`);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل قبول الطلب") };
  }
}

/**
 * PUT /api/orders/{id}/status
 * Driver updates the delivery status of their assigned order.
 * @param {number} orderId
 * @param {string} status  — OrderStatus enum value (e.g. "OnTheWay", "Completed")
 */
export async function updateDeliveryStatus(orderId, status) {
  try {
    const { data } = await apiClient.put(`/api/orders/${orderId}/status`, { status });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحديث حالة الطلب") };
  }
}

// ─── Earnings ─────────────────────────────────────────────────────────────────

/**
 * GET /api/earnings/my
 * Returns the driver's earnings summary and full history (orders + rides).
 */
export async function getDriverEarnings() {
  try {
    const { data } = await apiClient.get("/api/earnings/my");
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: extractError(error, "فشل تحميل سجل الأرباح") };
  }
}
