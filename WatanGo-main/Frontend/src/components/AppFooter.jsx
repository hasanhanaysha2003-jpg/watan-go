import { Box, Typography, Divider, Stack, useTheme } from "@mui/material";
import { DirectionsCar, Restaurant, Store } from "@mui/icons-material";
import logo from "../assets/Picture1.png";

const services = [
  { icon: DirectionsCar, label: "رحلات" },
  { icon: Restaurant, label: "توصيل طعام" },
  { icon: Store, label: "متاجر" },
];

export function AppFooter() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{ mt: 16, borderTop: "1px solid", borderColor: "divider" }}
    >
      <Box
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: 6,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 5,
          }}
        >
          {/* Brand column */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                component="img"
                src={logo}
                alt="Watan Go Logo"
                sx={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  objectFit: "contain",
                }}
              />
              <Typography variant="subtitle1" fontWeight={700}>
                وطن جو{" "}
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  fontFamily="monospace"
                >
                  / Watan Go
                </Typography>
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, maxWidth: 360, lineHeight: 1.8 }}
            >
              منصة واحدة للتنقل والتوصيل والتسوق. منظومة رقمية موحدة مصممة للمدن
              الحديثة.
            </Typography>
          </Box>

          {/* Services column */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              الخدمات
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {services.map(({ icon: Icon, label }) => (
                <Box
                  key={label}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Icon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ mt: 5, mb: 3 }} />

        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="monospace"
        >
          © {new Date().getFullYear()} وطن جو — جميع الحقوق محفوظة
        </Typography>
      </Box>
    </Box>
  );
}
