import { AnimatePresence, motion } from "framer-motion";
import {
  Box, Chip, Link, Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Outlet, useLocation } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useAuth } from "@/lib/auth";
import { mockTrips } from "../data/mock-data";
import { useDriverRideOrders } from "../hooks/use-driver-ride-orders";
import { useDriverDashboard } from "../hooks/use-driver-dashboard";
import { DetailsDrawer } from "../components/DetailsDrawer";
import { AppHeader } from "@/components/AppHeader";
import { SidebarNavigation } from "../components/SidebarNavigation";

// ─────────────────────────────────────────────────────────────────────────────
// Drawer content — local to layout, not reused anywhere else
// ─────────────────────────────────────────────────────────────────────────────

function MetricCard({ label, value, color = "primary.main" }) {
  return (
    <Box sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3), p: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700} color={color} mt={1}>{value}</Typography>
    </Box>
  );
}

function TripsDetails({ trips }) {
  const counts = {
    completed: trips.filter((t) => t.status === "completed").length,
    cancelled: trips.filter((t) => t.status === "cancelled").length,
    active: trips.filter((t) => t.status === "active").length,
  };
  const CHIP_COLOR = { completed: "success", cancelled: "error", active: "primary" };
  const CHIP_LABEL = { completed: "مكتملة", cancelled: "ملغاة", active: "نشطة" };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5 }}>
        <MetricCard label="مكتملة" value={counts.completed} color="success.main" />
        <MetricCard label="ملغاة" value={counts.cancelled} color="error.main" />
        <MetricCard label="نشطة" value={counts.active} color="primary.main" />
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={700} mb={1.5}>آخر الرحلات</Typography>
        <Stack spacing={1.5}>
          {trips.map((trip) => (
            <Box key={trip.id} sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography fontWeight={700} color="info.main">{trip.pickupLocation}</Typography>
                  <Typography variant="body2" color="text.secondary">إلى {trip.deliveryLocation}</Typography>
                  <Stack direction="row" spacing={1.5} mt={0.75}>
                    <Typography variant="caption" color="text.secondary">{trip.distance} كم</Typography>
                    <Typography variant="caption" color="text.secondary">{trip.duration} دقيقة</Typography>
                    <Typography variant="caption" color="text.secondary">{trip.amount} شيكل</Typography>
                  </Stack>
                </Box>
                <Chip
                  label={CHIP_LABEL[trip.status] ?? trip.status}
                  color={CHIP_COLOR[trip.status] ?? "default"}
                  size="small"
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

function EarningsDetails({ earnings }) {
  return (
    <Stack spacing={3}>
      <Box
        sx={{
          borderRadius: 3, border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha("#22d3ee", 0.08)})`,
          p: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary">إجمالي أرباح اليوم</Typography>
        <Typography variant="h3" fontWeight={700} color="primary.main" mt={1}>
          {earnings.totalEarnings.toFixed(0)} شيكل
        </Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        <MetricCard label="عدد الطلبات المكتملة" value={earnings.completedCount} color="info.main" />
        <MetricCard label="إجمالي الأرباح" value={`${earnings.totalEarnings.toFixed(0)} ₪`} color="primary.main" />
      </Box>
      {earnings.items.length === 0 ? (
        <Box sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", p: 2.5, color: "text.secondary", fontSize: 14 }}>
          لا توجد أرباح اليوم.
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {earnings.items.map((item) => (
            <Box key={`${item.type}-${item.id}`} sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Stack direction="row" spacing={1} mb={0.5} sx={{ alignItems: "center" }}>
                    <Typography fontWeight={700} color="info.main">{item.id}</Typography>
                    <Chip label={item.type === "ride" ? "رحلة" : "توصيل"} size="small" color="primary" variant="outlined" />
                  </Stack>
                  <Typography variant="body2" fontWeight={600}>{item.pickup}</Typography>
                  <Typography variant="caption" color="text.secondary">إلى {item.destination}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {new Date(item.completedAt).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} color="primary.main">{item.fare.toFixed(0)} ₪</Typography>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

const WORKING_HOURS_STATUS = {
  labels: { online: "متصل", busy: "مشغول", offline: "غير متصل" },
  colors: { online: "#22d3ee", busy: "#f59e0b", offline: "#9ca3af" },
};

const ACTIVITY_COLORS = { cyan: "#22d3ee", amber: "#f59e0b", primary: "primary.main" };

function WorkingHoursDetails({ startTime, endTime, breakTime, status, activity }) {
  const now = endTime ?? new Date();
  const workingMinutes = Math.max(0, Math.floor((now - startTime) / 60000) - breakTime);
  const totalHours = `${Math.floor(workingMinutes / 60)}س ${workingMinutes % 60}د`;
  const formatTime = (d) => d.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          borderRadius: 3, p: 3,
          border: "1px solid", borderColor: (theme) => alpha(theme.palette.info.main, 0.3),
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.06)})`,
        }}
      >
        <Typography variant="body2" color="text.secondary">حالة السائق الحالية</Typography>
        <Stack direction="row" spacing={1.5} mt={1.5} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: WORKING_HOURS_STATUS.colors[status] ?? "#9ca3af", animation: "pulse 2s infinite" }} />
          <Typography variant="h6" fontWeight={700}>{WORKING_HOURS_STATUS.labels[status] ?? status}</Typography>
        </Stack>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        <MetricCard label="بداية المناوبة" value={formatTime(startTime)} color="info.main" />
        <MetricCard label="نهاية المناوبة" value={endTime ? formatTime(endTime) : "مستمرة"} color="primary.main" />
        <MetricCard label="إجمالي ساعات العمل" value={totalHours} color="warning.main" />
        <MetricCard label="وقت الاستراحة" value={`${breakTime} دقيقة`} color="primary.main" />
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={700} mb={1.5}>نشاط اليوم</Typography>
        <Stack spacing={0}>
          {activity.map((event, index) => (
            <Box key={event.id} sx={{ display: "flex", gap: 1.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <FiberManualRecordIcon sx={{ fontSize: 12, color: ACTIVITY_COLORS[event.tone] ?? "primary.main", mt: 0.5 }} />
                {index < activity.length - 1 && <Box sx={{ width: 2, flex: 1, minHeight: 28, bgcolor: "divider", my: 0.25 }} />}
              </Box>
              <Box sx={{ pb: index < activity.length - 1 ? 2 : 0 }}>
                <Typography fontWeight={700} fontSize={14}>{event.label}</Typography>
                <Typography variant="caption" color="text.secondary">{event.time}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

function OrderDetails({ order }) {
  const PAYMENT_LABELS = { cash: "نقداً", card: "بطاقة بنكية", wallet: "محفظة إلكترونية" };
  return (
    <Stack spacing={3}>
      <Box
        sx={(theme) => ({
          borderRadius: 2.5, border: "1px solid",
          borderColor: alpha(theme.palette.info.main, 0.3),
          bgcolor: alpha(theme.palette.info.main, 0.06), p: 2.5,
        })}
      >
        <Typography variant="body2" color="text.secondary">معلومات العميل</Typography>
        <Typography variant="h5" fontWeight={700} mt={0.75}>{order.customerName}</Typography>
        <Link href={`tel:${order.customerPhone}`} color="info.main" fontWeight={700} display="block" mt={0.5} underline="hover">
          {order.customerPhone}
        </Link>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        {[
          { label: "ملاحظات التوصيل", value: order.notes ?? "لا توجد ملاحظات" },
          { label: "طريقة الدفع", value: PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod },
          { label: "الوقت المتوقع للوصول", value: order.estimatedDeliveryTime },
          { label: "رسوم التوصيل", value: `${order.price} شيكل` },
        ].map((d) => (
          <Box key={d.label} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", p: 1.75 }}>
            <Typography variant="caption" color="text.secondary">{d.label}</Typography>
            <Typography fontWeight={700} mt={0.5} fontSize={14}>{d.value}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", p: 2 }}>
        <Typography fontWeight={700} mb={1.5}>تفاصيل المسار</Typography>
        <Stack spacing={1} mb={1.5}>
          {[
            { icon: <LocationOnIcon color="info" sx={{ fontSize: 16, mt: 0.25 }} />, label: "من", value: order.pickupLocation },
            { icon: <LocationOnOutlinedIcon color="primary" sx={{ fontSize: 16, mt: 0.25 }} />, label: "إلى", value: order.deliveryLocation },
          ].map((row) => (
            <Box key={row.label} sx={{ display: "flex", gap: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider", p: 1.25, bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3) }}>
              {row.icon}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                <Typography fontWeight={700} fontSize={13} noWrap>{row.value}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          {[
            { icon: <LocationOnIcon sx={{ fontSize: 12 }} />, value: `${order.distance} كم` },
            { icon: <AccessTimeIcon sx={{ fontSize: 12 }} />, value: `${order.duration} دقيقة` },
          ].map((pill, i) => (
            <Box key={i} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, borderRadius: 10, border: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.4), px: 1.25, py: 0.5, fontSize: 12, color: "text.secondary" }}>
              {pill.icon} {pill.value}
            </Box>
          ))}
        </Stack>
      </Box>
      <Box>
        <Typography fontWeight={700} mb={1.5}>سجل الطلب</Typography>
        <Stack spacing={0}>
          {order.timeline.map((event, index) => (
            <Box key={`${event.label}-${index}`} sx={{ display: "flex", gap: 1.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: event.done ? "info.main" : "text.disabled", mt: 0.5, flexShrink: 0 }} />
                {index < order.timeline.length - 1 && <Box sx={{ width: 2, flex: 1, minHeight: 24, bgcolor: "divider", my: 0.25 }} />}
              </Box>
              <Box sx={{ pb: index < order.timeline.length - 1 ? 1.5 : 0 }}>
                <Typography fontWeight={700} fontSize={14}>{event.label}</Typography>
                <Typography variant="caption" color="text.secondary">{event.time}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────

const DRAWER_TITLES = {
  trips: "تفاصيل رحلات اليوم",
  earnings: "تفاصيل أرباح اليوم",
  hours: "تفاصيل ساعات العمل",
  order: "تفاصيل الطلب",
};

export default function DriverDashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const rideOrdersData = useDriverRideOrders();
  const dashboard = useDriverDashboard({ user, rideOrdersData });

  const {
    driverStatus,
    dailyEarnings, driverStats,
    workSession, drawer, setDrawer, selectedOrder,
    mockActivity,
  } = dashboard;

  return (
    <Box dir="rtl" sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, minHeight: "100vh" }}>
        <SidebarNavigation />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AppHeader />

          <Box component="main" sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
              >
                <Outlet context={{ ...dashboard, user }} />
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      <DetailsDrawer
        isOpen={drawer !== null}
        onClose={() => setDrawer(null)}
        title={DRAWER_TITLES[drawer] ?? ""}
      >
        {drawer === "trips" && <TripsDetails trips={mockTrips} />}
        {drawer === "earnings" && <EarningsDetails earnings={dailyEarnings} />}
        {drawer === "hours" && <WorkingHoursDetails startTime={new Date(workSession.startedAt)} breakTime={driverStats.breakMinutes} status={driverStatus} activity={mockActivity} />}
        {drawer === "order" && selectedOrder && <OrderDetails order={selectedOrder} />}
      </DetailsDrawer>
    </Box>
  );
}
