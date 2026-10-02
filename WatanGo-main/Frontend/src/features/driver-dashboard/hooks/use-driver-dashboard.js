import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getOrders, subscribeToOrders } from "@/lib/commerce";
import {
  advanceOrderDeliveryStage,
  getOrderDeliveryStage,
  isFinalDeliveryStage,
  setOrderDeliveryStage,
} from "@/lib/delivery-flow";
import { getDriverStats } from "@/api/driver-dashboard";
import { getDriverStatus, subscribeToDriverStatus, updateDriverAvailabilityStatus } from "../lib/driver-status";
import { useDriverOrders } from "./use-driver-orders";
import { useDriverEarnings } from "./use-driver-earnings";
import { mockActivity } from "../data/mock-data";

// ── Helpers ────────────────────────────────────────────────────────────────────

function isActiveDriverCommerceOrder(order, driverPhone) {
  return (
    order.driverPhone === driverPhone &&
    order.driverStatus !== "pending" &&
    order.driverStatus !== "completed" &&
    order.driverStatus !== "delivered" &&
    order.status !== "delivered" &&
    order.status !== "cancelled"
  );
}

function commerceOrderToTracking(order) {
  return {
    id: order.id,
    kind: order.type === "food" ? "food" : "shop",
    customerName: order.deliveryAddress,
    pickup: order.vendorName,
    pickupCoords: null,
    destination: order.deliveryAddress,
    destinationCoords: null,
    price: order.total,
  };
}


