import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { AuthProvider } from "@/lib/auth";
import { ActiveTrackingProvider } from "@/lib/active-tracking";
import { ProtectedRoute } from "@/shared/routing/ProtectedRoute";
import {
  THEME_CHANGED_EVENT,
  THEME_STORAGE_KEY,
  applyThemeMode,
  createAppTheme,
  getInitialThemeMode,
} from "@/shared/theme/app-theme";

import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import RestaurantsPage from "@/features/restaurants/pages/RestaurantsPage";
import ShopsPage from "@/features/shops/pages/ShopsPage";
import MenuPage from "@/features/restaurants/pages/RestaurantMenuPage";
import CartPage from "@/features/cart/pages/CartPage";
import RideRequestPage from "@/features/rides/pages/RideRequestPage";
import OrderTrackingPage from "@/features/orders/pages/OrderTrackingPage";
import AdminDashboardLayout from "@/features/admin-dashboard/pages/AdminDashboardLayout";
import AdminUsersPage from "@/features/admin-dashboard/pages/AdminUsersPage";
import AdminOrdersPage from "@/features/admin-dashboard/pages/AdminOrdersPage";
import CustomerDashboardPage from "@/features/customer-dashboard/pages/CustomerDashboardPage";
import RideTrackingPage from "@/features/rides/pages/RideTrackingPage";
import DriverDashboardLayout from "@/features/driver-dashboard/pages/DriverDashboardLayout";
import DriverDashboardHomePage from "@/features/driver-dashboard/pages/DriverDashboardHomePage";
import DriverOrdersPage from "@/features/driver-dashboard/pages/DriverOrdersPage";
import DriverDeliveryPage from "@/features/driver-dashboard/pages/DriverDeliveryPage";
import DriverEarningsPage from "@/features/driver-dashboard/pages/DriverEarningsPage";
import RestaurantDashboardLayout from "@/features/restaurant-dashboard/pages/RestaurantDashboardLayout";
import RestaurantOrdersPage from "@/features/restaurant-dashboard/pages/RestaurantOrdersPage";
import RestaurantMenuPage from "@/features/restaurant-dashboard/pages/RestaurantMenuPage";
import ShopDashboardPage from "@/features/shop-dashboard/pages/ShopDashboardPage";

const authRoutes = [
  { path: "/login", Page: LoginPage },
  { path: "/register", Page: RegisterPage },
];

const publicRoutes = [
  { path: "/", Page: HomePage },
];


const protectedRoutes = [
  { path: "/restaurants", Page: RestaurantsPage, roles: ["customer"] },
  { path: "/restaurants/:id", Page: MenuPage, roles: ["customer"] },
  { path: "/menu/:restaurantId", Page: MenuPage, roles: ["customer"] },
  { path: "/shops", Page: ShopsPage, roles: ["customer"] },
  { path: "/cart", Page: CartPage, roles: ["customer"] },
  { path: "/ride-request", Page: RideRequestPage, roles: ["customer"] },
  {
    path: "/orders/:id/tracking",
    Page: OrderTrackingPage,
    roles: ["customer", "driver"],
  },

  {
    path: "/dashboard/customer",
    Page: CustomerDashboardPage,
    roles: ["customer"],
  },
  {
    path: "/rides/:id/tracking",
    Page: RideTrackingPage,
    roles: ["customer", "driver"],
  },
  { path: "/dashboard/shop", Page: ShopDashboardPage, roles: ["shop"] },
];

function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <AppHeader />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <AppFooter />
      <Toaster dir="rtl" position="top-center" closeButton />
    </Box>
  );
}

function AuthLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <AppHeader />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Toaster dir="rtl" position="top-center" closeButton />
    </Box>
  );
}

function pageElement(Page, Shell = Layout) {
  return (
    <Shell>
      <Page />
    </Shell>
  );
}

function protectedElement(Page, roles) {
  return <ProtectedRoute roles={roles}>{pageElement(Page)}</ProtectedRoute>;
}

export default function App() {
  const [themeMode, setThemeModeState] = useState(getInitialThemeMode);
  const muiTheme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    const handleThemeChanged = (event) => {
      const nextMode = event.detail?.mode;
      if (nextMode === "light" || nextMode === "dark") {
        setThemeModeState(nextMode);
      }
    };

    const handleStorage = (event) => {
      if (event.key === THEME_STORAGE_KEY) {
        setThemeModeState(getInitialThemeMode());
      }
    };

    window.addEventListener(THEME_CHANGED_EVENT, handleThemeChanged);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(THEME_CHANGED_EVENT, handleThemeChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <ActiveTrackingProvider>
        <BrowserRouter>
          <Routes>
            {authRoutes.map(({ path, Page }) => (
              <Route
                key={path}
                path={path}
                element={pageElement(Page, AuthLayout)}
              />
            ))}
            {publicRoutes.map(({ path, Page }) => (
              <Route key={path} path={path} element={pageElement(Page)} />
            ))}
            {protectedRoutes.map(({ path, Page, roles }) => (
              <Route
                key={path}
                path={path}
                element={protectedElement(Page, roles)}
              />
            ))}

            {/* ── Admin dashboard — nested routes ─────────────────────────── */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Default admin landing page is the user management screen. */}
              <Route index element={<AdminUsersPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
            </Route>

            {/* ── Driver dashboard — nested routes ─────────────────────────── */}
            <Route
              path="/dashboard/driver"
              element={
                <ProtectedRoute roles={["driver"]}>
                  <DriverDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DriverDashboardHomePage />} />
              <Route path="orders" element={<DriverOrdersPage />} />
              <Route path="delivery" element={<DriverDeliveryPage />} />
              <Route path="earnings" element={<DriverEarningsPage />} />
            </Route>

            {/* ── Restaurant dashboard — nested routes ─────────────────────── */}
            <Route
              path="/dashboard/restaurant"
              element={
                <ProtectedRoute roles={["restaurant"]}>
                  <Layout>
                    <RestaurantDashboardLayout />
                  </Layout>
                </ProtectedRoute>
              }
            >
              <Route index element={<RestaurantOrdersPage />} />
              <Route path="orders" element={<RestaurantOrdersPage />} />
              <Route path="menu" element={<RestaurantMenuPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </ActiveTrackingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
