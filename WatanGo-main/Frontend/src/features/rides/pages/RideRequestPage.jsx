import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import { MapModal } from "@/components/MapModal";
import { rideStyles as s } from "../rides.styles";
import { useRideRequest } from "../hooks/use-ride-request";
import { PickupField } from "../components/PickupField";
import { DestinationField } from "../components/DestinationField";
import { TripSummary } from "../components/TripSummary";

export default function RideRequestPage() {
  const {
    pickup,
    destination,
    mapOpen,
    setMapOpen,
    submitting,
    confirmed,
    distanceKm,
    deliveryType,
    price,
    duration,
    canConfirm,
    setPickupByGPS,
    setPickupFromMap,
    setDestinationFromMap,
    clearPickup,
    clearDestination,
    submitRide,
  } = useRideRequest();

  const [mapTarget, setMapTarget] = useState("destination");
  const hasLocationError = !!pickup.error || !!destination.error;

  function openMapForPickup() {
    setMapTarget("pickup");
    setMapOpen(true);
  }

  function openMapForDestination() {
    setMapTarget("destination");
    setMapOpen(true);
  }

  function handleMapConfirm(sel) {
    if (mapTarget === "pickup") setPickupFromMap(sel);
    else setDestinationFromMap(sel);
  }

  return (
    <Box sx={s.page}>
      <Box sx={s.gridOverlay} aria-hidden />

      {/* Hero */}
      <Box sx={s.hero}>
        <Box sx={s.heroEyebrow}>
          <DirectionsCarIcon sx={{ fontSize: 15 }} />
          طلب رحلة
        </Box>
        <Typography sx={s.heroTitle}>
          احجز رحلتك{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            بخطوات واضحة.
          </Box>
        </Typography>
        <Typography sx={s.heroSubtitle}>
          حدّد موقعك تلقائياً عبر GPS أو اختر وجهتك على الخريطة، وتابع تفاصيل
          رحلتك قبل التأكيد.
        </Typography>
      </Box>

      {/* Map modal */}
      <MapModal
        open={mapOpen}
        initialCoords={
          mapTarget === "pickup" ? pickup.coords : destination.coords
        }
        onConfirm={handleMapConfirm}
        onClose={() => setMapOpen(false)}
      />

      {/* Main content */}
      <Box sx={s.content}>
        <Box sx={s.grid}>
          {/* ── Left: form ── */}
          <Box sx={s.card}>
            <Typography sx={s.cardTitle}>إلى أين تريد الذهاب؟</Typography>

            <PickupField
              pickup={pickup}
              onGPS={setPickupByGPS}
              onOpenMap={openMapForPickup}
              onClear={clearPickup}
            />

            <DestinationField
              destination={destination}
              onOpenMap={openMapForDestination}
              onClear={clearDestination}
            />

            <TripSummary
              distanceKm={distanceKm}
              deliveryType={deliveryType}
              price={price}
              duration={duration}
            />
          </Box>

          {/* ── Right: confirm ── */}
          <Box sx={s.rightColumn}>
            <Button
              onClick={submitRide}
              disabled={!canConfirm || submitting || confirmed}
              sx={confirmed ? s.confirmButtonSuccess : s.confirmButton}
            >
              {confirmed ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 18 }} />
                  تم تأكيد الطلب
                </Box>
              ) : submitting ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  جارٍ الإرسال...
                </Box>
              ) : !pickup.address ? (
                "حدّد نقطة الانطلاق أولاً"
              ) : !destination.address ? (
                "حدّد الوجهة أولاً"
              ) : (
                "تأكيد طلب الرحلة"
              )}
            </Button>

            {hasLocationError && (
              <Box sx={s.errorAlert}>
                <ReportProblemIcon
                  sx={{ fontSize: 18, flexShrink: 0, mt: 0.25 }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                    تعذّر الوصول إلى الموقع
                  </Typography>
                  <Typography sx={{ fontSize: 12, mt: 0.5, opacity: 0.85 }}>
                    تأكد من منح إذن الموقع في إعدادات المتصفح، أو اختر الوجهة
                    عبر الخريطة.
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

      </Box>
    </Box>
  );
}
