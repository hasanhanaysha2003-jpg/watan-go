import { useEffect } from "react";
import { useActiveTracking } from "@/lib/active-tracking";

export function useOrderTracking(orderId, _role, enabled = true) {
  const ctx = useActiveTracking();

  useEffect(() => {
    if (enabled && orderId) {
      ctx.registerOrder(orderId);
    }
  }, [enabled, orderId, ctx.registerOrder]);

  return {
    driverPos: ctx.orderDriverPos,
    userPos: ctx.orderUserPos,
    connectionStatus: ctx.orderConnectionStatus,
    geoError: ctx.orderGeoError,
  };
}