function createTodayWorkSession() {
  const start = new Date();
  start.setHours(8, 0, 0, 0);
  const breakStart = new Date(start);
  breakStart.setHours(10, 0, 0, 0);
  return {
    startedAt: start.toISOString(),
    breaks: [{ id: "morning-break", startedAt: breakStart.toISOString(), minutes: 25 }],
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

const STATS_POLL_MS = 60_000;  // re-fetch stats every 60 s

export function useDriverDashboard({ user, rideOrdersData }) {
  const { rideOrders, activeRide, completedRides, isLoading, acceptRide, rejectRide, completeRide } = rideOrdersData;
  const navigate = useNavigate();

  // ── Shop / restaurant orders (الطلبات tab) ────────────────────────────────
  const {
    orders: shopOrders,
    handleAccept: handleAcceptShopOrder,
    handleReject: handleRejectShopOrder,
    handleStart: handleStartShopOrder,
    handleComplete: handleCompleteShopOrder,
    handleAdvanceStage: handleAdvanceOrderStage,
  } = useDriverOrders();

  // ── UI state ────────────────────────────────────────────────────────────
  const [driverStatus, setDriverStatus] = useState(() => getDriverStatus(user.phone));
  const [allDeliveryOrders, setAllDeliveryOrders] = useState(() => getOrders());
  const [workSession] = useState(() => createTodayWorkSession());
  const [activeTracking, setActiveTracking] = useState(null);
  const [lastDriverCoords, setLastDriverCoords] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ── Backend data ─────────────────────────────────────────────────────────
  const [backendStats, setBackendStats] = useState(null);

  // Earnings — single source of truth shared with DriverEarningsPage
  const { earnings } = useDriverEarnings();

  // Stat cards (ride count) — poll every 60 s
  useEffect(() => {
    let alive = true;
    const fetch = async () => {
      const result = await getDriverStats();
      if (alive && result.ok) setBackendStats(result.data);
    };
    fetch();
    const timer = window.setInterval(fetch, STATS_POLL_MS);
    return () => { alive = false; window.clearInterval(timer); };
  }, []);

  // ── Commerce orders (real-time, existing logic kept intact) ──────────────
  useEffect(() => {
    const load = () => {
      const nextOrders = getOrders();
      setAllDeliveryOrders(nextOrders);

      const restoredActiveOrder = nextOrders.find((order) =>
        isActiveDriverCommerceOrder(order, user.phone),
      );
      setActiveTracking((current) => {
        if (current?.kind === "ride") return current;
        if (!restoredActiveOrder)
          return current && nextOrders.some((order) => order.id === current.id) ? null : current;
        if (current?.id === restoredActiveOrder.id) return current;
        return commerceOrderToTracking(restoredActiveOrder);
      });
      if (restoredActiveOrder) navigate("/dashboard/driver/delivery");
    };
    load();
    return subscribeToOrders(load);
  }, [user.phone]);

  useEffect(() => {
    const load = () => setDriverStatus(getDriverStatus(user.phone));
    load();
    return subscribeToDriverStatus(load);
  }, [user.phone]);

  // ── Derived values ────────────────────────────────────────────────────────

  const driverStats = useMemo(() => ({
    todayTripsCount: backendStats?.todayRidesCount ?? 0,
    hasActiveRide: activeTracking !== null,
    todayNetEarnings: earnings?.todayTotal ?? 0,
    activeWorkingHours: 0,
    breakMinutes: 25,
  }), [backendStats, activeTracking, earnings]);

  const dailyEarnings = useMemo(() => ({
    totalEarnings: earnings?.todayTotal ?? 0,
    completedCount: earnings?.todayCompletedCount ?? 0,
    items: [],
  }), [earnings]);

  const activeOrder = useMemo(() => shopOrders.find((o) => o.status === "active"), [shopOrders]);

  const activeCommerceOrder = useMemo(
    () => allDeliveryOrders.find((order) => order.id === activeTracking?.id) ?? null,
    [activeTracking?.id, allDeliveryOrders],
  );

  const activeDeliveryStage = activeCommerceOrder
    ? getOrderDeliveryStage(activeCommerceOrder)
    : null;

  // ── Order management ─────────────────────────────────────────────────────

  const openOrder = (order) => {
    setSelectedOrder(order);
    setDrawer("order");
  };

  // ── Driver status ─────────────────────────────────────────────────────────

  const handleDriverStatusChange = (status) => {
    setDriverStatus(status);
    updateDriverAvailabilityStatus(user.phone, status);
  };

  // ── Ride handlers (ride-orders from RideOrderController) ─────────────────

  const handleAcceptRide = async (id) => {
    if (driverStatus === "busy") { toast.error("أنت مشغول حالياً ولا تستطيع قبول الرحلة."); return; }
    if (driverStatus === "offline") { toast.error("أنت غير متصل ولا تستطيع قبول الرحلة."); return; }

    const ride = rideOrders.find((r) => r.id === id);
    const ok = await acceptRide(id);
    if (!ok || !ride) return;

    toast.success("تم قبول الرحلة بنجاح.");
    setActiveTracking({
      id: ride.id,
      kind: "ride",
      customerName: ride.user.name,
      pickup: ride.pickup,
      pickupCoords: ride.pickupCoords ?? null,
      destination: ride.destination,
      destinationCoords: ride.destinationCoords ?? null,
      price: ride.price,
    });
    navigate("/dashboard/driver/delivery");
  };

  const handleRejectRide = async (id) => {
    const ok = await rejectRide(id);
    if (ok) toast.success("تم رفض الرحلة");
  };

  const handleCompleteRide = async (id) => {
    const ok = await completeRide(id);
    if (!ok) return;
    toast.success("تمت الرحلة بنجاح");
    if (activeTracking?.id === id) setActiveTracking(null);
  };

  const handleCompleteTracking = async () => {
    if (activeTracking) {
      if (activeTracking.kind === "ride") {
        const ok = await completeRide(activeTracking.id);
        if (!ok) return;
      } else {
        setOrderDeliveryStage(activeTracking.id, "completed");
      }
    }
    setActiveTracking(null);
    toast.success("تم إنهاء التوصيل بنجاح");
  };

  const handleAdvanceDeliveryStage = () => {
    if (!activeCommerceOrder) return;
    const updatedOrder = advanceOrderDeliveryStage(activeCommerceOrder.id);
    if (!updatedOrder) return;

    const nextStage = getOrderDeliveryStage(updatedOrder);
    if (isFinalDeliveryStage(nextStage)) {
      setActiveTracking(null);
      toast.success("تم إنهاء التوصيل بنجاح");
      return;
    }
    toast.success("تم تحديث مرحلة التوصيل");
  };

  return {
    driverStatus,
    driverStats,
    dailyEarnings,
    isLoading,
    rideOrders,
    activeRide,
    completedRides,
    orders: shopOrders,
    activeOrder,
    activeTracking, activeDeliveryStage, lastDriverCoords, setLastDriverCoords,
    workSession,
    drawer, setDrawer,
    selectedOrder,
    mockActivity,
    handleDriverStatusChange,
    handleAcceptRide, handleRejectRide, handleCompleteRide,
    // Shop/restaurant order handlers (الطلبات tab)
    handleAcceptShopOrder,
    handleRejectShopOrder,
    handleStartShopOrder,
    handleCompleteShopOrder,
    handleAdvanceOrderStage,
    handleCompleteTracking,
    handleAdvanceDeliveryStage,
    openOrder,
  };
}
