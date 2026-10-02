import { Box, Chip, Stack, Typography } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { OrderCard } from "./OrderCard";
import { s } from "../restaurant-dashboard.styles";

export function OrderSection({ title, description, orders, emptyText, renderActions }) {
  return (
    <Box sx={s.section}>
      <Box sx={s.sectionHead}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography sx={s.sectionTitle}>{title}</Typography>
            {orders.length > 0 && (
              <Chip
                label={orders.length}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: 11, fontWeight: 700, minWidth: 24 }}
              />
            )}
          </Stack>
          {description && <Typography sx={s.sectionSub}>{description}</Typography>}
        </Box>
      </Box>

      <Box sx={s.sectionBody}>
        {orders.length === 0 ? (
          <Box sx={s.empty}>
            <InventoryIcon sx={{ fontSize: 36, color: "text.disabled" }} />
            <Typography mt={1} color="text.secondary" fontSize={14}>
              {emptyText}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={renderActions(order)}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
