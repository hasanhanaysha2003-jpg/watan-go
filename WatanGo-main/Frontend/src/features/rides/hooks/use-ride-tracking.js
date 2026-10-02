import { useEffect } from "react";
import { useActiveTracking } from "@/lib/active-tracking";

export function useRideTracking(rideOrderId, _role, enabled = true) {
  const ctx = useActiveTracking();

  useEffect(() => {
    if (enabled && rideOrderId) {
      ctx.registerRide(rideOrderId);
    }
  }, [enabled, rideOrderId, ctx.registerRide]);

  return {
    driverPos: ctx.rideDriverPos,
    userPos: ctx.rideUserPos,
    connectionStatus: ctx.rideConnectionStatus,
    geoError: ctx.rideGeoError,
  };
}
