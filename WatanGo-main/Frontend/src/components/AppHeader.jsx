import { Link, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Badge,
  Avatar,
  Chip,
  Typography,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  ShoppingCart,
  Logout,
  LightMode,
  DarkMode,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { routeForRole, useAuth } from "@/lib/auth";
import { getCart } from "@/api/cart";
import { getInitialThemeMode, setThemeMode } from "@/shared/theme/app-theme";
import { toast } from "sonner";
import logo from "../assets/Picture1.png";

const dashboardLabels = {
  restaurant: "لوحة المطعم",
  customer: "لوحة العميل",
  driver: "لوحة السائق",
  shop: "لوحة المتجر",
  admin: "لوحة الإدارة",
};

const publicLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/register", label: "تسجيل" },
  { to: "/login", label: "دخول" },
];

function ThemeToggleButton() {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    setMode(getInitialThemeMode());
  }, []);

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    setThemeMode(next);
  };

  return (
    <IconButton
      onClick={toggle}
      size="small"
      color="inherit"
      aria-label={mode === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
    >
      {mode === "dark" ? (
        <LightMode fontSize="small" />
      ) : (
        <DarkMode fontSize="small" />
      )}
    </IconButton>
  );
}

export function AppHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [cartCount, setCartCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "customer") {
      setCartCount(0);
      return;
    }
    let cancelled = false;
    getCart().then((result) => {
      if (!cancelled && result.ok) {
        const total = result.data.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        setCartCount(total);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const navLinks = user
    ? [
        { to: "/", label: "الرئيسية" },
        { to: routeForRole(user.role), label: dashboardLabels[user.role] },
      ]
    : publicLinks;

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج");
    navigate("/login", { replace: true });
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(20px)",
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1280px",
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Watan Go Logo"
            sx={{ width: 36, height: 36, flexShrink: 0, objectFit: "contain" }}
          />
          <Box sx={{ lineHeight: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
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
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="monospace"
              sx={{ fontSize: "0.65rem" }}
            >
              v1.0 · منصة
            </Typography>
          </Box>
        </Box>

        {/* Nav links — desktop only */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
          {navLinks.map((link, index) => (
            <Button
              key={`${link.label}-${index}`}
              component={NavLink}
              to={link.to}
              end={link.to === "/" ? true : undefined}
              size="small"
              sx={{
                fontWeight: 500,
                color: "text.secondary",
                borderRadius: 2,
                px: 1.5,
                "&.active": { bgcolor: "action.selected", color: "text.primary" },
                "&:hover": { bgcolor: "action.hover", color: "text.primary" },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        {/* Right actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Cart icon — always visible for customers */}
          {user?.role === "customer" && (
            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
              aria-label="السلة"
              size="small"
            >
              <Badge badgeContent={cartCount || null} color="primary">
                <ShoppingCart fontSize="small" />
              </Badge>
            </IconButton>
          )}

          <ThemeToggleButton />

          {/* User chip — desktop */}
          {user ? (
            <Chip
              avatar={
                <Avatar
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                    color: "primary.contrastText !important",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
              }
              label={user.name}
              variant="outlined"
              sx={{
                display: { xs: "none", sm: "flex" },
                maxWidth: 160,
                "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
              }}
            />
          ) : (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "info.main",
                  animation: "pulse 1.5s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.4 },
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                عرض حي
              </Typography>
            </Box>
          )}

          {/* Logout button — desktop only */}
          {user && (
            <Button
              onClick={handleLogout}
              size="small"
              variant="outlined"
              startIcon={<Logout fontSize="small" />}
              sx={{
                display: { xs: "none", md: "flex" },
                borderColor: "divider",
                color: "text.secondary",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "error.light",
                  bgcolor: "error.light",
                  color: "error.dark",
                },
              }}
            >
              خروج
            </Button>
          )}

          {/* Hamburger — mobile only */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            size="small"
            color="inherit"
            aria-label="فتح القائمة"
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            width: 270,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {user.name.charAt(0)}
              </Avatar>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user.name}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" fontWeight={600}>
              القائمة
            </Typography>
          )}
          <IconButton size="small" onClick={closeDrawer} aria-label="إغلاق القائمة">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Nav links */}
        <List sx={{ pt: 1, px: 1 }}>
          {navLinks.map((link, index) => (
            <ListItem key={`${link.label}-${index}`} disablePadding>
              <ListItemButton
                component={NavLink}
                to={link.to}
                end={link.to === "/" ? true : undefined}
                onClick={closeDrawer}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  "&.active": {
                    bgcolor: "action.selected",
                    color: "text.primary",
                    fontWeight: 700,
                  },
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Cart link for customers */}
        {user?.role === "customer" && (
          <>
            <Divider sx={{ mx: 2, my: 0.5 }} />
            <List sx={{ px: 1 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/cart"
                  onClick={closeDrawer}
                  sx={{ borderRadius: 2, py: 1.2, "&:hover": { bgcolor: "action.hover" } }}
                >
                  <Badge
                    badgeContent={cartCount || null}
                    color="primary"
                    sx={{ mr: 1.5 }}
                  >
                    <ShoppingCart fontSize="small" />
                  </Badge>
                  <ListItemText
                    primary="السلة"
                    primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Logout */}
        {user && (
          <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Button
              fullWidth
              onClick={() => {
                closeDrawer();
                handleLogout();
              }}
              variant="outlined"
              startIcon={<Logout fontSize="small" />}
              sx={{
                borderColor: "divider",
                color: "text.secondary",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "error.light",
                  bgcolor: "error.light",
                  color: "error.dark",
                },
              }}
            >
              خروج
            </Button>
          </Box>
        )}
      </Drawer>
    </AppBar>
  );
}
