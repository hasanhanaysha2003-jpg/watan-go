import { Box, Chip, Stack, Typography } from "@mui/material";

const STATUS_CONFIG = {
  pending:          { label: "طلب جديد",        color: "warning" },
  accepted:         { label: "تم قبول الطلب",   color: "info" },
  preparing:        { label: "قيد التجهيز",      color: "warning" },
  ready_for_pickup: { label: "جاهز للاستلام",    color: "info" },
  picked_up:        { label: "تم الاستلام",      color: "secondary" },
  on_the_way:       { label: "في الطريق",        color: "secondary" },
  completed:        { label: "مكتمل",            color: "success" },
  delivered:        { label: "تم التوصيل",       color: "success" },
  cancelled:        { label: "مرفوض",            color: "error" },
};

export function ShopOrderCard({ order, actions }) {
  const chip = STATUS_CONFIG[order.status] ?? { label: order.status, color: "default" };

  const customerName =
    order.user?.name ?? order.customerName ?? order.userName ?? "عميل";
  const orderItems = Array.isArray(order.items) ? order.items : [];

  return (
    <Box
      component="article"
      sx={(theme) => ({
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          boxShadow: `0 4px 20px rgba(0,0,0,0.08)`,
          borderColor: "primary.light",
        },
      })}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.03)",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontWeight={800} fontSize={14} fontFamily="monospace" color="info.main">
            #{order.id}
          </Typography>
          <Box
            sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "text.disabled" }}
          />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {customerName}
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
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.03)",
            p: 1.5,
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            المنتجات والكميات
          </Typography>
          <Typography mt={0.5} fontSize={13} fontWeight={500}>
            {orderItems.length > 0
              ? orderItems
                  .map((item) => `${item.name ?? "عنصر"} × ${item.quantity ?? 1}`)
                  .join("، ")
              : "لا توجد عناصر"}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Typography fontSize={15} fontWeight={700} color="primary.main">
            {order.total} ₪
          </Typography>
        </Box>
      </Box>

      {/* Actions */}
      {actions && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
}
