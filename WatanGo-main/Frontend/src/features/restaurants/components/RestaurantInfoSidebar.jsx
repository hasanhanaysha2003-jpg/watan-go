import { Box, Divider, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import StarIcon from "@mui/icons-material/Star";
import { restaurantStyles as s } from "../restaurants.styles";
import {
  formatDeliveryFee,
  formatDeliveryTime,
  formatRating,
  getRestaurantInitials,
} from "../restaurants.utils";

export function RestaurantInfoSidebar({ restaurant }) {
  const rows = [
    {
      icon: <StarIcon sx={{ fontSize: 16, color: "warning.main" }} />,
      label: "التقييم",
      value: formatRating(restaurant.rating),
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 16, color: "info.main" }} />,
      label: "وقت التوصيل",
      value: formatDeliveryTime(
        restaurant.deliveryTimeMin,
        restaurant.deliveryTimeMax,
      ),
    },
    {
      icon: <DeliveryDiningIcon sx={{ fontSize: 16, color: "primary.main" }} />,
      label: "رسوم التوصيل",
      value: formatDeliveryFee(restaurant.deliveryFee),
    },
  ];

  return (
    <Box sx={s.sidebar}>
      {/* Hero banner */}
      <Box sx={s.sidebarHero}>
        <Typography fontSize={52} sx={{ lineHeight: 1 }}>
          {getRestaurantInitials(restaurant.name)}
        </Typography>
      </Box>

      <Box sx={s.sidebarContent}>
        <Typography fontWeight={800} fontSize={20} mb={0.5}>
          {restaurant.name}
        </Typography>
        {restaurant.description && (
          <Typography
            fontSize={13}
            color="text.secondary"
            mb={2}
            sx={{ lineHeight: 1.7 }}
          >
            {restaurant.description}
          </Typography>
        )}

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.5}>
          {rows.map((row) => (
            <Box key={row.label} sx={s.sidebarRow}>
              <Box sx={s.sidebarRowLabel}>
                {row.icon}
                {row.label}
              </Box>
              <Typography sx={s.sidebarRowValue}>{row.value}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
