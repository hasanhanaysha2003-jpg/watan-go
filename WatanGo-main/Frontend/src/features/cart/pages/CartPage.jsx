import { Box, Button, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Link } from "react-router-dom";
import { cartStyles as s } from "../cart.styles";
import { useCart } from "../hooks/use-cart";
import { CartItemList } from "../components/CartItemList";
import { OrderSummary } from "../components/OrderSummary";

export default function CartPage() {
  const {
    items,
    loading,
    error,
    checkingOut,
    notes,
    setNotes,
    itemsSubtotal,
    deliveryFeesTotal,
    grandTotal,
    handleUpdateQuantity,
    handleRemoveItem,
    handleCheckout,
  } = useCart();

  const isEmpty = !loading && !error && items.length === 0;

  return (
    <Box sx={s.page}>
      <Box sx={s.gridOverlay} aria-hidden />

      {/* Hero */}
      <Box sx={s.hero}>
        <Box sx={s.heroEyebrow}>
          <ShoppingCartOutlinedIcon sx={{ fontSize: 15 }} />
          السلة
        </Box>
        <Typography sx={s.heroTitle}>
          راجع طلبك{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            قبل التأكيد.
          </Box>
        </Typography>
        <Typography sx={s.heroSubtitle}>
          عدّل الكميات، احذف العناصر، ثم أرسل الطلب — سيصلك التأكيد فوراً.
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={s.contentSection}>
        {isEmpty ? (
          /* Empty state */
          <Box sx={s.emptyBox}>
            <Box sx={s.emptyIcon}>
              <ShoppingCartOutlinedIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight={800}>
              السلة فارغة
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 1 }}>
              أضف وجبات من المطاعم أو منتجات من السوق لتظهر هنا.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Button
                component={Link}
                to="/restaurants"
                startIcon={<RestaurantIcon />}
                sx={(theme) => s.emptyActionBtn("primary", theme)}
              >
                طلب طعام
              </Button>
              <Button
                component={Link}
                to="/shops"
                startIcon={<StorefrontIcon />}
                sx={(theme) => s.emptyActionBtn("secondary", theme)}
              >
                تسوّق من السوق
              </Button>
            </Box>
          </Box>
        ) : (
          /* Two-column layout */
          <Box sx={s.twoColumnGrid}>
            {/* Cart items */}
            <CartItemList
              items={items}
              loading={loading}
              error={error}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />

            {/* Order summary */}
            <OrderSummary
              itemsSubtotal={itemsSubtotal}
              deliveryFeesTotal={deliveryFeesTotal}
              grandTotal={grandTotal}
              notes={notes}
              onNotesChange={setNotes}
              onCheckout={handleCheckout}
              checkingOut={checkingOut}
              disabled={items.length === 0}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
