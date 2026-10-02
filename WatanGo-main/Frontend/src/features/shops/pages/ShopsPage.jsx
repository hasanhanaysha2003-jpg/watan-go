import { Box, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { shopStyles as s } from "../shops.styles";
import { useMarketItems } from "../hooks/use-market-items";
import { ShopFilters } from "../components/ShopFilters";
import { MarketItemGrid } from "../components/MarketItemGrid";
import { addCartItem } from "@/api/cart";
import { toast } from "sonner";

export default function ShopsPage() {
  const { items, loading, error, search, setSearch, inStock, setInStock } =
    useMarketItems();

  async function handleAddToCart(item) {
    const result = await addCartItem({ marketItemId: item.id, quantity: 1 });
    if (result.ok) {
      toast.success(`تمت إضافة "${item.name}" إلى السلة`);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Box sx={s.page}>
      <Box sx={s.gridOverlay} aria-hidden />

      {/* Hero */}
      <Box sx={s.hero}>
        <Box sx={s.heroEyebrow}>
          <StorefrontIcon sx={{ fontSize: 15 }} />
          السوق
        </Box>
        <Typography sx={s.heroTitle}>
          تسوّق من{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            ماركت المدينة.
          </Box>
        </Typography>
        <Typography sx={s.heroSubtitle}>
          أساسيات يومية، خضار، فواكه، وأكثر — مع توصيل سريع إلى باب منزلك.
        </Typography>
      </Box>

      {/* Filters */}
      <ShopFilters
        search={search}
        onSearch={setSearch}
        inStock={inStock}
        onInStock={setInStock}
      />

      {/* Grid */}
      <Box sx={s.gridSection}>
        <Typography sx={s.resultsCount}>
          {loading ? "جارٍ التحميل..." : `${items.length} منتج`}
        </Typography>
        <MarketItemGrid
          items={items}
          loading={loading}
          error={error}
          onAddToCart={handleAddToCart}
        />
      </Box>
    </Box>
  );
}
