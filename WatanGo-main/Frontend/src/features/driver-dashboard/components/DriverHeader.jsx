import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

const STATUS_COLORS = {
  online: "#22d3ee",
  busy: "#f59e0b",
  offline: "#9ca3af",
};

export function DriverHeader({ user, status }) {
  return (
    <Box
      component="header"
      sx={(theme) => ({
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.6),
        bgcolor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: "blur(16px)",
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center", px: { xs: 2, lg: 3 }, py: 2, gap: 2 }}>
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <Box
            sx={(theme) => ({
              width: 48,
              height: 48,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 20,
              color: theme.palette.primary.contrastText,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, #22d3ee)`,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
            })}
          >
            {user.name.charAt(0)}
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: -2,
              left: -2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: STATUS_COLORS[status] ?? STATUS_COLORS.offline,
              border: "2px solid",
              borderColor: "background.paper",
            }}
          />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            أهلا بك في Watan Go
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
            مرحبا، {user.name}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
