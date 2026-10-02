import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useAuth } from "@/lib/auth";
import { getOrderById, getOrderLocationSnapshot } from "@/api/orders";
import { useOrderTracking } from "../hooks/use-order-tracking";
import { fetchRouteWithDetails, distanceMetres } from "@/lib/routing";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const driverIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;border-radius:50%;
    background:linear-gradient(135deg,#1976d2,#42a5f5);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 14px rgba(25,118,210,0.45);
    border:3px solid #fff;
  ">
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='18' height='18'>
      <path d='M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

const userIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:linear-gradient(135deg,#ed6c02,#ff9800);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 12px rgba(237,108,2,0.4);
    border:3px solid #fff;
  ">
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='16' height='16'>
      <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

const STATUS_LABELS = {
  pending:          "قيد الانتظار",
  accepted:         "تم القبول",
  preparing:        "قيد التحضير",
  ready_for_pickup: "جاهز للاستلام",
  picked_up:        "تم الاستلام — جارٍ التوصيل",
  on_the_way:       "السائق في الطريق",
  completed:        "مكتمل",
  cancelled:        "ملغي",
};

function connectionLabel(status) {
  return (
    { connected: "متصل", connecting: "جارٍ الاتصال...", disconnected: "غير متصل", error: "خطأ في الاتصال" }[status] ?? status
  );
}

function parseUtc(str) {
  if (!str) return new Date(NaN);
  const s = String(str);
  return new Date(/Z$|[+-]\d{2}:?\d{2}$/.test(s) ? s : s + "Z");
}

function formatTime(iso) {
  if (!iso) return "—";
  return parseUtc(iso).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function deriveOrderLabel(order) {
  if (!order) return "طلب";
  const restaurantItem = order.items?.find((i) => i.itemType === "restaurant");
  return restaurantItem?.restaurantName ? `مطعم ${restaurantItem.restaurantName}` : "طلب تسوق";
}

function formatEta(secs) {
  if (secs == null) return null;
  const mins = Math.round(secs / 60);
  if (mins < 1) return "أقل من دقيقة";
  if (mins < 60) return `${mins} دقيقة`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} ساعة ${m} دقيقة` : `${h} ساعة`;
}

// ── Map component ────────────────────────────────────────────
function TrackingMap({ order, driverPos, userPos, onEtaUpdate }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const navPolylineRef = useRef(null);   // driver pos → customer pos (live GPS route)
  const lastNavPosRef = useRef(null);    // driverPos at last nav-route fetch
  const navTimerRef = useRef(null);      // debounce timer
  const userPosRef = useRef(userPos);    // always-current userPos for async callbacks

  // Keep userPosRef in sync without triggering other effects
  useEffect(() => { userPosRef.current = userPos; }, [userPos]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    mapInstanceRef.current = map;

    // Default view — Palestine centre
    map.setView([31.9, 35.2], 13);

    return () => {
      clearTimeout(navTimerRef.current);
      map.remove();
      mapInstanceRef.current = null;
      navPolylineRef.current = null;
      lastNavPosRef.current = null;
    };
  }, [order]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !driverPos) return;
    const latlng = [driverPos.lat, driverPos.lng];
    if (!driverMarkerRef.current) {
      driverMarkerRef.current = L.marker(latlng, { icon: driverIcon })
        .addTo(map)
        .bindPopup(`<b>السائق</b><br/>${order?.driverName ?? "سائق وطن جو"}`);
    } else {
      driverMarkerRef.current.setLatLng(latlng);
    }
    fitBoundsIfBoth(map, driverPos, userPos);
  }, [driverPos, order?.driverName, userPos]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userPos) return;
    const latlng = [userPos.lat, userPos.lng];
    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(latlng, { icon: userIcon })
        .addTo(map)
        .bindPopup("<b>موقعك</b>");
    } else {
      userMarkerRef.current.setLatLng(latlng);
    }
    fitBoundsIfBoth(map, driverPos, userPos);
  }, [userPos, driverPos]);

  // Live navigation route: driver's current position → customer position (real road, debounced)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !driverPos) return;

    // Need a destination — prefer live customer GPS, no route without it
    const dest = userPosRef.current;
    if (!dest) return;

    // Skip fetch if driver hasn't moved more than 100m since last fetch
    if (
      lastNavPosRef.current &&
      distanceMetres(lastNavPosRef.current, driverPos) < 100
    ) return;

    clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(async () => {
      const latestDest = userPosRef.current;
      if (!latestDest || !mapInstanceRef.current) return;

      const { coords, durationSecs } = await fetchRouteWithDetails(
        driverPos.lat, driverPos.lng,
        latestDest.lat, latestDest.lng,
      );
      if (!mapInstanceRef.current) return; // unmounted while awaiting

      lastNavPosRef.current = driverPos;
      if (onEtaUpdate) onEtaUpdate(durationSecs);

      if (navPolylineRef.current) {
        navPolylineRef.current.setLatLngs(coords);
      } else {
        navPolylineRef.current = L.polyline(coords, {
          color: "#4caf50",
          weight: 4.5,
          opacity: 0.9,
        }).addTo(mapInstanceRef.current);
      }
    }, 2000);
  }, [driverPos]);

  function fitBoundsIfBoth(map, dp, up) {
    const pts = [];
    if (dp) pts.push([dp.lat, dp.lng]);
    if (up) pts.push([up.lat, up.lng]);
    if (pts.length === 2) map.fitBounds(L.latLngBounds(pts), { padding: [60, 60], maxZoom: 16 });
    else if (pts.length === 1) map.setView(pts[0], 15);
  }

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}

// ── Styles (inline — mirrors ride-tracking pattern) ──────────
const s = {
  page: {
    minHeight: "100vh",
    bgcolor: "background.default",
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 3, sm: 4 },
    maxWidth: 1100,
    mx: "auto",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
    mb: 3,
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    fontSize: 12,
    fontWeight: 700,
    color: "primary.main",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: { xs: 22, sm: 28 },
    fontWeight: 900,
    lineHeight: 1.2,
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    fontSize: 13,
    fontWeight: 600,
    color: "text.secondary",
    textDecoration: "none",
    "&:hover": { color: "primary.main" },
  },
  content: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 380px" },
    gap: 3,
    alignItems: "start",
  },
  mapCard: {
    borderRadius: 3,
    overflow: "hidden",
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
  },
  mapWrapper: {
    height: { xs: 340, sm: 420, md: 520 },
  },
  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 2,
    py: 1.25,
    borderTop: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    flexWrap: "wrap",
  },
  connectionDot: (status) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    bgcolor: status === "connected" ? "success.main" : status === "connecting" ? "warning.main" : "text.disabled",
    flexShrink: 0,
  }),
  connectionLabel: { fontSize: 12, color: "text.secondary" },
  lastUpdateLabel: { fontSize: 11.5, color: "text.disabled", ml: "auto" },
  sidePanel: { display: "flex", flexDirection: "column", gap: 2 },
  infoCard: {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    p: 2.5,
  },
  infoCardTitle: { fontSize: 14, fontWeight: 800, mb: 1.5 },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.75 },
  infoLabel: { fontSize: 12.5, color: "text.secondary" },
  infoValue: { fontSize: 13, fontWeight: 600, textAlign: "left" },
  statusChip: (status) => ({
    display: "inline-flex",
    alignItems: "center",
    px: 1.25,
    py: 0.3,
    borderRadius: 99,
    fontSize: 11.5,
    fontWeight: 700,
    bgcolor: status === "on_the_way" || status === "picked_up" ? "info.main" : status === "completed" ? "success.main" : "warning.main",
    color: "#fff",
  }),
  centeredBox: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, minHeight: "60vh" },
  errorCard: { textAlign: "center", p: 4, maxWidth: 420, mx: "auto" },
  geoAlert: {
    display: "flex",
    gap: 1,
    alignItems: "flex-start",
    bgcolor: "warning.light",
    color: "warning.contrastText",
    borderRadius: 2,
    p: 1.5,
  },
};

// ── Page ─────────────────────────────────────────────────────
export default function OrderTrackingPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [etaSecs, setEtaSecs] = useState(null);

  const role = user?.role?.toLowerCase() === "driver" ? "driver" : "user";
  const isActive = order?.status === "picked_up" || order?.status === "on_the_way";
  const dashboardPath = role === "driver" ? "/dashboard/driver/orders" : "/dashboard/customer";

  const { driverPos, userPos, connectionStatus, geoError } = useOrderTracking(id, role, isActive);

  useEffect(() => {
    if (driverPos || userPos) setLastUpdated(new Date());
  }, [driverPos, userPos]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await getOrderById(id);
      if (result.ok) {
        setOrder(result.data);
        if (result.data.status === "picked_up" || result.data.status === "on_the_way") {
          await getOrderLocationSnapshot(id);
        }
      } else {
        setError(result.message);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <Box sx={s.page} dir="rtl">
        <Box sx={s.centeredBox}>
          <CircularProgress size={42} />
          <Typography sx={{ fontSize: 15, color: "text.secondary" }}>
            جارٍ تحميل بيانات الطلب...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={s.page} dir="rtl">
        <Box sx={s.centeredBox}>
          <Box sx={s.errorCard}>
            <Typography sx={{ fontSize: 20, fontWeight: 800, mb: 1 }}>
              تعذّر تحميل الطلب
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
              {error ?? "الطلب غير موجود أو لا تملك صلاحية الوصول إليه."}
            </Typography>
            <Box component={Link} to={dashboardPath} sx={s.backLink}>
              <ArrowForwardIcon sx={{ fontSize: 17 }} />
              العودة إلى لوحة التحكم
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const orderLabel = deriveOrderLabel(order);

  return (
    <Box sx={s.page} dir="rtl">
      {/* Header */}
      <Box sx={s.header}>
        <Box sx={s.eyebrow}>
          <LocalShippingIcon sx={{ fontSize: 13 }} />
          تتبع الطلب #{order.id}
        </Box>
        <Typography sx={s.title}>الخريطة المباشرة للطلب</Typography>
        <Box component={Link} to={dashboardPath} sx={{ ...s.backLink, alignSelf: "flex-end" }}>
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
          العودة إلى لوحة التحكم
        </Box>
      </Box>

      {/* Main grid */}
      <Box sx={s.content}>
        {/* Map */}
        <Box sx={s.mapCard}>
          {!isActive ? (
            <Box
              sx={{
                height: { xs: 340, sm: 420, md: 520 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1.5,
                bgcolor: "background.paper",
              }}
            >
              <MyLocationIcon sx={{ fontSize: 48, color: "text.disabled" }} />
              <Typography sx={{ fontSize: 15, color: "text.secondary", textAlign: "center" }}>
                التتبع المباشر يبدأ عندما يستلم السائق الطلب.
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
                الحالة الحالية: {STATUS_LABELS[order.status] ?? order.status}
              </Typography>
            </Box>
          ) : (
            <Box sx={s.mapWrapper}>
              <TrackingMap order={order} driverPos={driverPos} userPos={userPos} onEtaUpdate={setEtaSecs} />
            </Box>
          )}

          {/* Status bar */}
          <Box sx={s.statusBar}>
            <Box sx={s.connectionDot(connectionStatus)} />
            {connectionStatus === "connected" ? (
              <WifiIcon sx={{ fontSize: 14, color: "success.main" }} />
            ) : (
              <WifiOffIcon sx={{ fontSize: 14, color: "text.disabled" }} />
            )}
            <Typography sx={s.connectionLabel}>{connectionLabel(connectionStatus)}</Typography>
            {lastUpdated && (
              <Typography sx={s.lastUpdateLabel}>
                آخر تحديث: {formatTime(lastUpdated.toISOString())}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Side panel */}
        <Box sx={s.sidePanel}>
          {geoError && (
            <Box sx={s.geoAlert}>
              <WarningAmberIcon sx={{ fontSize: 18, flexShrink: 0, mt: 0.15 }} />
              <Typography sx={{ fontSize: 13, lineHeight: 1.6 }}>{geoError}</Typography>
            </Box>
          )}

          {/* ETA card */}
          {isActive && driverPos && (
            <Box sx={{
              borderRadius: 3,
              border: "2px solid",
              borderColor: "primary.main",
              bgcolor: "primary.main",
              color: "#fff",
              p: 2.5,
              textAlign: "center",
            }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, opacity: 0.85, mb: 0.5 }}>
                الوقت المتوقع للتوصيل
              </Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>
                {formatEta(etaSecs) ?? "جارٍ الحساب..."}
              </Typography>
            </Box>
          )}

          {/* Order info card */}
          <Box sx={s.infoCard}>
            <Typography sx={s.infoCardTitle}>تفاصيل الطلب</Typography>

            <Box sx={s.infoRow}>
              <Typography sx={s.infoLabel}>الحالة</Typography>
              <Box sx={s.statusChip(order.status)}>
                {STATUS_LABELS[order.status] ?? order.status}
              </Box>
            </Box>

            <Box sx={s.infoRow}>
              <Typography sx={s.infoLabel}>نوع الطلب</Typography>
              <Typography sx={s.infoValue}>{orderLabel}</Typography>
            </Box>

            {order.totalPrice != null && (
              <Box sx={s.infoRow}>
                <Typography sx={s.infoLabel}>الإجمالي</Typography>
                <Typography sx={s.infoValue}>{Number(order.totalPrice).toFixed(0)} ₪</Typography>
              </Box>
            )}

            {order.driverName && (
              <Box sx={s.infoRow}>
                <Typography sx={s.infoLabel}>السائق</Typography>
                <Typography sx={s.infoValue}>{order.driverName}</Typography>
              </Box>
            )}
          </Box>

          {/* Live positions card */}
          {isActive && (driverPos || userPos) && (
            <Box sx={s.infoCard}>
              <Typography sx={s.infoCardTitle}>المواقع الحية</Typography>

              <Box sx={s.infoRow}>
                <Typography sx={s.infoLabel}>السائق</Typography>
                <Typography sx={s.infoValue}>
                  {driverPos ? "موقع متاح ✓" : "في انتظار البيانات..."}
                </Typography>
              </Box>

              <Box sx={s.infoRow}>
                <Typography sx={s.infoLabel}>{role === "driver" ? "العميل" : "أنت"}</Typography>
                <Typography sx={s.infoValue}>
                  {userPos ? "موقع متاح ✓" : "في انتظار بيانات GPS..."}
                </Typography>
              </Box>

              {driverPos?.updatedAt && (
                <Box sx={s.infoRow}>
                  <Typography sx={s.infoLabel}>آخر تحديث</Typography>
                  <Typography sx={s.infoValue}>{formatTime(driverPos.updatedAt)}</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
