import { Box, CircularProgress, Typography } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import MapIcon from "@mui/icons-material/Map";
import CloseIcon from "@mui/icons-material/Close";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { rideStyles as s } from "../rides.styles";

export function PickupField({ pickup, onGPS, onOpenMap, onClear }) {
  return (
    <Box sx={pickup.error ? s.locationBoxError : s.locationBox}>
      <Box sx={s.locationHeader}>
        <Box sx={[s.locationLabel, { color: "info.main" }]}>
          <NavigationIcon sx={{ fontSize: 16 }} />
          نقطة الانطلاق
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box
            component="button"
            onClick={onOpenMap}
            sx={s.actionButton("primary")}
          >
            <MapIcon sx={{ fontSize: 14 }} />
            الخريطة
          </Box>
          <Box
            component="button"
            onClick={onGPS}
            disabled={pickup.loading}
            sx={s.actionButton("info")}
          >
            {pickup.loading ? (
              <CircularProgress size={12} color="inherit" />
            ) : (
              <MyLocationIcon sx={{ fontSize: 14 }} />
            )}
            موقعي الحالي
          </Box>
        </Box>
      </Box>

      {pickup.address ? (
        <Box sx={s.addressRow}>
          <Typography sx={s.addressText}>{pickup.address}</Typography>
          <Box component="button" onClick={onClear} sx={s.clearButton}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      ) : !pickup.loading && !pickup.error ? (
        <Typography sx={s.placeholderText}>
          اضغط «موقعي الحالي» لتحديد نقطة الانطلاق تلقائياً
        </Typography>
      ) : null}

      {pickup.loading && (
        <Box sx={[s.statusRow, { color: "text.secondary" }]}>
          <CircularProgress size={12} color="inherit" />
          جارٍ تحديد الموقع...
        </Box>
      )}

      {pickup.error && !pickup.loading && (
        <Box sx={[s.statusRow, { color: "error.main" }]}>
          <ReportProblemIcon sx={{ fontSize: 14 }} />
          {pickup.error}
        </Box>
      )}
    </Box>
  );
}
