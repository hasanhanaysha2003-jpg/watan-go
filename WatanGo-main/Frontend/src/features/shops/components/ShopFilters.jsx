import { Box, InputAdornment, Stack, TextField } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import { shopStyles as s } from "../shops.styles";

export function ShopFilters({ search, onSearch, inStock, onInStock }) {
  return (
    <Box sx={s.filtersWrap}>
      <TextField
        fullWidth
        placeholder="ابحث عن منتج..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        sx={s.searchField}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.disabled", fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Stack direction="row" gap={1} mt={2}>
        <Box
          component="span"
          sx={(theme) => s.inStockToggle(inStock, theme)}
          onClick={() => onInStock(!inStock)}
        >
          <InventoryIcon sx={{ fontSize: 14 }} />
          متوفر فقط
        </Box>
      </Stack>
    </Box>
  );
}
