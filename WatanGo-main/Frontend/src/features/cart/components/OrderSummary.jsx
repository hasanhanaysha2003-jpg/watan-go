import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { cartStyles as s } from "../cart.styles";

export function OrderSummary({
  itemsSubtotal,
  deliveryFeesTotal,
  grandTotal,
  notes,
  onNotesChange,
  onCheckout,
  checkingOut,
  disabled,
}) {
  return (
    <Box sx={s.sidebar}>
      {/* Eyebrow */}
      <Box sx={s.sidebarEyebrow}>
        <ReceiptLongIcon sx={{ fontSize: 13 }} />
        ملخص الطلب
      </Box>

      <Typography sx={s.sidebarTitle}>تفاصيل الدفع</Typography>

      {/* Notes */}
      <TextField
        label="ملاحظات (اختياري)"
        placeholder="أي ملاحظات للمطعم أو السوق..."
        multiline
        minRows={2}
        fullWidth
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        sx={s.notesField}
        slotProps={{ htmlInput: { dir: "rtl" } }}
      />

      {/* Price breakdown */}
      <Divider sx={s.divider} />

      <Box sx={s.summaryRow}>
        <Typography sx={s.summaryLabel}>المجموع الفرعي</Typography>
        <Typography sx={s.summaryValue}>
          {itemsSubtotal.toFixed(2)} ₪
        </Typography>
      </Box>

      <Box sx={s.summaryRow}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <LocalShippingOutlinedIcon
            sx={{ fontSize: 16, color: "text.secondary" }}
          />
          <Typography sx={s.summaryLabel}>رسوم التوصيل</Typography>
        </Box>
        <Typography sx={s.summaryValue}>
          {deliveryFeesTotal.toFixed(2)} ₪
        </Typography>
      </Box>

      <Divider sx={s.divider} />

      <Box sx={s.totalRow}>
        <Typography sx={s.totalLabel}>الإجمالي</Typography>
        <Typography sx={s.totalValue}>{grandTotal.toFixed(2)} ₪</Typography>
      </Box>

      {/* Checkout */}
      <Button
        sx={s.checkoutBtn}
        onClick={onCheckout}
        disabled={disabled || checkingOut}
        startIcon={<CheckCircleIcon />}
      >
        {checkingOut ? "جارٍ التأكيد..." : "تأكيد الطلب"}
      </Button>
    </Box>
  );
}
