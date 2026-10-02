import { useMemo, useState } from "react";
import {
  Box, Button, Chip, Stack, Tab, Tabs, Tooltip, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useNavigate, useOutletContext } from "react-router-dom";

// ── Two tabs only — no "Active" tab ──────────────────────────────────────────
const ORDER_TABS = [
  { value: "incoming", label: "الطلبات الواردة" },
  { value: "completed", label: "مكتملة" },
];

// Chip shown on cards that are already accepted/in-progress
const ACTIVE_STATUS_CHIP = {
  accepted:       { label: "مقبول",          color: "info"      },
  preparing:      { label: "قيد التحضير",    color: "warning"   },
  readyforpickup: { label: "جاهز للاستلام",  color: "warning"   },
  pickedup:       { label: "تم الاستلام",    color: "secondary" },
  ontheway:       { label: "في الطريق",      color: "primary"   },
};

// Button label for advancing an active order.
// Two-step flow: استلام الطلب أولاً (تظهر الخريطة) ثم تسليمه للعميل.
const NEXT_STAGE_LABEL = {
  readyforpickup: "تم الاستلام",
  pickedup:       "تم التسليم",
  ontheway:       "تم التسليم",
};

// Statuses where the live-tracking map is available (driver ↔ customer location)
const TRACKABLE_STATUS_KEYS = ["pickedup", "ontheway"];

const EMPTY_MESSAGES = {
  incoming:  "لا توجد طلبات واردة",
  completed: "لا توجد طلبات مكتملة",
};

function normalizeStatusKey(raw) {
  return String(raw ?? "").toLowerCase().replace(/[_\s]/g, "");
}

export default function DriverOrdersPage() {
  const navigate = useNavigate();
  const {
    orders,
    handleAcceptShopOrder,
    handleRejectShopOrder,
    handleAdvanceOrderStage,
  } = useOutletContext();

  const [tab, setTab] = useState("incoming");

  // "incoming" = new + active orders; "completed" = completed orders
  const grouped = useMemo(() => ({
    incoming:  orders.filter((o) => o.status === "new" || o.status === "active"),
    completed: orders.filter((o) => o.status === "completed"),
  }), [orders]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" fontWeight={700}>إدارة الطلبات</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          تابع الطلبات الواردة وسجل الطلبات المكتملة من مكان واحد.
        </Typography>
      </Box>

      <Box sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        {/* ── Tab bar ── */}
        <Tabs
          value={tab}
          onChange={(_, val) => setTab(val)}
          variant="fullWidth"
          sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3) }}
        >
          {ORDER_TABS.map((t) => (
            <Tab
              key={t.value}
              value={t.value}
              label={
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                  <span>{t.label}</span>
                  <Chip
                    label={grouped[t.value].length}
                    size="small"
                    color={tab === t.value ? "primary" : "default"}
                    sx={{ height: 18, fontSize: 11 }}
                  />
                </Stack>
              }
              sx={{ fontWeight: 600, fontSize: 13, minHeight: 52 }}
            />
          ))}
        </Tabs>

        {/* ── Tab content ── */}
        <Box sx={{ p: 2 }}>
          {grouped[tab].length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 2.5, bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3) }}>
              <InventoryIcon sx={{ fontSize: 40, color: "text.disabled" }} />
              <Typography fontWeight={700} mt={1.5}>
                {EMPTY_MESSAGES[tab]} حالياً
              </Typography>
              <Typography variant="caption" color="text.secondary">ستظهر الطلبات هنا عند توفرها.</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {grouped[tab].map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAccept={() => handleAcceptShopOrder(order.id)}
                  onReject={() => handleRejectShopOrder(order.id)}
                  onAdvance={() => handleAdvanceOrderStage(order.id)}
                  onTrack={() => navigate(`/orders/${order._rawId}/tracking`)}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Stack>
  );
}

// ── Order card ────────────────────────────────────────────────────────────────

