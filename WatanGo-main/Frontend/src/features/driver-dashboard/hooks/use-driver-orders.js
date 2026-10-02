import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  acceptOrder,
  getAvailableOrders,
  getMyDeliveries,
  updateDeliveryStatus,
} from "@/api/driver-dashboard";

const POLL_INTERVAL_MS = 10_000; // re-fetch available orders every 10 s

// ── Status mapping ────────────────────────────────────────────────────────────

/**
 * Maps backend OrderStatus enum values (snake_case from DB) to the four
 * statuses that OrdersSection understands.
 *
 * Backend enum stored as snake_case strings:
 *   pending, accepted, preparing, ready_for_pickup, picked_up,
 *   on_the_way, completed, cancelled
 */
function mapOrderStatus(backendStatus) {
  if (!backendStatus) return "new";
  const s = String(backendStatus).toLowerCase().replace(/_/g, "");
  if (s === "pending")                                        return "new";
  if (["accepted","preparing","readyforpickup","pickedup","ontheway"].includes(s)) return "active";
  if (s === "completed")                                      return "completed";
  if (s === "cancelled")                                      return "cancelled";
  return "new";
}

// ── Normalisation ─────────────────────────────────────────────────────────────

function pickupLabel(items) {
  if (!items?.length) return "مطعم / متجر";
  const restaurantItem = items.find((i) => i.restaurantName);
  if (restaurantItem) return restaurantItem.restaurantName;
  return "متجر";
}

function parseUtc(str) {
  if (!str) return new Date(NaN);
  const s = String(str);
  return new Date(/Z$|[+-]\d{2}:?\d{2}$/.test(s) ? s : s + "Z");
}

function buildTimeline(status, createdAt) {
  const orderTime = parseUtc(createdAt).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });
  const stages = [
    { label: "تم إنشاء الطلب",       status: "pending"          },
    { label: "تم قبول الطلب",         status: "accepted"         },
    { label: "قيد التحضير",           status: "preparing"        },
    { label: "جاهز للاستلام",         status: "ready_for_pickup" },
    { label: "تم الاستلام من المطعم",  status: "picked_up"        },
    { label: "في الطريق",             status: "on_the_way"       },
    { label: "تم التسليم",            status: "completed"        },
  ];

  const normalised = String(status ?? "").toLowerCase();
  let reachedCurrent = false;
  return stages.map((s) => {
    const isCurrent = s.status === normalised;
    const done = !reachedCurrent && !isCurrent;
    if (isCurrent) reachedCurrent = true;
    return { label: s.label, time: isCurrent ? orderTime : (done ? orderTime : "—"), done: done || isCurrent };
  });
}

// ── Status advancement ───────────────────────────────────────────────────────

function normalizeStatusKey(raw) {
  return String(raw ?? "").toLowerCase().replace(/[_\s]/g, "");
}

// Two-step delivery flow so the order passes through a live-tracking status:
//   ready_for_pickup → (تم الاستلام) → picked_up → (تم التسليم) → completed
// The map is only active while the order is picked_up / on_the_way, so this
// intermediate step is what makes the live tracking usable.
const ADVANCEMENT_MAP = {
  readyforpickup: "PickedUp",
  pickedup:       "Completed",
  ontheway:       "Completed",
};

function getNextStatus(rawStatus) {
  return ADVANCEMENT_MAP[normalizeStatusKey(rawStatus)] ?? null;
}

/**
 * Normalise a backend OrderDto to the shape expected by OrdersSection.
 * The `source` field is added so we know where each order came from.
 */
