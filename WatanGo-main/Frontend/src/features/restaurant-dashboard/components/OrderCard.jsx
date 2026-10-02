import { Box, Chip, Stack, Typography } from "@mui/material";
import { s } from "../restaurant-dashboard.styles";

const STATUS_CONFIG = {
  pending:          { label: "طلب جديد",           color: "warning" },
  accepted:         { label: "مقبول",              color: "info" },
  preparing:        { label: "قيد التحضير",         color: "warning" },
  ready_for_pickup: { label: "جاهز للاستلام",       color: "info" },
  picked_up:        { label: "تم الاستلام بالسائق", color: "secondary" },
  on_the_way:       { label: "مع السائق",           color: "secondary" },
  completed:        { label: "مكتمل",              color: "success" },
  cancelled:        { label: "مرفوض",              color: "error" },
};

function parseUtc(str) {
  if (!str) return new Date(NaN);
  const s = String(str);
  return new Date(/Z$|[+-]\d{2}:?\d{2}$/.test(s) ? s : s + "Z");
}

function formatOrderTime(value) {
  try {
    return new Intl.DateTimeFormat("ar", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    }).format(parseUtc(value));
  } catch {
    return value;
  }
}

export function OrderCard({ order, actions }) {
  const chip = STATUS_CONFIG[order.status] ?? { label: order.status, color: "default" };

  return (
    <Box component="article" sx={s.orderCard}>
      {/* Header */}
      <Box sx={s.orderCardHead}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography fontWeight={800} fontSize={14} fontFamily="monospace" color="info.main">
            #{order.id}
          </Typography>
          <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "text.disabled" }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {order.customerName}
          </Typography>
        </Stack>
        <Chip
          label={chip.label}
          color={chip.color}
          size="small"
          sx={{ fontWeight: 700, height: 22, fontSize: 12 }}
        />
      </Box>

      {/* Body */}
      <Box sx={s.orderCardBody}>
        <Typography variant="caption" color="text.secondary">
          {formatOrderTime(order.createdAt)}
        </Typography>

        {/* Items */}
        <Box sx={{ ...s.orderInfoBox, mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            الوجبات والكميات
          </Typography>
          <Typography mt={0.5} fontSize={13} fontWeight={500}>
            {order.items?.map((i) => `${i.itemName} × ${i.quantity}`).join("، ")}
          </Typography>
        </Box>

        {/* Notes + Total */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mt: 1.5 }}>
          <Box sx={s.orderInfoBox}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              ملاحظات العميل
            </Typography>
            <Typography mt={0.5} fontSize={13}>
              {order.notes || "لا توجد ملاحظات"}
            </Typography>
          </Box>
          <Box sx={s.orderInfoBox}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              الإجمالي
            </Typography>
            <Typography mt={0.5} fontSize={14} fontWeight={700} color="primary.main">
              {order.totalPrice} ₪
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Actions */}
      {actions ? <Box sx={s.orderCardFoot}>{actions}</Box> : null}
    </Box>
  );
}