function OrderCard({ order, onAccept, onReject, onAdvance, onTrack }) {
  const statusKey   = normalizeStatusKey(order._rawStatus);
  const activeChip  = ACTIVE_STATUS_CHIP[statusKey];
  const nextLabel   = NEXT_STAGE_LABEL[statusKey];
  const isFinal     = TRACKABLE_STATUS_KEYS.includes(statusKey); // delivering → next click completes
  const isTrackable = TRACKABLE_STATUS_KEYS.includes(statusKey); // live map available

  const headerChip =
    order.status === "completed"
      ? { label: "مكتمل", color: "success" }
      : order.status === "active"
        ? (activeChip ?? { label: "نشط", color: "primary" })
        : { label: "جديد", color: "info" };

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": { boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.1)}`, borderColor: alpha(theme.palette.primary.main, 0.4) },
      })}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2, py: 1.25,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid", borderColor: "divider",
          bgcolor: (theme) => alpha(theme.palette.action.hover, 0.35),
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography fontWeight={800} fontSize={14} letterSpacing={0.3}>{order.id}</Typography>
          <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "text.disabled" }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{order.customerName}</Typography>
        </Stack>
        <Chip label={headerChip.label} color={headerChip.color} size="small" sx={{ fontWeight: 700, height: 22, fontSize: 12 }} />
      </Box>

      {/* Route */}
      <Box sx={{ px: 2, pt: 1.75, pb: 1.5 }}>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 0.15, flexShrink: 0 }}>
            <LocationOnIcon color="info" sx={{ fontSize: 18 }} />
            <Box sx={(theme) => ({
              width: "2px", flex: 1, my: 0.5, minHeight: 18, bgcolor: alpha(theme.palette.divider, 1),
              borderRadius: 1,
              backgroundImage: `repeating-linear-gradient(to bottom, ${theme.palette.divider} 0px, ${theme.palette.divider} 4px, transparent 4px, transparent 8px)`,
            })} />
            <LocationOnOutlinedIcon color="primary" sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box mb={1.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>نقطة الاستلام</Typography>
              <Typography fontWeight={700} fontSize={13} noWrap>{order.pickupLocation}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>نقطة التسليم</Typography>
              <Typography fontWeight={700} fontSize={13} noWrap>{order.deliveryLocation}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Meta pills */}
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap" }} mt={1.75}>
          {[
            { icon: <LocationOnIcon sx={{ fontSize: 12 }} />, value: `${order.distance} كم` },
            { icon: null, value: `${order.price} شيكل` },
            { icon: null, value: order.orderTime },
          ].map((pill, i) => (
            <Box
              key={i}
              sx={(theme) => ({
                display: "inline-flex", alignItems: "center", gap: 0.5,
                borderRadius: 10, border: "1px solid", borderColor: "divider",
                bgcolor: alpha(theme.palette.action.hover, 0.5),
                px: 1.25, py: 0.4, fontSize: 12, color: "text.secondary", fontWeight: 500,
              })}
            >
              {pill.icon} {pill.value}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Actions footer */}
      <Box
        sx={{
          px: 2, py: 1.25,
          borderTop: "1px solid", borderColor: "divider",
          bgcolor: (theme) => alpha(theme.palette.action.hover, 0.2),
          display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center",
        }}
      >
        {/* New order — Accept / Reject */}
        {order.status === "new" && (
          <>
            <Button
              variant="contained" color="primary"
              startIcon={<CheckCircleOutlineIcon />}
              size="small" sx={{ borderRadius: 2, fontWeight: 600, px: 1.75 }}
              onClick={onAccept}
            >
              قبول
            </Button>
            <Button
              variant="outlined" color="error"
              startIcon={<CancelOutlinedIcon />}
              size="small" sx={{ borderRadius: 2, fontWeight: 600, px: 1.75 }}
              onClick={onReject}
            >
              رفض
            </Button>
          </>
        )}

        {/* Active order — advance stage button */}
        {order.status === "active" && nextLabel && (
          <Button
            variant="contained"
            color={isFinal ? "success" : "primary"}
            startIcon={isFinal ? <CheckCircleOutlineIcon /> : null}
            size="small" sx={{ borderRadius: 2, fontWeight: 600, px: 1.75 }}
            onClick={onAdvance}
          >
            {nextLabel}
          </Button>
        )}

        {/* Active + trackable order — live map button (driver ↔ customer location) */}
        {order.status === "active" && isTrackable && (
          <Tooltip title="عرض الخريطة المباشرة لموقع العميل" arrow>
            <Button
              variant="outlined"
              color="info"
              size="small"
              startIcon={<MapOutlinedIcon sx={{ fontSize: 18 }} />}
              sx={{ borderRadius: 2, fontWeight: 600, px: 1.75 }}
              onClick={onTrack}
            >
              الخريطة
            </Button>
          </Tooltip>
        )}

        {/* Completed order */}
        {order.status === "completed" && (
          <Typography variant="caption" color="success.main" fontWeight={700} sx={{ py: 0.5 }}>
            ✓ تم التسليم بنجاح
          </Typography>
        )}
      </Box>
    </Box>
  );
}