function normalizeOrder(dto, source = "available") {
  const createdDate = parseUtc(dto.createdAt);
  const orderTime = createdDate.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });

  return {
    id:           `WG-${dto.id}`,
    _rawId:       dto.id,
    _rawStatus:   dto.status ?? "",  // raw backend status for stage tracking
    _source:      source,           // "available" | "mine"

    customerName:  dto.customerName,
    customerPhone: dto.customerPhone ?? "",

    // pickup = restaurant/shop name; delivery = customer name (no address yet)
    pickupLocation:   pickupLabel(dto.items),
    deliveryLocation: dto.customerName,

    distance:  0,   // not returned by order endpoint yet
    duration:  0,
    price:     dto.totalPrice ?? 0,
    orderTime,
    estimatedDeliveryTime: "—",

    // Available (unclaimed) orders always show as "new" so the accept/reject
    // buttons appear. My own deliveries use the real backend status.
    status: source === "available" ? "new" : mapOrderStatus(dto.status),


    paymentMethod: "cash",   // not tracked yet
    notes:  dto.notes ?? null,

    timeline: buildTimeline(dto.status, dto.createdAt),

    // Preserve raw items for possible future use
    items: dto.items ?? [],
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDriverOrders() {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myDeliveries,    setMyDeliveries]    = useState([]);
  const [isLoading,       setIsLoading]       = useState(true);

  // ── Fetch helpers ──────────────────────────────────────────────────────────

  const fetchAvailable = useCallback(async () => {
    const result = await getAvailableOrders();
    if (result.ok) {
      setAvailableOrders((result.data ?? []).map((dto) => normalizeOrder(dto, "available")));
    }
    setIsLoading(false);
  }, []);

  const fetchMyDeliveries = useCallback(async () => {
    const result = await getMyDeliveries({ pageSize: 50 });
    if (result.ok) {
      const items = result.data?.items ?? result.data ?? [];
      setMyDeliveries(items.map((dto) => normalizeOrder(dto, "mine")));
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchAvailable(), fetchMyDeliveries()]);
  }, [fetchAvailable, fetchMyDeliveries]);

  // ── Polling — available orders every 10 s ──────────────────────────────────

  useEffect(() => {
    fetchAvailable();
    const timer = window.setInterval(fetchAvailable, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [fetchAvailable]);

  // ── My deliveries — fetch once on mount ───────────────────────────────────

  useEffect(() => { fetchMyDeliveries(); }, [fetchMyDeliveries]);

  // ── Combined list ─────────────────────────────────────────────────────────
  // available orders show as "new"; driver's own orders keep their status

  const orders = [
    ...availableOrders,
    // exclude any order that's also in available (shouldn't happen, but be safe)
    ...myDeliveries.filter((d) => !availableOrders.some((a) => a._rawId === d._rawId)),
  ];

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Driver accepts an available order — moves it from "new" to their own */
  const handleAccept = useCallback(async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    const rawId = order?._rawId ?? orderId;

    const result = await acceptOrder(rawId);
    if (!result.ok) {
      toast.error(result.message ?? "فشل قبول الطلب");
      return false;
    }

    // Optimistically move from available → active in my deliveries
    setAvailableOrders((cur) => cur.filter((o) => o._rawId !== rawId));
    setMyDeliveries((cur) => [
      {
        ...order,
        status: "active",
        _rawStatus: "ready_for_pickup", // backend keeps ReadyForPickup until driver clicks تم الاستلام
        _source: "mine",
      },
      ...cur.filter((o) => o._rawId !== rawId),
    ]);
    toast.success("تم قبول الطلب بنجاح");
    // Refresh to get real server state
    setTimeout(fetchMyDeliveries, 800);
    return true;
  }, [orders, fetchMyDeliveries]);

  /** Dismiss an available order locally (no backend endpoint yet) */
  const handleReject = useCallback((orderId) => {
    const order = orders.find((o) => o.id === orderId);
    const rawId = order?._rawId ?? orderId;
    setAvailableOrders((cur) => cur.filter((o) => o._rawId !== rawId));
  }, [orders]);

  /** Driver marks order as OnTheWay */
  const handleStart = useCallback(async (orderId) => {
    const order = myDeliveries.find((o) => o.id === orderId);
    const rawId = order?._rawId ?? orderId;

    const result = await updateDeliveryStatus(rawId, "OnTheWay");
    if (!result.ok) { toast.error(result.message ?? "فشل تحديث الحالة"); return; }

    setMyDeliveries((cur) => cur.map((o) => o._rawId === rawId ? { ...o, status: "active" } : o));
    toast.success("بدأت رحلة التوصيل");
  }, [myDeliveries]);

  /** Driver marks order as Completed */
  const handleComplete = useCallback(async (orderId) => {
    const order = myDeliveries.find((o) => o.id === orderId);
    const rawId = order?._rawId ?? orderId;

    const result = await updateDeliveryStatus(rawId, "Completed");
    if (!result.ok) { toast.error(result.message ?? "فشل إكمال الطلب"); return; }

    setMyDeliveries((cur) => cur.map((o) => o._rawId === rawId ? { ...o, status: "completed" } : o));
    toast.success("تم إكمال الطلب بنجاح");
  }, [myDeliveries]);

  /** Advance the delivery to the next logical status (step-by-step) */
  const handleAdvanceStage = useCallback(async (orderId) => {
    const order = myDeliveries.find((o) => o.id === orderId);
    if (!order) return;
    const nextStatus = getNextStatus(order._rawStatus);
    if (!nextStatus) return;

    const result = await updateDeliveryStatus(order._rawId, nextStatus);
    if (!result.ok) { toast.error(result.message ?? "فشل تحديث الحالة"); return; }

    toast.success("تم تحديث حالة الطلب");
    await fetchMyDeliveries();
  }, [myDeliveries, fetchMyDeliveries]);

  return {
    orders,
    isLoading,
    refresh,
    handleAccept,
    handleReject,
    handleStart,
    handleComplete,
    handleAdvanceStage,
  };
}
