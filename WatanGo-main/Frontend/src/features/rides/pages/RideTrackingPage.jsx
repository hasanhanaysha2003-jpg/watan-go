import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useAuth } from "@/lib/auth";
import { getRideOrderById, getRideLocationSnapshot } from "@/api/ride-orders";
import { useRideTracking } from "../hooks/use-ride-tracking";
import { rideTrackingStyles as s } from "../ride-tracking.styles";
import { fetchRoute, fetchRouteWithDetails, distanceMetres } from "@/lib/routing";

// ── Fix default Leaflet marker icon paths broken by bundlers ──
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom marker icons ───────────────────────────────────────
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
      <path d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5zm-2.5-1c.83 0 1.5-.67 1.5-1.5S17.33 13 16.5 13 15 13.67 15 14.5s.67 1.5 1.5 1.5zm-9 0c.83 0 1.5-.67 1.5-1.5S8.33 13 7.5 13 6 13.67 6 14.5 6.67 16 7.5 16z'/>
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

const pickupIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#4caf50;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const destinationIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#f44336;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// ── Helpers ───────────────────────────────────────────────────
function statusLabel(s) {
  const map = {
    pending: "قيد الانتظار",
    assigned: "جارية",
    completed: "مكتملة",
    cancelled: "ملغاة",
  };
  return map[s] ?? s;
}

