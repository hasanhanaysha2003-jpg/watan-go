import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  acceptDriverRide,
  completeDriverRide,
  getDriverMyRides,
  getDriverPendingOrders,
} from "@/api/driver-dashboard";

const POLL_INTERVAL_MS = 10_000;

function normalizeRide(dto, status = "pending") {
  return {
    id:          dto.id,
    displayId:   dto.displayId,
    user: { name: dto.customerName },
    pickup:      dto.pickupAddress,
    destination: dto.destinationAddress,
    distanceKm:    dto.distanceKm    ?? null,
    durationLabel: dto.durationLabel ?? null,
    price:         dto.price         ?? null,
    deliveryType:  dto.deliveryType,
    status,
    createdAt: dto.createdAt,
  };
}

export function useDriverRideOrders() {
  const [allRideOrders,  setAllRideOrders]  = useState([]);
  const [activeRide,     setActiveRide]     = useState(null);
  const [completedRides, setCompletedRides] = useState([]);
  const [isLoading,      setIsLoading]      = useState(true);

  // ── Fetch pending (available) rides ─────────────────────────────────────
  const fetchPending = useCallback(async () => {
    const result = await getDriverPendingOrders();
    if (result.ok) setAllRideOrders((result.data ?? []).map((dto) => normalizeRide(dto)));
    setIsLoading(false);
  }, []);

  // ── Fetch driver's currently active (assigned) ride ──────────────────────
  const fetchActiveRide = useCallback(async () => {
    const result = await getDriverMyRides({ status: "assigned", pageSize: 1 });
    if (!result.ok) return;
    const items = result.data?.items ?? result.data ?? [];
    setActiveRide(items[0] ? normalizeRide(items[0], "assigned") : null);
  }, []);

  // ── Fetch driver's completed rides ───────────────────────────────────────
  const fetchCompletedRides = useCallback(async () => {
    const result = await getDriverMyRides({ status: "completed", pageSize: 50 });
    if (!result.ok) return;
    const items = result.data?.items ?? result.data ?? [];
    setCompletedRides(items.map((dto) => normalizeRide(dto, "completed")));
  }, []);

  // Poll pending rides every 10 s; fetch active + completed once on mount
  useEffect(() => {
    fetchPending();
    fetchActiveRide();
    fetchCompletedRides();
    const timer = window.setInterval(fetchPending, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [fetchPending, fetchActiveRide, fetchCompletedRides]);

  const rideOrders = allRideOrders;

  // ── Actions ──────────────────────────────────────────────────────────────

  const acceptRide = useCallback(async (id) => {
    const result = await acceptDriverRide(id);
    if (!result.ok) { toast.error(result.message ?? "فشل قبول الرحلة"); return false; }
    setAllRideOrders((cur) => cur.filter((r) => r.id !== id));
    // Fetch the newly assigned ride so activeRide updates immediately
    await fetchActiveRide();
    return true;
  }, [fetchActiveRide]);

  const rejectRide = useCallback(async (id) => {
    setAllRideOrders((cur) => cur.filter((r) => r.id !== id));
    return true;
  }, []);

  const completeRide = useCallback(async (id) => {
    const result = await completeDriverRide(id);
    if (!result.ok) { toast.error(result.message ?? "فشل إكمال الرحلة"); return false; }
    setActiveRide(null);
    await fetchCompletedRides();
    return true;
  }, [fetchCompletedRides]);

  return {
    rideOrders,
    activeRide,
    completedRides,
    allRideOrders,
    isLoading,
    acceptRide,
    rejectRide,
    completeRide,
    refresh: fetchPending,
  };
}
