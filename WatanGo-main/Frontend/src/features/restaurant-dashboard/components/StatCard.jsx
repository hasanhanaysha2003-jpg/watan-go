import { Box, Typography } from "@mui/material";
import { s } from "../restaurant-dashboard.styles";

export function StatCard({ label, value, colorKey }) {
  return (
    <Box sx={s.statCard}>
      <Typography sx={s.statLabel}>{label}</Typography>
      <Typography sx={s.statValue(colorKey)}>{value}</Typography>
    </Box>
  );
}
