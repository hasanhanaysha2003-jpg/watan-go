import {
  Box, Button, Card, CardContent, Chip, Divider, Stack, Tooltip, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HistoryIcon from "@mui/icons-material/History";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useNavigate, useOutletContext } from "react-router-dom";

const DELIVERY_TYPE_CHIP = {
  internal: { label: "توصيل داخلي", color: "info" },
  external: { label: "توصيل خارجي", color: "warning" },
};

export default function DriverDeliveryPage() {
  const navigate = useNavigate();
  const {
    rideOrders,
    activeRide,
    completedRides,
    handleAcceptRide,
    handleRejectRide,
    handleCompleteRide,
  } = useOutletContext();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" fontWeight={700}>إدارة التوصيل</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          تابع طلبات التوصيل من مكان لمكان وقبل الرحلات الجديدة.
        </Typography>
      </Box>

      {/* ── Active ride ── */}
      {activeRide && (
        <ActiveRideCard
          ride={activeRide}
          onComplete={() => handleCompleteRide(activeRide.id)}
          onTrack={() => navigate(`/rides/${activeRide.id}/tracking`)}
        />
      )}

      {/* ── Available rides ── */}
      <Box>
        <Stack direction="row" spacing={1} mb={2} sx={{ alignItems: "center" }}>
          <Typography variant="h6" fontWeight={700}>الرحلات المتاحة</Typography>
          {rideOrders.length > 0 && (
            <Chip label={rideOrders.length} size="small" color="primary" />
          )}
        </Stack>

        {rideOrders.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3) }}>
            <DirectionsCarIcon sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography fontWeight={700} mt={1.5}>لا توجد رحلات متاحة حالياً</Typography>
            <Typography variant="caption" color="text.secondary">ستظهر طلبات التوصيل الجديدة هنا عند توفرها.</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {rideOrders.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onAccept={() => handleAcceptRide(ride.id)}
                onReject={() => handleRejectRide(ride.id)}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* ── Completed rides ── */}
      {completedRides?.length > 0 && (
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" spacing={1} mb={2} sx={{ alignItems: "center" }}>
            <HistoryIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography variant="h6" fontWeight={700}>الرحلات المكتملة</Typography>
            <Chip label={completedRides.length} size="small" />
          </Stack>

          <Stack spacing={2}>
            {completedRides.map((ride) => (
              <CompletedRideCard key={ride.id} ride={ride} />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RideRouteDisplay({ pickup, destination }) {
  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 0.15, flexShrink: 0 }}>
        <LocationOnIcon color="info" sx={{ fontSize: 18 }} />
        <Box sx={(theme) => ({ width: 2, flex: 1, my: 0.5, minHeight: 18, bgcolor: theme.palette.divider })} />
        <LocationOnOutlinedIcon color="primary" sx={{ fontSize: 18 }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box mb={1.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>نقطة الانطلاق</Typography>
          <Typography fontWeight={700} fontSize={13} noWrap>{pickup}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>نقطة الوصول</Typography>
          <Typography fontWeight={700} fontSize={13} noWrap>{destination}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function RideMetaPills({ ride }) {
  const typeChip = DELIVERY_TYPE_CHIP[ride.deliveryType] ?? null;
  return (
    <Stack direction="row" spacing={0.75} mt={1.75} sx={{ flexWrap: "wrap" }}>
      {ride.distanceKm != null && (
        <Box sx={(theme) => pillSx(theme)}>{ride.distanceKm} كم</Box>
      )}
      {ride.durationLabel && (
        <Box sx={(theme) => pillSx(theme)}>{ride.durationLabel}</Box>
      )}
      {ride.price != null && (
        <Box sx={(theme) => pillSx(theme)}>{ride.price} ₪</Box>
      )}
      {typeChip && (
        <Chip label={typeChip.label} color={typeChip.color} size="small" variant="outlined" sx={{ height: 24, fontSize: 11, fontWeight: 600 }} />
      )}
    </Stack>
  );
}

function pillSx(theme) {
  return {
    display: "inline-flex", alignItems: "center",
    borderRadius: 10, border: "1px solid", borderColor: "divider",
    bgcolor: alpha(theme.palette.action.hover, 0.5),
    px: 1.25, py: 0.4, fontSize: 12, color: "text.secondary", fontWeight: 500,
  };
}

function ActiveRideCard({ ride, onComplete, onTrack }) {
  return (
    <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: (theme) => alpha(theme.palette.primary.main, 0.4) }}>
      <CardContent>
        <Stack direction="row" mb={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography fontWeight={800} fontSize={14}>{ride.displayId}</Typography>
            <Chip label="نشطة" color="primary" size="small" sx={{ fontWeight: 700, height: 22, fontSize: 12 }} />
          </Stack>
          <Typography variant="body2" color="text.secondary">{ride.user?.name}</Typography>
        </Stack>

        <RideRouteDisplay pickup={ride.pickup} destination={ride.destination} />
        <RideMetaPills ride={ride} />

        <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", gap: 1.5, alignItems: "center" }}>
          <Button
            fullWidth variant="contained" color="success"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={onComplete}
            sx={{ borderRadius: 2.5, fontWeight: 700, py: 1.25 }}
          >
            تم الوصول والتسليم
          </Button>

          <Tooltip title="عرض الخريطة المباشرة" arrow>
            <Button
              variant="outlined"
              color="info"
              onClick={onTrack}
              sx={{
                borderRadius: 2.5,
                py: 1.25,
                px: 1.5,
                minWidth: 0,
                flexShrink: 0,
              }}
            >
              <MapOutlinedIcon sx={{ fontSize: 22 }} />
            </Button>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

function RideCard({ ride, onAccept, onReject }) {
  return (
    <Box
      sx={(theme) => ({
        borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": { boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.1)}`, borderColor: alpha(theme.palette.primary.main, 0.4) },
      })}
    >
      {/* Header */}
      <Box sx={{ px: 2, py: 1.25, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.35) }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography fontWeight={800} fontSize={14}>{ride.displayId}</Typography>
          <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "text.disabled" }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{ride.user?.name}</Typography>
        </Stack>
        <Chip label="جديدة" color="info" size="small" sx={{ fontWeight: 700, height: 22, fontSize: 12 }} />
      </Box>

      {/* Route + meta */}
      <Box sx={{ px: 2, pt: 1.75, pb: 1.5 }}>
        <RideRouteDisplay pickup={ride.pickup} destination={ride.destination} />
        <RideMetaPills ride={ride} />
      </Box>

      {/* Actions */}
      <Box sx={{ px: 2, py: 1.25, borderTop: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.2), display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" startIcon={<CheckCircleOutlineIcon />} size="small" sx={{ borderRadius: 2, fontWeight: 600, px: 1.75 }} onClick={onAccept}>قبول</Button>
        <Button variant="outlined" color="error" startIcon={<CancelOutlinedIcon />} size="small" sx={{ borderRadius: 2, fontWeight: 600, px: 1.75 }} onClick={onReject}>رفض</Button>
      </Box>
    </Box>
  );
}

function CompletedRideCard({ ride }) {
  function parseUtc(str) {
    if (!str) return new Date(NaN);
    const s = String(str);
    return new Date(/Z$|[+-]\d{2}:?\d{2}$/.test(s) ? s : s + "Z");
  }
  const date = ride.createdAt
    ? parseUtc(ride.createdAt).toLocaleDateString("ar-PS", { year: "numeric", month: "short", day: "numeric" })
    : null;

  return (
    <Box
      sx={{
        borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden",
        opacity: 0.82,
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, py: 1.25, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.25) }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography fontWeight={800} fontSize={14}>{ride.displayId}</Typography>
          <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "text.disabled" }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{ride.user?.name}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {date && <Typography variant="caption" color="text.disabled">{date}</Typography>}
          <Chip label="مكتملة" color="success" size="small" sx={{ fontWeight: 700, height: 22, fontSize: 12 }} />
        </Stack>
      </Box>

      {/* Route + meta */}
      <Box sx={{ px: 2, pt: 1.75, pb: 1.75 }}>
        <RideRouteDisplay pickup={ride.pickup} destination={ride.destination} />
        <RideMetaPills ride={ride} />
      </Box>
    </Box>
  );
}
