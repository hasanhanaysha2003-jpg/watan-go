import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { restaurantStyles as s } from "../restaurants.styles";
import { RestaurantCard } from "./RestaurantCard";

export function RestaurantGrid({ restaurants, loading, error }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={s.emptyBox}>
        <Box sx={s.emptyIcon}>
          <StorefrontIcon fontSize="large" />
        </Box>
        <Typography variant="h6" fontWeight={700}>
          حدث خطأ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Box sx={s.emptyBox}>
        <Box sx={s.emptyIcon}>
          <StorefrontIcon fontSize="large" />
        </Box>
        <Typography variant="h6" fontWeight={700}>
          لا توجد مطاعم متاحة
        </Typography>
        <Typography variant="body2" color="text.secondary">
          حاول تغيير كلمة البحث أو العودة لاحقاً.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={s.gridSection}>
      <Typography sx={s.resultsCount}>
        {restaurants.length} مطعم متاح
      </Typography>
      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid key={restaurant.id} size={{ xs: 12, md: 6, xl: 4 }}>
            <RestaurantCard restaurant={restaurant} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