function connectionLabel(status) {
  const map = {
    connected: "متصل",
    connecting: "جارٍ الاتصال...",
    disconnected: "غير متصل",
    error: "خطأ في الاتصال",
  };
  return map[status] ?? status;
}

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ── Map component (uses plain Leaflet imperatively) ──────────
function formatEta(secs) {
  if (secs == null) return null;
  const mins = Math.round(secs / 60);
  if (mins < 1) return "أقل من دقيقة";
  if (mins < 60) return `${mins} دقيقة`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} ساعة ${m} دقيقة` : `${h} ساعة`;
}

function TrackingMap({ ride, driverPos, userPos, onEtaUpdate }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const staticPolylineRef = useRef(null);  // pickup → destination (real road, fetched once)
  const navPolylineRef = useRef(null);     // driver pos → pickup (live GPS route)
  const pickupMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const lastNavPosRef = useRef(null);      // driverPos at last nav-route fetch
  const navTimerRef = useRef(null);        // debounce timer for nav route

  // Initialise map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Static markers — pickup & destination
    const pickupLat = Number(ride.pickupLat);
    const pickupLng = Number(ride.pickupLng);
    const destLat = Number(ride.destinationLat);
    const destLng = Number(ride.destinationLng);

    if (pickupLat && pickupLng) {
      pickupMarkerRef.current = L.marker([pickupLat, pickupLng], { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`<b>نقطة الانطلاق</b><br/>${ride.pickupAddress}`);
    }

    if (destLat && destLng) {
      destMarkerRef.current = L.marker([destLat, destLng], { icon: destinationIcon })
        .addTo(map)
        .bindPopup(`<b>الوجهة</b><br/>${ride.destinationAddress}`);
    }

    // Real road route: pickup → destination (fetched async, falls back to straight line)
    if (pickupLat && pickupLng && destLat && destLng) {
      fetchRoute(pickupLat, pickupLng, destLat, destLng).then((coords) => {
        if (!mapInstanceRef.current) return; // component unmounted while fetching
        staticPolylineRef.current = L.polyline(coords, {
          color: "#1976d2",
          weight: 3,
          dashArray: "8 6",
          opacity: 0.6,
        }).addTo(mapInstanceRef.current);
      });
    }

    // Initial view
    const points = [];
    if (pickupLat && pickupLng) points.push([pickupLat, pickupLng]);
    if (destLat && destLng) points.push([destLat, destLng]);
    if (points.length > 0) map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    else map.setView([31.9, 35.2], 10); // Palestine fallback

    return () => {
      clearTimeout(navTimerRef.current);
      map.remove();
      mapInstanceRef.current = null;
      staticPolylineRef.current = null;
      navPolylineRef.current = null;
      lastNavPosRef.current = null;
    };
  }, [ride]);

  // Update driver marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !driverPos) return;
    const latlng = [driverPos.lat, driverPos.lng];
    if (!driverMarkerRef.current) {
      driverMarkerRef.current = L.marker(latlng, { icon: driverIcon })
        .addTo(map)
        .bindPopup(`<b>السائق</b><br/>${ride.driverName ?? ""}`);
    } else {
      driverMarkerRef.current.setLatLng(latlng);
    }
    fitBoundsIfBoth(map, driverPos, userPos);
  }, [driverPos, ride.driverName, userPos]);

  // Update user marker
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

  // Live navigation route: driver's current position → pickup (real road, debounced)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !driverPos) return;

    const pickupLat = Number(ride.pickupLat);
    const pickupLng = Number(ride.pickupLng);
    if (!pickupLat || !pickupLng) return;

    // Skip fetch if driver hasn't moved more than 100m since last fetch
    if (
      lastNavPosRef.current &&
      distanceMetres(lastNavPosRef.current, driverPos) < 100
    ) return;

    clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(async () => {
      const { coords, durationSecs } = await fetchRouteWithDetails(driverPos.lat, driverPos.lng, pickupLat, pickupLng);
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
  }, [driverPos, ride]);

  function fitBoundsIfBoth(map, dp, up) {
    const pts = [];
    if (dp) pts.push([dp.lat, dp.lng]);
    if (up) pts.push([up.lat, up.lng]);
    if (pts.length === 2) map.fitBounds(L.latLngBounds(pts), { padding: [60, 60], maxZoom: 16 });
  }

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}

// ── Page ─────────────────────────────────────────────────────
export default function RideTrackingPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [etaSecs, setEtaSecs] = useState(null);

  const role = user?.role?.toLowerCase() === "driver" ? "driver" : "user";
  const isAssigned = ride?.status === "assigned";
  const dashboardPath = role === "driver" ? "/dashboard/driver/delivery" : "/dashboard/customer";

  const { driverPos, userPos, connectionStatus, geoError } = useRideTracking(
    id,
    role,
    isAssigned,
  );

  // Update last-updated timestamp whenever any position changes
  useEffect(() => {
    if (driverPos || userPos) setLastUpdated(new Date());
  }, [driverPos, userPos]);

  // Fetch ride details
  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await getRideOrderById(id);
      if (result.ok) {
        setRide(result.data);
        // Pre-populate from snapshot if already assigned
        if (result.data.status === "assigned") {
          // Snapshot pre-load — don't set lastUpdated here;
          // it will be set when actual hub positions arrive
          await getRideLocationSnapshot(id);
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
            جارٍ تحميل بيانات الرحلة...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !ride) {
    return (
      <Box sx={s.page} dir="rtl">
        <Box sx={s.centeredBox}>
          <Box sx={s.errorCard}>
            <Typography sx={{ fontSize: 20, fontWeight: 800, mb: 1 }}>
              تعذّر تحميل الرحلة
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
              {error ?? "الرحلة غير موجودة أو لا تملك صلاحية الوصول إليها."}
            </Typography>
            <Box component={Link} to={role === "driver" ? "/dashboard/driver/delivery" : "/dashboard/customer"} sx={s.backLink}>
              <ArrowForwardIcon sx={{ fontSize: 17 }} />
              العودة إلى لوحة التحكم
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={s.page} dir="rtl">
      {/* Header */}
      <Box sx={s.header}>
        <Box sx={s.eyebrow}>
          <DirectionsCarIcon sx={{ fontSize: 13 }} />
          تتبع الرحلة #{ride.id}
        </Box>
        <Typography sx={s.title}>
          الخريطة المباشرة للرحلة
        </Typography>
        <Box
          component={Link}
          to={dashboardPath}
          sx={{ ...s.backLink, alignSelf: "flex-end" }}
        >
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
          العودة إلى لوحة التحكم
        </Box>
      </Box>

      {/* Main grid */}
      <Box sx={s.content}>
        {/* Map */}
        <Box sx={s.mapCard}>
          {!isAssigned ? (
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
                التتبع المباشر يبدأ عندما يقبل السائق الرحلة.
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
                الحالة الحالية: {statusLabel(ride.status)}
              </Typography>
            </Box>
          ) : (
            <Box sx={s.mapWrapper}>
              <TrackingMap
                ride={ride}
                driverPos={driverPos}
                userPos={userPos}
                onEtaUpdate={setEtaSecs}
              />
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
            <Typography sx={s.connectionLabel}>
              {connectionLabel(connectionStatus)}
            </Typography>
            {lastUpdated && (
              <Typography sx={s.lastUpdateLabel}>
                آخر تحديث: {formatTime(lastUpdated.toISOString())}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Side panel */}
        <Box sx={s.sidePanel}>
          {/* Geo warning */}
          {geoError && (
            <Box sx={s.geoAlert}>
              <WarningAmberIcon sx={{ fontSize: 18, flexShrink: 0, mt: 0.15 }} />
              <Typography sx={{ fontSize: 13, lineHeight: 1.6 }}>
                {geoError}
              </Typography>
            </Box>
          )}

          {/* ETA card */}
          {isAssigned && driverPos && (
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
                الوقت المتوقع لوصول السائق
              </Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>
                {formatEta(etaSecs) ?? "جارٍ الحساب..."}
              </Typography>
            </Box>
          )}

          {/* Ride info card */}
          <Box sx={s.infoCard}>
            <Typography sx={s.infoCardTitle}>تفاصيل الرحلة</Typography>

            <Box sx={s.infoRow}>
              <Typography sx={s.infoLabel}>الحالة</Typography>
              <Box sx={s.statusChip(ride.status)}>{statusLabel(ride.status)}</Box>
            </Box>

            <Box sx={s.infoRow}>
              <Typography sx={s.infoLabel}>نقطة الانطلاق</Typography>
              <Typography sx={s.infoValue}>{ride.pickupAddress}</Typography>
            </Box>

            <Box sx={s.infoRow}>
              <Typography sx={s.infoLabel}>الوجهة</Typography>
              <Typography sx={s.infoValue}>{ride.destinationAddress}</Typography>
            </Box>

            {ride.distanceKm != null && (
              <Box sx={s.infoRow}>
                <Typography sx={s.infoLabel}>المسافة</Typography>
                <Typography sx={s.infoValue}>
                  {Number(ride.distanceKm).toFixed(1)} كم
                </Typography>
              </Box>
            )}

            {ride.price != null && (
              <Box sx={s.infoRow}>
                <Typography sx={s.infoLabel}>السعر</Typography>
                <Typography sx={s.infoValue}>{ride.price} ₪</Typography>
              </Box>
            )}

            {ride.driverName && (
              <Box sx={s.infoRow}>
                <Typography sx={s.infoLabel}>السائق</Typography>
                <Typography sx={s.infoValue}>{ride.driverName}</Typography>
              </Box>
            )}
          </Box>

          {/* Live positions card — only show when we have actual data */}
          {isAssigned && (driverPos || userPos) && (
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
                  <Typography sx={s.infoValue}>
                    {formatTime(driverPos.updatedAt)}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
