import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link, useParams } from "react-router-dom";
import { restaurantStyles as s } from "../restaurants.styles";
import { useRestaurantDetail } from "../hooks/use-restaurant-detail";
import { RestaurantInfoSidebar } from "../components/RestaurantInfoSidebar";
import { MenuItemCard } from "../components/MenuItemCard";
import { addCartItem } from "@/api/cart";
import { toast } from "sonner";

export default function RestaurantMenuPage() {
  const params = useParams();
  const resolvedId = params.restaurantId ?? params.id;
  const { restaurant, loading, error } = useRestaurantDetail(resolvedId);

  async function handleAddToCart(item) {
    const result = await addCartItem({
      restaurantItemId: item.id,
      quantity: 1,
    });
    if (result.ok) {
      toast.success(`تمت إضافة "${item.name}" إلى السلة`);
    } else {
      toast.error(result.message);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 16 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Box
        sx={{ maxWidth: 560, mx: "auto", textAlign: "center", py: 16, px: 3 }}
      >
        <Typography variant="h5" fontWeight={700} mb={1}>
          المطعم غير موجود
        </Typography>
        <Typography color="text.secondary" mb={3} fontSize={14}>
          {error ?? "لم نتمكن من العثور على هذا المطعم."}
        </Typography>
        <Button
          component={Link}
          to="/restaurants"
          startIcon={<ArrowForwardIcon />}
        >
          العودة إلى المطاعم
        </Button>
      </Box>
    );
  }

  const mainItems = restaurant.items?.filter((i) => i.isMain) ?? [];
  const regularItems = restaurant.items?.filter((i) => !i.isMain) ?? [];

  return (
    <Box sx={s.menuPage}>
      <Box sx={s.menuLayout}>
        {/* Top navigation */}
        <Stack direction="row" gap={1.5} pt={4} pb={3} sx={{ flexWrap: "wrap" }}>
          <Button
            component={Link}
            to="/restaurants"
            startIcon={<ArrowForwardIcon />}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2, textTransform: "none", fontSize: 13 }}
          >
            المطاعم
          </Button>
          <Button
            component={Link}
            to="/cart"
            startIcon={<ShoppingCartIcon />}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2, textTransform: "none", fontSize: 13 }}
          >
            السلة
          </Button>
        </Stack>

        <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <RestaurantInfoSidebar restaurant={restaurant} />
          </Grid>

          {/* Menu content */}
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            {/* Featured items */}
            {mainItems.length > 0 && (
              <Box sx={s.menuSectionCard}>
                <Box sx={s.sectionLabel}>
                  <StarBorderIcon sx={{ fontSize: 13 }} />
                  أبرز الأصناف
                </Box>
                <Typography sx={s.sectionTitle}>الأصناف المميزة</Typography>
                <Grid container spacing={2}>
                  {mainItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
                      <MenuItemCard item={item} onAddToCart={handleAddToCart} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Divider if both sections exist */}
            {mainItems.length > 0 && regularItems.length > 0 && (
              <Divider sx={{ my: 1 }} />
            )}

            {/* Regular items */}
            {regularItems.length > 0 && (
              <Box sx={s.menuSectionCard}>
                <Box sx={s.sectionLabel}>
                  <MenuBookIcon sx={{ fontSize: 13 }} />
                  القائمة الكاملة
                </Box>
                <Typography sx={s.sectionTitle}>جميع الأصناف</Typography>
                <Grid container spacing={2}>
                  {regularItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
                      <MenuItemCard item={item} onAddToCart={handleAddToCart} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {restaurant.items?.length === 0 && (
              <Box sx={s.emptyBox}>
                <Typography color="text.secondary">
                  لا توجد أصناف في هذا المطعم بعد.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
