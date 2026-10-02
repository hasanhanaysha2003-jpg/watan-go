import { Box, Button, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { cartStyles as s } from "../cart.styles";

function initials(name) {
  if (!name) return "؟";
  const words = name.trim().split(/\s+/);
  return words.length >= 2 ? words[0][0] + words[1][0] : words[0].slice(0, 2);
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }) {
  const isRestaurant = item.itemType === "restaurant";
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <Box sx={s.itemCard}>
      {/* Left: avatar + info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flex: 1,
          minWidth: 0,
        }}
      >
        <Avatar sx={s.itemAvatar}>{initials(item.itemName)}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Box
            component="span"
            sx={(theme) => s.itemTypeBadge(item.itemType, theme)}
          >
            {isRestaurant ? (
              <>
                <RestaurantIcon sx={{ fontSize: 10, mr: 0.5 }} />
                {item.restaurantName ?? "مطعم"}
              </>
            ) : (
              <>
                <StorefrontIcon sx={{ fontSize: 10, mr: 0.5 }} />
                السوق
              </>
            )}
          </Box>
          <Typography sx={s.itemName} noWrap>
            {item.itemName}
          </Typography>
          <Typography sx={s.itemPrice}>{lineTotal.toFixed(2)} ₪</Typography>
          <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
            {item.unitPrice.toFixed(2)} ₪ × {item.quantity}
          </Typography>
        </Box>
      </Box>

      {/* Right: quantity controls + delete */}
      <Box sx={s.qtyGroup}>
        <Button
          sx={s.qtyBtn}
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          aria-label="تقليل الكمية"
        >
          <RemoveIcon sx={{ fontSize: 16 }} />
        </Button>
        <Typography sx={s.qtyValue}>{item.quantity}</Typography>
        <Button
          sx={s.qtyBtn}
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          aria-label="زيادة الكمية"
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </Button>
        <Button
          sx={s.deleteBtn}
          onClick={() => onRemove(item.id)}
          aria-label="حذف المنتج"
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
        </Button>
      </Box>
    </Box>
  );
}
