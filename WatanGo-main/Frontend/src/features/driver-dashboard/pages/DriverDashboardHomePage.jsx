import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useOutletContext } from "react-router-dom";

const STATUS_LABELS = {
  pending: "في الانتظار",
  accepted: "مقبولة",
  driver_assigned: "السائق في الطريق",
  on_the_way: "في الطريق",
  completed: "مكتملة",
  cancelled: "ملغاة",
};

const STATUS_COLORS = {
  pending: "warning",
  accepted: "info",
  driver_assigned: "info",
  on_the_way: "primary",
  completed: "success",
  cancelled: "error",
};

const STAT_CONFIGS = [
  { key: "trips", title: "رحلات اليوم", icon: DirectionsCarIcon, color: "#2196f3", bg: "#e3f2fd" },
  { key: "earnings", title: "أرباح اليوم", icon: AttachMoneyIcon, color: "#ff9800", bg: "#fff3e0" },
];

export default function DriverDashboardHomePage() {
  const {
    driverStats: stats,
    dailyEarnings,
    isLoading,
    rideOrders,
    handleAcceptRide,
    handleRejectRide,
    handleCompleteRide,
  } = useOutletContext();

  const tripsHint =
    stats.hasActiveRide
      ? "مع رحلة نشطة الآن"
      : rideOrders.length > 0
        ? "لا توجد رحلة نشطة الآن"
        : "لا توجد طلبات متاحة الآن";

  const earningsHint =
    dailyEarnings.completedCount > 0
      ? "من الطلبات والرحلات المكتملة"
      : "لا توجد أرباح اليوم";

  const statValues = [
    `${stats.todayTripsCount}`,
    `${dailyEarnings.totalEarnings.toFixed(0)} ₪`,
  ];

  const statHints = [tripsHint, earningsHint];

  return (
    <Stack spacing={3}>
      {/* ── Stat cards ── */}
      <Stack direction="row" spacing={3}>
        {STAT_CONFIGS.map((cfg, i) => {
          const Icon = cfg.icon;
          return (
            <Card
              key={cfg.key}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                flex: 1,
                minWidth: 0,
              }}
            >
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Stack direction="row" mb={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {cfg.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 38, height: 38, borderRadius: 2,
                      bgcolor: cfg.bg, display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon sx={{ color: cfg.color, fontSize: 20 }} />
                  </Box>
                </Stack>
                <Typography variant="h5" fontWeight={700} mb={0.5}>
                  {isLoading ? "..." : statValues[i]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {statHints[i]}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* ── Ride orders list ── */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <CardContent>
          <Stack direction="row" mb={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight={700}>طلبات رحلات جديدة</Typography>
            <Chip label={rideOrders.length} size="small" color="primary" sx={{ fontWeight: 700 }} />
          </Stack>
          <Divider sx={{ mb: 2 }} />

          {rideOrders.length === 0 ? (
            <Box
              sx={{
                py: 4, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 2, bgcolor: "grey.50", border: "1px dashed", borderColor: "divider",
              }}
            >
              <Typography color="text.secondary" fontSize={14}>لا توجد طلبات رحلات حالياً</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {rideOrders.map((ride) => {
                const isActive =
                  ride.status === "accepted" ||
                  ride.status === "driver_assigned" ||
                  ride.status === "on_the_way";

                return (
                  <Card
                    key={ride.id}
                    variant="outlined"
                    sx={{
                      borderRadius: 2.5,
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Stack direction="row" mb={1.5} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            {ride.user.name} · #{ride.id}
                          </Typography>
                          <Typography fontWeight={600} noWrap>
                            {ride.pickup} ← {ride.destination}
                          </Typography>
                          <Stack direction="row" spacing={1.5} mt={0.5} sx={{ flexWrap: "wrap" }}>
                            {ride.distanceKm != null && (
                              <Typography variant="caption" color="text.secondary">
                                {ride.distanceKm.toFixed(1)} كم
                              </Typography>
                            )}
                            {ride.durationLabel && (
                              <Typography variant="caption" color="text.secondary">
                                {ride.durationLabel}
                              </Typography>
                            )}
                            {ride.price != null && (
                              <Typography variant="caption" fontWeight={700} color="primary.main">
                                {ride.price} شيكل
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                        <Chip
                          label={STATUS_LABELS[ride.status] ?? ride.status}
                          color={STATUS_COLORS[ride.status] ?? "default"}
                          size="small"
                          sx={{ ml: 1, flexShrink: 0 }}
                        />
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        {ride.status === "pending" && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleAcceptRide(ride.id)}
                              sx={{ borderRadius: 2, px: 2 }}
                            >
                              قبول والتوجه
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleRejectRide(ride.id)}
                              sx={{ borderRadius: 2 }}
                            >
                              رفض
                            </Button>
                          </>
                        )}
                        {isActive && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="success"
                            onClick={() => handleCompleteRide(ride.id)}
                            sx={{ borderRadius: 2 }}
                          >
                            إتمام الرحلة
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
