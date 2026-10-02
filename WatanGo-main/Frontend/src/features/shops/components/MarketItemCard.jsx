import { Box, Button, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { shopStyles as s } from "../shops.styles";

function initials(name) {
  if (!name) return "م";
  const words = name.trim().split(/\s+/);
  return words.length >= 2 ? words[0][0] + words[1][0] : words[0].slice(0, 2);
}

export function MarketItemCard({ item, onAddToCart }) {
  const outOfStock = item.quantity === 0;

  return (
    <Box sx={s.itemCard} style={{ opacity: outOfStock ? 0.65 : 1 }}>
      {/* Top: avatar + info */}
      <Box sx={s.itemCardHeader}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {outOfStock && (
            <Box component="span" sx={s.outOfStockBadge}>
              نفد المخزون
            </Box>
          )}
          <Typography sx={s.itemName}>{item.name}</Typography>
          {item.description && (
            <Typography sx={s.itemDesc}>{item.description}</Typography>
          )}
        </Box>
        <Avatar sx={s.itemAvatar}>{initials(item.name)}</Avatar>
      </Box>

      {/* Divider */}
      <Box sx={s.itemDivider} />

      {/* Rating on one end, price on the other */}
      <Box sx={s.itemFooter}>
        <Box sx={s.ratingChip}>
          <StarIcon sx={{ fontSize: 13, color: "warning.main" }} />
          {Number(item.rating).toFixed(1)}
        </Box>
        <Typography sx={s.priceText}>{item.price} شيكل</Typography>
      </Box>

      {/* Add to cart */}
      <Button
        variant="contained"
        disabled={outOfStock}
        onClick={() => onAddToCart(item)}
        startIcon={<ShoppingCartIcon sx={{ fontSize: 18 }} />}
        sx={s.addButton}
      >
        إضافة للسلة
      </Button>
    </Box>
  );
}
