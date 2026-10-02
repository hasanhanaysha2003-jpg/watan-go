import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

const NAV_ITEMS = [
  { path: "/dashboard/driver", exact: true, label: "الرئيسية", icon: HomeRoundedIcon },
  { path: "/dashboard/driver/orders", exact: false, label: "الطلبات", icon: Inventory2RoundedIcon },
  { path: "/dashboard/driver/delivery", exact: false, label: "التوصيل", icon: LocalShippingRoundedIcon },
  { path: "/dashboard/driver/earnings", exact: false, label: "الأرباح", icon: AccountBalanceWalletRoundedIcon },
];

export function SidebarNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function isActive(item) {
    return item.exact ? pathname === item.path : pathname.startsWith(item.path);
  }

  return (
    <Box
      component="aside"
      sx={(theme) => ({
        borderBottom: { xs: "1px solid", lg: "none" },
        borderColor: alpha(theme.palette.divider, 0.6),
        bgcolor: alpha(theme.palette.background.paper, 0.72),
        backdropFilter: "blur(14px)",
        px: { xs: 1.5, lg: 2 },
        py: { xs: 1.5, lg: 2.5 },
        position: { lg: "sticky" },
        top: { lg: 0 },
        height: { lg: "100vh" },
        width: { lg: 288 },
        borderLeft: { xs: "none", lg: "1px solid" },
      })}
    >
      {/* Brand mark — desktop only */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ mb: 2.5, display: { xs: "none", lg: "flex" }, alignItems: "center" }}
      >
        <Box
          sx={(theme) => ({
            width: 44,
            height: 44,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: theme.palette.primary.contrastText,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, #22d3ee)`,
          })}
        >
          و
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>وطن جو</Typography>
          <Typography variant="caption" color="text.secondary">لوحة السائق</Typography>
        </Box>
      </Stack>

      <Stack
        direction={{ xs: "row", lg: "column" }}
        spacing={1}
        sx={{
          overflowX: { xs: "auto", lg: "visible" },
          alignItems: { xs: "center", lg: "stretch" },
          pb: { xs: 0.5, lg: 0 },
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              startIcon={<Icon fontSize="small" />}
              disableElevation
              aria-current={active ? "page" : undefined}
              sx={(theme) => ({
                minWidth: "max-content",
                flexShrink: 0,
                width: { lg: "100%" },
                justifyContent: "flex-start",
                borderRadius: 2.5,
                px: 2,
                py: 1.25,
                fontWeight: 700,
                whiteSpace: "nowrap",
                border: "1px solid",
                borderColor: active
                  ? alpha(theme.palette.primary.main, 0.45)
                  : "transparent",
                bgcolor: active
                  ? theme.palette.primary.main
                  : alpha(theme.palette.action.hover, 0.2),
                color: active
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.secondary,
                boxShadow: active
                  ? `0 10px 18px ${alpha(theme.palette.primary.main, 0.24)}`
                  : "none",
                "&:hover": {
                  borderColor: active
                    ? alpha(theme.palette.primary.main, 0.7)
                    : alpha(theme.palette.info.main, 0.35),
                  bgcolor: active
                    ? theme.palette.primary.main
                    : alpha(theme.palette.action.hover, 0.35),
                  color: active
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                },
              })}
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
