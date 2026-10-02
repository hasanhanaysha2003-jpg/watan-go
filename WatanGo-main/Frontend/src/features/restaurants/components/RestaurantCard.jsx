import { Box, Button, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import { restaurantStyles as s } from "../restaurants.styles";
import {
  formatDeliveryFee,
  formatDeliveryTime,
  formatRating,
  getRestaurantInitials,
} from "../restaurants.utils";

export function RestaurantCard({ restaurant }) {
  return (
    <Box sx={s.card}>
      {/* Header */}
      <Box sx={s.cardHeader}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={s.cardName}>{restaurant.name}</Typography>
          <Typography sx={s.cardDescription}>
            {restaurant.description}
          </Typography>
        </Box>
        <Avatar sx={s.cardAvatar}>
          {getRestaurantInitials(restaurant.name)}
        </Avatar>
      </Box>

      {/* Meta chips */}
      <Stack direction="row" gap={1} sx={s.cardMeta}>
        <Box sx={s.metaChip}>
          <StarIcon sx={{ fontSize: 13 }} />
          {formatRating(restaurant.rating)}
        </Box>
        <Box sx={s.metaChip}>
          <AccessTimeIcon sx={{ fontSize: 13 }} />
          {formatDeliveryTime(
            restaurant.deliveryTimeMin,
            restaurant.deliveryTimeMax,
          )}
        </Box>
        <Box sx={s.metaChip}>
          <DeliveryDiningIcon sx={{ fontSize: 13 }} />
          رسوم {formatDeliveryFee(restaurant.deliveryFee)}
        </Box>
      </Stack>

      {/* Featured items */}
      {restaurant.mainItems?.length > 0 && (
        <Box sx={s.featuredBox}>
          <Typography sx={s.featuredLabel}>أبرز الأصناف</Typography>
          <Stack direction="row" gap={1} sx={{ flexWrap: "wrap" }}>
            {restaurant.mainItems.map((item) => (
              <Box key={item.id} sx={s.featuredItemChip}>
                {item.name}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Action */}
      <Box sx={s.cardActions}>
        <Button
          component={Link}
          to={`/menu/${restaurant.id}`}
          sx={s.browseButton}
        >
          تصفح القائمة
        </Button>
      </Box>
    </Box>
  );
}
