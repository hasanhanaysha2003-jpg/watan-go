import { Box, Button, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { restaurantStyles as s } from "../restaurants.styles";
import { formatPrice } from "../restaurants.utils";

export function MenuItemCard({ item, onAddToCart }) {
  return (
    <Box sx={s.menuItemCard}>
      <Stack direction="row" gap={2} sx={{ alignItems: "flex-start" }}>
        <Avatar sx={s.menuItemAvatar}>
          <RestaurantMenuIcon fontSize="small" />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            gap={1}
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
          >
            <Typography sx={s.menuItemName}>{item.name}</Typography>
            <Box sx={s.priceChip}>{formatPrice(item.price)}</Box>
          </Stack>
          {item.description && (
            <Typography sx={s.menuItemDesc}>{item.description}</Typography>
          )}
        </Box>
      </Stack>

      <Button
        fullWidth
        startIcon={<AddIcon />}
        onClick={() => onAddToCart(item)}
        sx={s.addButton}
        disabled={!item.isAvailable}
      >
        {item.isAvailable ? "إضافة للسلة" : "غير متاح"}
      </Button>
    </Box>
  );
}
