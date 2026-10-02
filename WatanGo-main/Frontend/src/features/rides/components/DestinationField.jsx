import { Box, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import MapIcon from "@mui/icons-material/Map";
import CloseIcon from "@mui/icons-material/Close";
import { rideStyles as s } from "../rides.styles";

export function DestinationField({ destination, onOpenMap, onClear }) {
  return (
    <Box sx={s.locationBox}>
      <Box sx={s.locationHeader}>
        <Box sx={[s.locationLabel, { color: "primary.main" }]}>
          <PlaceIcon sx={{ fontSize: 16 }} />
          الوجهة
        </Box>
        <Box
          component="button"
          onClick={onOpenMap}
          sx={s.actionButton("primary")}
        >
          <MapIcon sx={{ fontSize: 14 }} />
          اختر على الخريطة
        </Box>
      </Box>

      {destination.address ? (
        <Box sx={s.addressRow}>
          <Typography sx={s.addressText}>{destination.address}</Typography>
          <Box component="button" onClick={onClear} sx={s.clearButton}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      ) : (
        <Typography
          onClick={onOpenMap}
          sx={[
            s.placeholderText,
            { cursor: "pointer", "&:hover": { color: "text.primary" } },
          ]}
        >
          انقر لاختيار الوجهة على الخريطة...
        </Typography>
      )}
    </Box>
  );
}
