import { Box, Typography } from "@mui/material";
import { rideStyles as s } from "../rides.styles";

const INTERNAL_PRICE = 10;
const EXTERNAL_PRICE_PER_KM = 3;

export function TripSummary({ distanceKm, deliveryType, price, duration }) {
  return (
    <Box sx={s.summaryBox}>
      {/* Delivery type card */}
      <Box sx={s.deliveryTypeBadge(deliveryType)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontSize: 22, lineHeight: 1 }}>
              {deliveryType === "internal"
                ? "🏙️"
                : deliveryType === "external"
                  ? "🛣️"
                  : "📍"}
            </Typography>
            <Box>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                نوع التوصيل
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color:
                    deliveryType === "internal"
                      ? "info.main"
                      : deliveryType === "external"
                        ? "primary.main"
                        : "text.secondary",
                }}
              >
                {deliveryType === "internal"
                  ? "توصيل داخلي — نفس المدينة"
                  : deliveryType === "external"
                    ? "توصيل خارجي — مدينة مختلفة"
                    : "جارٍ التحقق من الموقعين…"}
              </Typography>
            </Box>
          </Box>
          {deliveryType && (
            <Box sx={s.deliveryTypePill(deliveryType)}>
              {deliveryType === "internal"
                ? `ثابت ${INTERNAL_PRICE} ₪`
                : `${EXTERNAL_PRICE_PER_KM} ₪ / كم`}
            </Box>
          )}
        </Box>
        {!deliveryType && (
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 1 }}>
            حدّد نقطة الانطلاق والوجهة عبر GPS لتحديد نوع التوصيل تلقائياً.
          </Typography>
        )}
      </Box>

      {/* Distance · Duration · Price */}
      <Box sx={s.statsGrid}>
        <Box sx={s.statCard}>
          <Typography sx={s.statLabel}>المسافة التقديرية</Typography>
          <Typography sx={s.statValue}>
            {distanceKm !== null ? `${distanceKm.toFixed(1)} كم` : "—"}
          </Typography>
        </Box>
        <Box sx={s.statCard}>
          <Typography sx={s.statLabel}>المدة المتوقعة</Typography>
          <Typography sx={s.statValue}>{duration ?? "—"}</Typography>
        </Box>
        <Box sx={price !== null ? s.statCardHighlight : s.statCard}>
          <Typography sx={s.statLabel}>السعر التقديري</Typography>
          <Typography
            sx={[
              s.statValue,
              { color: price !== null ? "primary.main" : "text.primary" },
            ]}
          >
            {price !== null ? `${price} ₪` : "—"}
          </Typography>
          {deliveryType === "internal" && (
            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>
              سعر ثابت داخل المدينة = {INTERNAL_PRICE} ₪
            </Typography>
          )}
          {deliveryType === "external" && distanceKm !== null && (
            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>
              {distanceKm.toFixed(1)} كم × {EXTERNAL_PRICE_PER_KM} ₪/كم ={" "}
              {price} ₪
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
