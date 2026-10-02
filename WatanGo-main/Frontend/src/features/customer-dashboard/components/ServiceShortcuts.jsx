import { Box, Typography } from "@mui/material";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import { Link } from "react-router-dom";
import { dashboardStyles as s } from "../customer-dashboard.styles";

const SERVICES = [
  {
    to: "/restaurants",
    icon: <RestaurantOutlinedIcon />,
    title: "اطلب طعاماً",
    desc: "من مطاعم مدينتك",
    color: "warning",
  },
  {
    to: "/shops",
    icon: <StorefrontOutlinedIcon />,
    title: "تسوّق",
    desc: "من المحلات التجارية",
    color: "success",
  },
  {
    to: "/ride-request",
    icon: <DirectionsCarOutlinedIcon />,
    title: "احجز رحلة",
    desc: "سيارة في دقائق",
    color: "info",
  },
];

export default function ServiceShortcuts() {
  return (
    <Box sx={s.shortcutsGrid}>
      {SERVICES.map(({ to, icon, title, desc, color }) => (
        <Box key={to} component={Link} to={to} sx={s.shortcutCard(color)}>
          <Box sx={s.shortcutIcon(color)}>{icon}</Box>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: "text.primary" }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "text.secondary", mt: 0.3 }}>
              {desc}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
