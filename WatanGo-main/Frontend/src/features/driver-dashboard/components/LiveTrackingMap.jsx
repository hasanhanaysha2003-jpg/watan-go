import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Button, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import NavigationIcon from "@mui/icons-material/Navigation";
import StraightenIcon from "@mui/icons-material/Straighten";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
    Math.cos((b.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

function etaMinutes(km) {
  return Math.max(1, Math.round((km / 30) * 60));
}

function driverIconHtml() {
  return `<div style="width:36px;height:36px;background:#22d3ee;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.5);font-size:16px;">🚗</div>`;
}

function pinIconHtml(color, emoji) {
  return `<div style="width:32px;height:32px;background:${color};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:13px">${emoji}</span></div>`;
}

const KIND_LABELS = { ride: "رحلة", food: "توصيل طعام", shop: "توصيل تسوق" };

export function LiveTrackingMap({
  order,
  onComplete,
  canComplete = true,
  completeLabel = "إنهاء الطلب",
  initialDriverCoords,
  onDriverLocationChange,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const watchIdRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [driverCoords, setDriverCoords] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [distRemaining, setDistRemaining] = useState(null);

  const destCoords =
    order.destinationCoords?.lat && order.destinationCoords?.lng ? order.destinationCoords : null;

  useEffect(() => {
    let destroyed = false;
    (async () => {
      try {
        const lf = await import("leaflet");
        await import("leaflet/dist/leaflet.css");
        if (destroyed || !containerRef.current || mapRef.current) return;

        leafletRef.current = lf;
        const defaultCenter = order.pickupCoords
          ? [order.pickupCoords.lat, order.pickupCoords.lng]
          : destCoords
            ? [destCoords.lat, destCoords.lng]
            : [31.9038, 35.2034];

        const map = lf.map(containerRef.current, { center: defaultCenter, zoom: 14, zoomControl: false, attributionControl: false });
        lf.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
        lf.control.zoom({ position: "topleft" }).addTo(map);
        lf.control.attribution({ position: "bottomleft", prefix: "© OpenStreetMap" }).addTo(map);

        if (order.pickupCoords) {
          pickupMarkerRef.current = lf
            .marker([order.pickupCoords.lat, order.pickupCoords.lng], {
              icon: lf.divIcon({ className: "", html: pinIconHtml("#22d3ee", "📦"), iconSize: [32, 32], iconAnchor: [16, 32] }),
            })
            .addTo(map)
            .bindPopup(`<b>نقطة الاستلام</b><br>${order.pickup}`);
        }

        if (destCoords) {
          destMarkerRef.current = lf
            .marker([destCoords.lat, destCoords.lng], {
              icon: lf.divIcon({ className: "", html: pinIconHtml("#f59e0b", "🏁"), iconSize: [32, 32], iconAnchor: [16, 32] }),
            })
            .addTo(map)
            .bindPopup(`<b>الوجهة</b><br>${order.destination}`);
        }

        const points = [];
        if (order.pickupCoords) points.push([order.pickupCoords.lat, order.pickupCoords.lng]);
        if (destCoords) points.push([destCoords.lat, destCoords.lng]);
        if (points.length === 2) map.fitBounds(lf.latLngBounds(points), { padding: [60, 60] });

        mapRef.current = map;
        setMapReady(true);
      } catch {
        if (!destroyed) setMapError("تعذّر تحميل الخريطة. تحقق من اتصالك بالإنترنت.");
      }
    })();
    return () => { destroyed = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateDriverPosition = useCallback((lat, lng) => {
    const lf = leafletRef.current;
    const map = mapRef.current;
    if (!lf || !map) return;

    const nextCoords = { lat, lng };
    setDriverCoords(nextCoords);
    onDriverLocationChange?.(nextCoords);

    if (driverMarkerRef.current) {
      driverMarkerRef.current.setLatLng([lat, lng]);
    } else {
      driverMarkerRef.current = lf
        .marker([lat, lng], {
          icon: lf.divIcon({ className: "", html: driverIconHtml(), iconSize: [36, 36], iconAnchor: [18, 18] }),
          zIndexOffset: 1000,
        })
        .addTo(map)
        .bindPopup("موقعك الحالي");
    }

    const waypoints = [[lat, lng]];
    if (order.pickupCoords) waypoints.push([order.pickupCoords.lat, order.pickupCoords.lng]);
    if (destCoords) waypoints.push([destCoords.lat, destCoords.lng]);

    if (routeLineRef.current) {
      routeLineRef.current.setLatLngs(waypoints);
    } else if (waypoints.length > 1) {
      routeLineRef.current = lf.polyline(waypoints, { color: "#22d3ee", weight: 5, opacity: 0.85, dashArray: "12 8" }).addTo(map);
    }

    const target = destCoords ?? order.pickupCoords ?? null;
    if (target) setDistRemaining(haversineKm({ lat, lng }, target));
  }, [order.pickupCoords, destCoords, onDriverLocationChange]);

  useEffect(() => {
    if (!mapReady || !initialDriverCoords || driverCoords) return;
    updateDriverPosition(initialDriverCoords.lat, initialDriverCoords.lng);
  }, [driverCoords, initialDriverCoords, mapReady, updateDriverPosition]);

  useEffect(() => {
    if (!mapReady) return;
    if (!navigator.geolocation) { setGpsError("GPS غير مدعوم في هذا المتصفح"); return; }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => { setGpsError(null); updateDriverPosition(pos.coords.latitude, pos.coords.longitude); },
      (err) => {
        const msg = err.code === 1 ? "تم رفض إذن الموقع" : err.code === 2 ? "تعذّر تحديد الموقع" : "انتهت مهلة GPS";
        setGpsError(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
    );
    return () => { if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, [mapReady, updateDriverPosition]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
      mapRef.current?.remove();
      mapRef.current = null;
      driverMarkerRef.current = null;
      pickupMarkerRef.current = null;
      destMarkerRef.current = null;
      routeLineRef.current = null;
    };
  }, []);

  return (
    <Box sx={{ overflow: "hidden", borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
      {/* Header */}
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={(theme) => ({
              width: 36, height: 36, borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.12),
              display: "flex", alignItems: "center", justifyContent: "center",
            })}
          >
            <NavigationIcon color="info" fontSize="small" />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {KIND_LABELS[order.kind] ?? order.kind} · {order.id}
            </Typography>
            <Typography fontWeight={700} fontSize={14}>{order.customerName}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main", animation: "pulse 2s infinite" }} />
          <Typography variant="caption" color="success.main" fontWeight={600}>تتبع مباشر</Typography>
        </Stack>
      </Stack>

      {/* Stats bar */}
      <Grid container sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3) }}>
        {[
          { icon: <StraightenIcon sx={{ fontSize: 14 }} />, label: "المسافة المتبقية", value: distRemaining != null ? `${distRemaining.toFixed(1)} كم` : "—" },
          { icon: <AccessTimeIcon sx={{ fontSize: 14 }} />, label: "الوصول المتوقع", value: distRemaining != null ? `${etaMinutes(distRemaining)} د` : "—" },
          { icon: <InventoryIcon sx={{ fontSize: 14 }} />, label: "السعر", value: order.price != null ? `${order.price} ₪` : "—" },
        ].map((cell, i) => (
          <Grid item xs={4} key={i} sx={{ borderLeft: i > 0 ? "1px solid" : "none", borderColor: "divider", py: 1.5, textAlign: "center" }}>
            <Stack direction="row" spacing={0.5} color="text.secondary" mb={0.25} sx={{ alignItems: "center", justifyContent: "center" }}>
              {cell.icon}
            </Stack>
            <Typography variant="caption" color="text.secondary" display="block">{cell.label}</Typography>
            <Typography fontWeight={700} fontSize={13} color="primary.main">{cell.value}</Typography>
          </Grid>
        ))}
      </Grid>

      {/* Route summary */}
      <Grid container sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Grid item xs={6} sx={{ px: 2, py: 1.5, borderLeft: "1px solid", borderColor: "divider" }}>
          <Typography variant="caption" color="info.main" fontWeight={700} textTransform="uppercase" letterSpacing={0.8}>الاستلام</Typography>
          <Typography fontSize={12} fontWeight={600} mt={0.25}>{order.pickup}</Typography>
        </Grid>
        <Grid item xs={6} sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="primary.main" fontWeight={700} textTransform="uppercase" letterSpacing={0.8}>التسليم</Typography>
          <Typography fontSize={12} fontWeight={600} mt={0.25}>{order.destination}</Typography>
        </Grid>
      </Grid>

      {/* Map */}
      <Box sx={{ position: "relative", height: 340 }}>
        {!mapReady && !mapError && (
          <Box sx={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1.5, bgcolor: "background.paper" }}>
            <CircularProgress color="info" size={28} />
            <Typography variant="caption" color="text.secondary">جارٍ تحميل الخريطة...</Typography>
          </Box>
        )}
        {mapError && (
          <Box sx={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1.5, bgcolor: "background.paper", px: 3, textAlign: "center" }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 36 }} />
            <Typography variant="body2" color="error">{mapError}</Typography>
          </Box>
        )}
        {gpsError && mapReady && (
          <Box
            sx={(theme) => ({
              position: "absolute", bottom: 12, right: 12, zIndex: 10,
              display: "flex", alignItems: "flex-start", gap: 0.75,
              maxWidth: 220, px: 1.5, py: 1, borderRadius: 2,
              border: "1px solid", borderColor: alpha(theme.palette.error.main, 0.35),
              bgcolor: "background.paper", boxShadow: 2,
            })}
          >
            <ErrorOutlineIcon color="error" sx={{ fontSize: 14, mt: 0.25, flexShrink: 0 }} />
            <Typography variant="caption" color="error">{gpsError}</Typography>
          </Box>
        )}
        <Box ref={containerRef} sx={{ width: "100%", height: "100%" }} />
      </Box>

      {/* Driver location indicator */}
      {driverCoords && (
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", px: 2, py: 1.25, borderTop: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3) }}>
          <LocationOnIcon color="info" sx={{ fontSize: 14 }} />
          <Typography variant="caption" color="text.secondary">
            موقعك: {driverCoords.lat.toFixed(4)}, {driverCoords.lng.toFixed(4)}
          </Typography>
        </Stack>
      )}

      {/* Complete button */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button
          fullWidth
          variant="contained"
          color="success"
          disabled={!canComplete}
          onClick={onComplete}
          sx={{ borderRadius: 2.5, py: 1.5, fontWeight: 700 }}
        >
          {canComplete ? completeLabel : "أكمل مراحل التوصيل أولاً"}
        </Button>
      </Box>
    </Box>
  );
}
