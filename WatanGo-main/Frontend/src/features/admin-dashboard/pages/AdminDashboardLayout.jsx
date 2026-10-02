import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { AdminSidebar } from "../components/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

/**
 * AdminDashboardLayout — shell that wraps all /dashboard/admin/* pages.
 *
 * Layout:
 *   [Sidebar] | [AppHeader + <Outlet />]
 *
 * The ProtectedRoute (roles=["admin"]) guard is applied in App.jsx,
 * so this component can assume the user is already authenticated as admin.
 */
export default function AdminDashboardLayout() {
  return (
    <Box
      dir="rtl"
      sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}
    >
      {/* Sticky sidebar — hidden on mobile via display */}
      <Box sx={{ display: { xs: "none", lg: "block" } }}>
        <AdminSidebar />
      </Box>

      {/* Main content column */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppHeader />

        <Box
          component="main"
          sx={{ flex: 1, maxWidth: 1280, mx: "auto", width: "100%", px: { xs: 2, sm: 3 }, py: 3 }}
        >
          <Outlet />
        </Box>
      </Box>
      <Toaster dir="rtl" position="top-center" closeButton />
    </Box>
  );
}
