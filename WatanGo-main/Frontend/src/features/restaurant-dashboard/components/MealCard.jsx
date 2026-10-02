import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import { alpha } from "@mui/material/styles";

export function MealCard({ meal, onEdit, onDelete }) {
  const available = meal.isAvailable;

  return (
    <Box
      component="article"
      sx={(theme) => ({
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": {
          transform: "translateY(-6px) scale(1.012)",
          boxShadow: `0 20px 50px ${alpha(
            available ? theme.palette.success.main : theme.palette.warning.main,
            0.18
          )}`,
          borderColor: alpha(
            available ? theme.palette.success.main : theme.palette.warning.main,
            0.45
          ),
        },
      })}
    >
      {/* ── Decorative gradient banner ── */}
      <Box
        sx={(theme) => ({
          position: "relative",
          px: 3,
          pt: 3,
          pb: 3.5,
          background: available
            ? `linear-gradient(135deg,
                ${alpha(theme.palette.success.main, 0.16)} 0%,
                ${alpha(theme.palette.primary.main, 0.08)} 60%,
                ${alpha(theme.palette.info.main, 0.04)} 100%)`
            : `linear-gradient(135deg,
                ${alpha(theme.palette.warning.main, 0.2)} 0%,
                ${alpha(theme.palette.error.main, 0.07)} 60%,
                ${alpha(theme.palette.warning.light ?? "#ffb74d", 0.03)} 100%)`,
          borderBottom: "1px solid",
          borderColor: "divider",
        })}
      >
        {/* Background watermark icon — sits beside the text on the right */}
        <RestaurantMenuRoundedIcon
          sx={(theme) => ({
            position: "absolute",
            top: "50%",
            right: 90,          /* leaves room for the price badge */
            transform: "translateY(-50%) rotate(-10deg)",
            fontSize: 72,
            opacity: 0.08,
            color: available
              ? theme.palette.success.main
              : theme.palette.warning.main,
            pointerEvents: "none",
          })}
        />

        {/* Availability indicator dot */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.75 }}
        >
          <Box
            sx={(theme) => ({
              width: 9,
              height: 9,
              borderRadius: "50%",
              flexShrink: 0,
              bgcolor: available
                ? theme.palette.success.main
                : theme.palette.warning.main,
              boxShadow: `0 0 0 3px ${alpha(
                available
                  ? theme.palette.success.main
                  : theme.palette.warning.main,
                0.25
              )}`,
            })}
          />
          <Typography
            sx={(theme) => ({
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.9,
              textTransform: "uppercase",
              color: available
                ? theme.palette.success.main
                : theme.palette.warning.main,
            })}
          >
            {available ? "متوفر الآن" : "غير متوفر"}
          </Typography>
        </Box>

        {/* Meal name & description — padded so they don't clash with badge */}
        <Box sx={{ pl: 9 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 18,
              lineHeight: 1.35,
              letterSpacing: 0.3,
              color: "text.primary",
            }}
          >
            {meal.name}
          </Typography>
          {meal.description && (
            <Typography
              sx={{
                mt: 0.7,
                fontSize: 13,
                color: "text.secondary",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.55,
                opacity: 0.85,
              }}
            >
              {meal.description}
            </Typography>
          )}
        </Box>

        {/* Floating price badge */}
        <Box
          sx={(theme) => ({
            position: "absolute",
            top: 18,
            left: 18,
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 0.4,
            bgcolor: "background.paper",
            border: "2px solid",
            borderColor: available
              ? alpha(theme.palette.success.main, 0.45)
              : alpha(theme.palette.warning.main, 0.45),
            borderRadius: 3,
            px: 1.75,
            py: 1.25,
            minWidth: 62,
            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.14)}`,
          })}
        >
          <Typography
            fontWeight={900}
            fontSize={20}
            lineHeight={1}
            color="primary.main"
          >
            {meal.price}
          </Typography>
          <Typography
            fontSize={14}
            color="text.secondary"
            fontWeight={700}
            lineHeight={1}
          >
            ₪
          </Typography>
        </Box>
      </Box>

      {/* ── Status chips ── */}
      <Box sx={{ px: 3, pt: 2, pb: 1.5 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            icon={
              available ? (
                <CheckCircleRoundedIcon
                  sx={{ fontSize: "14px !important" }}
                />
              ) : (
                <CancelRoundedIcon sx={{ fontSize: "14px !important" }} />
              )
            }
            label={available ? "متوفر" : "غير متوفر"}
            color={available ? "success" : "warning"}
            size="small"
            sx={{ fontWeight: 700, fontSize: 12, borderRadius: 2.5, px: 0.5 }}
          />
          {meal.isMain && (
            <Chip
              icon={
                <StarRoundedIcon sx={{ fontSize: "14px !important" }} />
              }
              label="صنف رئيسي"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontSize: 12, borderRadius: 2.5, fontWeight: 600, px: 0.5 }}
            />
          )}
        </Stack>
      </Box>

      {/* ── Spacer pushes buttons to bottom ── */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* ── Action buttons ── */}
      <Box
        sx={(theme) => ({
          px: 3,
          py: 2,
          display: "flex",
          gap: 1.5,
          bgcolor: alpha(theme.palette.action.hover, 0.25),
        })}
      >
        <Tooltip title="تعديل الصنف" placement="top">
          <Button
            fullWidth
            size="medium"
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            onClick={onEdit}
            sx={(theme) => ({
              borderRadius: 3,
              fontWeight: 700,
              fontSize: 13,
              py: 1,
              textTransform: "none",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(
                theme.palette.primary.dark,
                0.85
              )})`,
              boxShadow: `0 4px 14px ${alpha(
                theme.palette.primary.main,
                0.32
              )}`,
              transition: "all 0.22s ease",
              "&:hover": {
                boxShadow: `0 6px 22px ${alpha(
                  theme.palette.primary.main,
                  0.48
                )}`,
                transform: "translateY(-1px)",
              },
            })}
          >
            تعديل
          </Button>
        </Tooltip>

        <Tooltip title="حذف الصنف" placement="top">
          <Button
            fullWidth
            size="medium"
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlinedIcon />}
            onClick={onDelete}
            sx={(theme) => ({
              borderRadius: 3,
              fontWeight: 700,
              fontSize: 13,
              py: 1,
              textTransform: "none",
              borderColor: alpha(theme.palette.error.main, 0.5),
              transition: "all 0.22s ease",
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.08),
                borderColor: "error.main",
                transform: "translateY(-1px)",
              },
            })}
          >
            حذف
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
}
