import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShieldIcon from "@mui/icons-material/Shield";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { ADMIN_SECTIONS } from "../data/mock-data";

const SECTION_ICONS = {
  users: <PeopleIcon fontSize="small" />,
  orders: <ReceiptLongIcon fontSize="small" />,
};

/**
 * AdminSidebar — persistent left navigation rail for the admin dashboard.
 * Uses React Router <Link> for navigation; highlights the active route
 * based on the current pathname.
 */
export function AdminSidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <Box
      component="aside"
      sx={{
        width: 260,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflowY: "auto",
      }}
    >
      {/* Brand header */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "primary.main",
          }}
        >
          <ShieldIcon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={700} fontSize={14} noWrap>
            لوحة الإدارة
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user?.name ?? "مدير النظام"}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation links */}
      <List sx={{ flex: 1, px: 1, py: 1.5 }} disablePadding>
        {ADMIN_SECTIONS.map((section) => {
          // The root admin path is exact; sub-pages use startsWith
          const isActive =
            section.path === "/dashboard/admin"
              ? pathname === section.path
              : pathname.startsWith(section.path);

          return (
            <ListItemButton
              key={section.id}
              component={Link}
              to={section.path}
              selected={isActive}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                gap: 1.5,
                "&.Mui-selected": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18),
                  },
                },
              }}
            >
              <Box
                sx={{
                  color: isActive ? "primary.main" : "text.secondary",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {SECTION_ICONS[section.id]}
              </Box>
              <ListItemText
                disableTypography
                primary={(
                  <Typography fontWeight={isActive ? 700 : 500} fontSize={13}>
                    {section.title}
                  </Typography>
                )}
              />
            </ListItemButton>
          );
        })}
      </List>

    </Box>
  );
}
