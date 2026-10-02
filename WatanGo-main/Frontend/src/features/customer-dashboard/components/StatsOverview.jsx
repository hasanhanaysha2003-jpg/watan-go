import { Box, CircularProgress, Typography } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { dashboardStyles as s } from "../customer-dashboard.styles";

const STATS = [
  {
    key: "totalOrders",
    label: "الطلبات",
    icon: <ShoppingBagOutlinedIcon fontSize="small" />,
    color: "warning",
  },
  {
    key: "totalRides",
    label: "الرحلات",
    icon: <DirectionsCarOutlinedIcon fontSize="small" />,
    color: "info",
  },
  {
    key: "totalSpent",
    label: "إجمالي المصروف",
    icon: <AccountBalanceWalletOutlinedIcon fontSize="small" />,
    color: "success",
    suffix: " ₪",
  },
];

export default function StatsOverview({ stats, loading }) {
  return (
    <Box sx={s.statsGrid}>
      {STATS.map(({ key, label, icon, color, suffix }) => (
        <Box key={key} sx={s.statCard(color)}>
          <Box sx={s.statIcon(color)}>{icon}</Box>
          {loading ? (
            <CircularProgress size={24} color={color} sx={{ mb: 0.5 }} />
          ) : (
            <Typography sx={s.statValue}>
              {key === "totalSpent"
                ? Number(stats?.[key] ?? 0).toFixed(0)
                : (stats?.[key] ?? 0)}
              {suffix}
            </Typography>
          )}
          <Typography sx={s.statLabel}>{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}
