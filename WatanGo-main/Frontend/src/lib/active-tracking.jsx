import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as signalR from "@microsoft/signalr";
import { TOKEN_STORAGE_KEY, baseURL, apiClient } from "@/api/client";
import { useAuth } from "@/lib/auth";

const POLL_MS = 30_000;
const MIN_MOVE_M = 5;
const MIN_INTERVAL_MS = 3_000;

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6_371_000;
  const φ = (d) => (d * Math.PI) / 180;
  const dLat = φ(lat2 - lat1);
  const dLng = φ(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(φ(lat1)) * Math.cos(φ(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalizeList(d) {
  if (!d) return [];
  return Array.isArray(d) ? d : (d.items ?? d.data ?? []);
}

// ── Single hub manager ───────────────────────────────────────
function useHubManager({ hubPath, joinEvent, sendEvent, entityId, role }) {
  const [driverPos, setDriverPos] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [status, setStatus] = useState("disconnected");
  const [geoError, setGeoError] = useState(null);

  const hubRef = useRef(null);
  const watchRef = useRef(null);
  const lastRef = useRef({ lat: null, lng: null, ts: 0 });
  const entityIdRef = useRef(entityId);
  const roleRef = useRef(role);
  entityIdRef.current = entityId;
  roleRef.current = role;

  useEffect(() => {
    if (!entityId || !role) return;

    setDriverPos(null);
    setUserPos(null);
    lastRef.current = { lat: null, lng: null, ts: 0 };

    const hub = new signalR.HubConnectionBuilder()
      .withUrl(`${baseURL}${hubPath}`, {
        accessTokenFactory: () => localStorage.getItem(TOKEN_STORAGE_KEY) ?? "",
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    hubRef.current = hub;
    let cancelled = false;

    function stopGeo() {
      if (watchRef.current != null) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
    }

    function startGeo() {
      if (!navigator.geolocation) {
        setGeoError("المتصفح لا يدعم تحديد الموقع");
        return;
      }
      watchRef.current = navigator.geolocation.watchPosition(
        (p) => {
          setGeoError(null);
          const h = hubRef.current;
          if (!h || h.state !== signalR.HubConnectionState.Connected) return;
          const lat = p.coords.latitude;
          const lng = p.coords.longitude;
          const last = lastRef.current;
          const now = Date.now();
          if (now - last.ts < MIN_INTERVAL_MS) return;
          if (last.lat !== null && haversine(last.lat, last.lng, lat, lng) < MIN_MOVE_M) return;
          lastRef.current = { lat, lng, ts: now };
          h.invoke(sendEvent, Number(entityIdRef.current), roleRef.current, lat, lng).catch(() => {
            lastRef.current = { ...lastRef.current, ts: 0 };
          });
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED)
            setGeoError("تم رفض إذن الموقع. يُرجى السماح بالوصول في إعدادات المتصفح.");
          else if (err.code === err.TIMEOUT)
            setGeoError("انتهت مهلة تحديد الموقع. سيتم المحاولة مجدداً.");
          else setGeoError("تعذّر تحديد الموقع.");
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
      );
    }

    hub.on("LocationUpdated", (upd) => {
      const pos = { lat: upd.lat, lng: upd.lng, updatedAt: upd.updatedAtUtc };
      if (upd.role === "driver") setDriverPos(pos);
      else setUserPos(pos);
    });

    hub.onreconnecting(() => setStatus("connecting"));
    hub.onreconnected(async () => {
      setStatus("connected");
      try { await hub.invoke(joinEvent, Number(entityIdRef.current)); } catch {}
    });
    hub.onclose(() => { setStatus("disconnected"); stopGeo(); });

    setStatus("connecting");
    hub.start()
      .then(async () => {
        if (cancelled) return;
        await hub.invoke(joinEvent, Number(entityId));
        if (cancelled) return;
        setStatus("connected");
        startGeo();
      })
      .catch(() => { if (!cancelled) setStatus("error"); });

    return () => {
      cancelled = true;
      stopGeo();
      hub.stop();
      if (hubRef.current === hub) hubRef.current = null;
    };
  }, [entityId, role, hubPath, joinEvent, sendEvent]);

  return { driverPos, userPos, connectionStatus: status, geoError };
}

// ── Context ──────────────────────────────────────────────────
const Ctx = createContext(null);

export function useActiveTracking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useActiveTracking must be inside ActiveTrackingProvider");
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────
export function ActiveTrackingProvider({ children }) {
  const { user } = useAuth();
  const isAuth = Boolean(user);
  const authRole = user?.role?.toLowerCase();
  const trackingRole = authRole === "driver" ? "driver" : "user";

  const [rideId, setRideId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  // ── Background polling: auto-discover active entities ─────
  const poll = useCallback(async () => {
    if (!user) return;
    const r = authRole;
    if (r !== "customer" && r !== "driver") return;

    try {
      let rides = [];
      if (r === "driver") {
        const res = await apiClient.get("/api/driver/my-rides", {
          params: { status: "assigned", pageSize: 5 },
        });
        rides = normalizeList(res.data);
      } else {
        const res = await apiClient.get("/api/ride-orders/my");
        rides = normalizeList(res.data);
      }
      const active = rides.find((ride) => ride.status === "assigned");
      setRideId(active ? Number(active.id) : null);
    } catch {}

    try {
      let orders = [];
      if (r === "driver") {
        const res = await apiClient.get("/api/orders/my-deliveries", { params: { pageSize: 20 } });
        orders = normalizeList(res.data);
      } else {
        const res = await apiClient.get("/api/orders/my");
        orders = normalizeList(res.data);
      }
      const ACTIVE = new Set(["picked_up", "on_the_way"]);
      const active = orders.find((o) => ACTIVE.has(o.status));
      setOrderId(active ? Number(active.id) : null);
    } catch {}
  }, [user, authRole]);

  useEffect(() => {
    if (!isAuth) {
      setRideId(null);
      setOrderId(null);
      return;
    }
    poll();
    const t = setInterval(poll, POLL_MS);
    return () => clearInterval(t);
  }, [isAuth, poll]);

  // ── Hub connections ───────────────────────────────────────
  const rideTracking = useHubManager({
    hubPath: "/hubs/ride-tracking",
    joinEvent: "JoinRide",
    sendEvent: "SendLocationUpdate",
    entityId: rideId,
    role: trackingRole,
  });

  const orderTracking = useHubManager({
    hubPath: "/hubs/order-tracking",
    joinEvent: "JoinOrder",
    sendEvent: "SendOrderLocationUpdate",
    entityId: orderId,
    role: trackingRole,
  });

  // ── Registration: tracking pages call these to connect immediately ──
  const registerRide = useCallback((id) => {
    const n = Number(id);
    setRideId((prev) => (prev === n ? prev : n));
  }, []);

  const registerOrder = useCallback((id) => {
    const n = Number(id);
    setOrderId((prev) => (prev === n ? prev : n));
  }, []);

  const value = {
    activeRideId: rideId,
    rideDriverPos: rideTracking.driverPos,
    rideUserPos: rideTracking.userPos,
    rideConnectionStatus: rideTracking.connectionStatus,
    rideGeoError: rideTracking.geoError,
    registerRide,

    activeOrderId: orderId,
    orderDriverPos: orderTracking.driverPos,
    orderUserPos: orderTracking.userPos,
    orderConnectionStatus: orderTracking.connectionStatus,
    orderGeoError: orderTracking.geoError,
    registerOrder,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
