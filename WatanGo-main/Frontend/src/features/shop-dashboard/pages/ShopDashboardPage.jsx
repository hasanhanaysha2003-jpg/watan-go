import { Box, Stack, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useAuth } from "@/lib/auth";
import { useShopMarketItems } from "../hooks/use-shop-market-items";
import { MarketItemsSection } from "../components/MarketItemsSection";

export default function ShopDashboardPage() {
  const { user } = useAuth();
  const ownerName = user?.name ?? "صاحب المتجر";
  const { items, loading, error, create, update, remove } = useShopMarketItems();

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }} dir="rtl">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
        <StorefrontIcon color="primary" sx={{ fontSize: 30 }} />
        <Typography variant="h4" fontWeight={800}>
          لوحة المتجر 🏪
        </Typography>
      </Stack>
      <Typography color="text.secondary" mb={3}>
        {ownerName} · أدر منتجاتك وطلبات التوصيل
      </Typography>

      {/* ── Market Items Management ────────────────────────────────────────── */}
      <MarketItemsSection
        items={items}
        loading={loading}
        error={error}
        create={create}
        update={update}
        remove={remove}
      />
    </Box>
  );
}
