/**
 * admin-orders.js
 * API calls for the Admin → Orders section.
 * Backend endpoints live under /api/orders (Admin-only, JWT required).
 */
import { apiClient } from "./client";

// ── Status helpers ─────────────────────────────────────────────────────────────

/** Maps backend OrderStatus enum values to Arabic labels */
export const ORDER_STATUS_LABELS = {
  pending:          "قيد الانتظار",
  accepted:         "مقبول",
  preparing:        "قيد التحضير",
  ready_for_pickup: "جاهز للاستلام",
  picked_up:        "تم الاستلام",
  on_the_way:       "في الطريق",
  completed:        "مكتمل",
  cancelled:        "ملغي",
};

/** MUI Chip color per status */
export const ORDER_STATUS_COLOR = {
  pending:          "warning",
  accepted:         "info",
  preparing:        "info",
  ready_for_pickup: "primary",
  picked_up:        "primary",
  on_the_way:       "success",
  completed:        "success",
  cancelled:        "error",
};


/** Statuses the admin can assign manually */
export const ADMIN_ASSIGNABLE_STATUSES = [
  "pending",
  "accepted",
  "preparing",
  "ready_for_pickup",
  "picked_up",
  "on_the_way",
  "completed",
  "cancelled",
];

// ── Normalizers ────────────────────────────────────────────────────────────────

/**
 * The backend serialises OrderStatus enum with snake_case_lower JSON policy.
 * e.g. ReadyForPickup → "ready_for_pickup"
 */
function normalizeOrder(raw) {
  return {
    id:           raw.id,
    totalPrice:   raw.totalPrice,
    status:       raw.status,           // already snake_case from backend
    notes:        raw.notes ?? null,
    createdAt:    raw.createdAt,
    customerName: raw.customerName,
    customerPhone: raw.customerPhone ?? null,
    driverName:   raw.driverName ?? null,
    items:        Array.isArray(raw.items)
      ? raw.items.map((i) => ({
          id:             i.id,
          itemName:       i.itemName,
          quantity:       i.quantity,
          unitPrice:      i.unitPrice,
          deliveryFee:    i.deliveryFee,
          itemType:       i.itemType,
          restaurantName: i.restaurantName ?? null,
          lineTotal:      i.lineTotal,
        }))
      : [],
    restaurantParts: Array.isArray(raw.restaurantParts)
      ? raw.restaurantParts.map((p) => ({
          id:             p.id,
          restaurantId:   p.restaurantId,
          restaurantName: p.restaurantName,
          status:         p.status,
        }))
      : [],
  };
}

// ── Error extraction ───────────────────────────────────────────────────────────

function extractError(error, fallback) {
  const data = error.response?.data;
  if (!data) return fallback;
  const errors = data.errors;
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    const first = Object.values(errors).flat().find(Boolean);
    if (first) return first;
  }
  if (Array.isArray(errors) && errors.length > 0) return errors[0];
  return data.message ?? data.Message ?? data.title ?? fallback;
}

// ── API calls ──────────────────────────────────────────────────────────────────

/**
 * GET /api/orders?status=...
 * Admin-only — returns all orders, optionally filtered by status.
 */
export async function getAllOrders(status = null) {
  try {
    const params = status ? { status } : {};
    const { data } = await apiClient.get("/api/orders", { params });
    return { ok: true, orders: data.map(normalizeOrder) };
  } catch (error) {
    return { ok: false, message: extractError(error, "تعذّر جلب قائمة الطلبات") };
  }
}

/**
 * GET /api/orders/{id}
 * Returns a single order (Admin can see any order).
 */
export async function getOrderById(id) {
  try {
    const { data } = await apiClient.get(`/api/orders/${id}`);
    return { ok: true, order: normalizeOrder(data) };
  } catch (error) {
    return { ok: false, message: extractError(error, "تعذّر جلب تفاصيل الطلب") };
  }
}

/**
 * PUT /api/orders/{id}/status
 * Admin or Driver — updates order status.
 * @param {number} id
 * @param {string} status  snake_case value e.g. "on_the_way"
 */
export async function updateOrderStatus(id, status) {
  try {
    // Backend expects PascalCase enum string — convert from snake_case
    const pascalStatus = status
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");

    await apiClient.put(`/api/orders/${id}/status`, { status: pascalStatus });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "تعذّر تحديث حالة الطلب") };
  }
}
