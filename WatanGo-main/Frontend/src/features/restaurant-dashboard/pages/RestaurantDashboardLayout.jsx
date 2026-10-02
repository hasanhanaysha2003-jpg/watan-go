import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  SelectedRestaurantProvider,
  useSelectedRestaurant,
} from "../context/SelectedRestaurantContext";

const PAGES = [
  { label: "إدارة الطلبات", path: "/dashboard/restaurant/orders" },
  { label: "القائمة", path: "/dashboard/restaurant/menu" },
];

function isActive(path, pathname) {
  if (path.endsWith("/menu")) return pathname.endsWith("/menu");
  return !pathname.endsWith("/menu");
}

// ── Inner layout (consumes context already provided) ─────────────────────────

function DashboardInner() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    restaurants,
    selectedId,
    setSelectedId,
    loading,
    error,
  } = useSelectedRestaurant();

  // While fetching restaurant list, show a spinner in place of the selector
  const selectorContent = loading ? (
    <CircularProgress size={22} />
  ) : error ? (
    <Alert severity="error" sx={{ py: 0.5, px: 1.5, borderRadius: 2 }}>
      {error}
    </Alert>
  ) : (
    <FormControl size="small" sx={{ minWidth: 220 }}>
      <Select
        value={selectedId ?? ""}
        onChange={(e) => setSelectedId(Number(e.target.value))}
        displayEmpty
        IconComponent={ExpandMoreIcon}
        startAdornment={
          <StorefrontIcon sx={{ fontSize: 17, mr: 0.8, color: "primary.main" }} />
        }
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          fontSize: 14,
          bgcolor: (t) =>
            t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
        }}
      >
        {restaurants.map((r) => (
          <MenuItem key={r.id} value={r.id} sx={{ fontWeight: 600 }}>
            {r.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box dir="rtl" sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, sm: 3 }, py: 4 }}>
      {/* ── Page header ──────────────────────────────────────────────── */}
      <Box
        mb={3}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            لوحة المطعم
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {user?.name} · أدر طلباتك وقائمتك من مكان واحد
          </Typography>
        </Box>

        {/* ── Restaurant selector ──────────────────────────────────── */}
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ display: "block", mb: 0.5 }}
          >
            المطعم الحالي
          </Typography>
          {selectorContent}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* ── Page navigation ──────────────────────────────────────────── */}
      <Stack direction="row" spacing={1} mb={3}>
        {PAGES.map((page) => (
          <Button
            key={page.path}
            variant={isActive(page.path, pathname) ? "contained" : "outlined"}
            onClick={() => navigate(page.path)}
            sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}
          >
            {page.label}
          </Button>
        ))}
      </Stack>

      {/* ── Page content ─────────────────────────────────────────────── */}
      <Outlet />
    </Box>
  );
}

// ── Public export (wraps with provider) ──────────────────────────────────────

export default function RestaurantDashboardLayout() {
  return (
    <SelectedRestaurantProvider>
      <DashboardInner />
    </SelectedRestaurantProvider>
  );
}
