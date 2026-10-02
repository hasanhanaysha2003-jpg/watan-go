import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getRestaurantOrders, updateRestaurantOrderStatus } from "@/api/restaurant-orders";
import { useSelectedRestaurant } from "../context/SelectedRestaurantContext";

const POLL_INTERVAL_MS = 30_000;

export function useRestaurantOrders() {
  const { selectedId } = useSelectedRestaurant();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const timerRef = useRef(null);

  const fetchOrders = useCallback(
    async ({ silent = false } = {}) => {
      if (!selectedId) return;
      if (!silent) setLoading(true);
      const result = await getRestaurantOrders(selectedId);
      if (!silent) setLoading(false);

      if (!result.ok) {
        setError(result.message);
        return;
      }
      setError(null);
      setOrders(result.data);
    },
    [selectedId],
  );

  const refresh = useCallback(() => fetchOrders({ silent: false }), [fetchOrders]);

  // Re-fetch whenever the selected restaurant changes + start/restart polling
  useEffect(() => {
    clearInterval(timerRef.current);
    setOrders([]); // clear stale data while loading
    fetchOrders();

    timerRef.current = setInterval(() => fetchOrders({ silent: true }), POLL_INTERVAL_MS);

    return () => clearInterval(timerRef.current);
  }, [fetchOrders]);

  const changeStatus = async (id, status, successMsg) => {
    setActionLoadingId(id);
    const result = await updateRestaurantOrderStatus(id, status, selectedId);
    setActionLoadingId(null);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(successMsg);
    await fetchOrders({ silent: true });
  };

  const acceptOrder    = (id) => changeStatus(id, "Accepted",       "تم قبول الطلب ونقله إلى التحضير");
  const rejectOrder    = (id) => changeStatus(id, "Cancelled",      "تم رفض الطلب");
  const startPreparing = (id) => changeStatus(id, "Preparing",      "بدأ تحضير الطلب");
  const markReady      = (id) => changeStatus(id, "ReadyForPickup", "الطلب جاهز — بانتظار السائق");

  return {
    loading,
    error,
    actionLoadingId,
    refresh,
    newOrders:       orders.filter((o) => o.status === "pending"),
    preparingOrders: orders.filter((o) => o.status === "accepted" || o.status === "preparing"),
    readyOrders:     orders.filter((o) => o.status === "ready_for_pickup"),
    rejectedOrders:  orders.filter((o) => o.status === "cancelled"),
    completedOrders: orders.filter((o) =>
      ["picked_up", "on_the_way", "completed"].includes(o.status),
    ),
    acceptOrder,
    rejectOrder,
    startPreparing,
    markReady,
  };
}
