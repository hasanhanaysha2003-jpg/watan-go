import { Box, CircularProgress, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { cartStyles as s } from "../cart.styles";
import { CartItemCard } from "./CartItemCard";

export function CartItemList({
  items,
  loading,
  error,
  onUpdateQuantity,
  onRemove,
}) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={s.emptyBox}>
        <Box sx={s.emptyIcon}>
          <ShoppingCartOutlinedIcon sx={{ fontSize: 30 }} />
        </Box>
        <Typography variant="h6" fontWeight={700}>
          حدث خطأ
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </Box>
  );
}
