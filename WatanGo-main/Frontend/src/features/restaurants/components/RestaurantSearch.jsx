import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { restaurantStyles as s } from "../restaurants.styles";

export function RestaurantSearch({ value, onChange }) {
  return (
    <Box sx={s.searchWrap}>
      <TextField
        fullWidth
        placeholder="ابحث عن مطعم..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
    </Box>
  );
}
