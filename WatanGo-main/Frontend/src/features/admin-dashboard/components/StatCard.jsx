import { Box, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

/**
 * StatCard — a single-metric summary card used on the Overview page.
 *
 * @param {object}  props
 * @param {string}  props.label   - Arabic label shown above the value
 * @param {string}  props.value   - Main numeric/text value to display
 * @param {string}  [props.color] - MUI palette key, e.g. "primary.main"
 */
export function StatCard({ label, value, color = "primary.main" }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)}, transparent)`,
      }}
    >
      <Typography variant="body2" color="text.secondary" mb={1}>
        {label}
      </Typography>
      <Typography variant="h4" fontWeight={700} color={color}>
        {value}
      </Typography>
    </Paper>
  );
}
