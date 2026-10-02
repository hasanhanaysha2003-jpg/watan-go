import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useDriverEarnings } from "../hooks/use-driver-earnings";

export default function DriverEarningsPage() {
  const { earnings, isLoading, error } = useDriverEarnings();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" fontWeight={700}>الأرباح</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          سجل أرباحك من الطلبات والرحلات المكتملة.
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && (
        <Box sx={{ py: 4, textAlign: "center", border: "1px dashed", borderColor: "error.light", borderRadius: 3 }}>
          <Typography color="error.main" fontWeight={700}>{error}</Typography>
        </Box>
      )}

      {!isLoading && earnings && (
        <>
          {/* ── Today's earnings banner ── */}
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
              {earnings.todayTotal.toFixed(0)} شيكل
            </Typography>
            {earnings.todayTotal === 0 && (
              <Typography variant="caption" color="text.secondary">لا توجد أرباح اليوم.</Typography>
            )}
          </Box>

          {/* ── Summary cards ── */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            {[
              { label: "طلبات مكتملة اليوم", value: earnings.todayCompletedCount, color: "info.main" },
              { label: "إجمالي الأرباح الكلي", value: `${earnings.allTimeTotal.toFixed(0)} ₪`, color: "primary.main" },
            ].map((card) => (
              <Box key={card.label} sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3), p: 2 }}>
                <Typography variant="body2" color="text.secondary">{card.label}</Typography>
                <Typography variant="h5" fontWeight={700} color={card.color} mt={1}>{card.value}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── Earnings history ── */}
          <Box>
            <Stack direction="row" spacing={1} mb={1.5} sx={{ alignItems: "center" }}>
              <Typography variant="subtitle1" fontWeight={700}>سجل الأرباح</Typography>
              {earnings.allTimeCompletedCount > 0 && (
                <Chip label={earnings.allTimeCompletedCount} size="small" color="primary" />
              )}
            </Stack>

            {earnings.items.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.action.hover, 0.3) }}>
                <InventoryIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                <Typography fontWeight={700} mt={1.5}>لا توجد أرباح بعد</Typography>
                <Typography variant="caption" color="text.secondary">ستظهر هنا بعد إتمام أول طلب أو رحلة.</Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {earnings.items.map((item, i) => (
                  <EarningItemCard key={`${item.displayId}-${i}`} item={item} />
                ))}
              </Stack>
            )}
          </Box>
        </>
      )}
    </Stack>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function parseUtc(str) {
  if (!str) return new Date(NaN);
  const s = String(str);
  return new Date(/Z$|[+-]\d{2}:?\d{2}$/.test(s) ? s : s + "Z");
}

function EarningItemCard({ item }) {
  const isRide = item.type === "ride";
  const time = parseUtc(item.completedAt).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });
  const date = parseUtc(item.completedAt).toLocaleDateString("ar", { dateStyle: "medium" });

  return (
    <Box sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", p: 2 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} mb={0.5} sx={{ alignItems: "center" }}>
            <Typography fontWeight={700} color="info.main">{item.displayId}</Typography>
            <Chip
              label={isRide ? "رحلة" : "توصيل"}
              size="small"
              color={isRide ? "info" : "primary"}
              variant="outlined"
            />
          </Stack>
          <Typography variant="body2" fontWeight={600} noWrap>{item.pickupFrom}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>إلى {item.deliverTo}</Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {date} · {time}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ ml: 2, flexShrink: 0 }}>
          {item.amount.toFixed(0)} ₪
        </Typography>
      </Stack>
    </Box>
  );
}
