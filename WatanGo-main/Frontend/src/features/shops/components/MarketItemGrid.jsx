import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { shopStyles as s } from "../shops.styles";
import { MarketItemCard } from "./MarketItemCard";

export function MarketItemGrid({ items, loading, error, onAddToCart }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={s.emptyBox}>
        <Box sx={s.emptyIcon}>
          <StorefrontIcon sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h6" fontWeight={700}>
          تعذّر تحميل المنتجات
        </Typography>
        <Typography color="text.secondary" fontSize={14}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={s.emptyBox}>
        <Box sx={s.emptyIcon}>
          <StorefrontIcon sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h6" fontWeight={700}>
          لا توجد منتجات مطابقة
        </Typography>
        <Typography color="text.secondary" fontSize={14}>
          جرّب تعديل كلمة البحث أو تغيير الفلاتر.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {items.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <MarketItemCard item={item} onAddToCart={onAddToCart} />
        </Grid>
      ))}
    </Grid>
  );
}
