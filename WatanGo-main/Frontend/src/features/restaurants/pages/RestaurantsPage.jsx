import { Box, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { restaurantStyles as s } from "../restaurants.styles";
import { useRestaurants } from "../hooks/use-restaurants";
import { RestaurantSearch } from "../components/RestaurantSearch";
import { RestaurantGrid } from "../components/RestaurantGrid";

export default function RestaurantsPage() {
  const { restaurants, loading, error, search, setSearch } = useRestaurants();

  return (
    <Box sx={s.page}>
      {/* Grid overlay */}
      <Box sx={s.gridOverlay} aria-hidden />

      {/* Hero */}
      <Box sx={s.hero}>
        <Box sx={s.heroEyebrow}>
          <StorefrontIcon sx={{ fontSize: 15 }} />
          المطاعم
        </Box>
        <Typography sx={s.heroTitle}>
          اختر مطعمك{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            واطلب فورًا.
          </Box>
        </Typography>
        <Typography sx={s.heroSubtitle}>
          تصفح أفضل المطاعم وتمتع بتوصيل سريع إلى باب منزلك.
        </Typography>
      </Box>

      {/* Search */}
      <RestaurantSearch value={search} onChange={setSearch} />

      {/* Grid */}
      <RestaurantGrid
        restaurants={restaurants}
        loading={loading}
        error={error}
      />
    </Box>
  );
}
