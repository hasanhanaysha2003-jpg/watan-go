import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import { MealCard } from "../components/MealCard";
import { MealFormPanel } from "../components/MealFormPanel";
import { useRestaurantMenu } from "../hooks/use-restaurant-menu";
import { s } from "../restaurant-dashboard.styles";

const STAT_PILLS = (items) => [
  { label: "إجمالي الأصناف", value: items.length, color: "default" },
  { label: "متوفر", value: items.filter((i) => i.isAvailable).length, color: "success" },
  { label: "غير متوفر", value: items.filter((i) => !i.isAvailable).length, color: "warning" },
  { label: "أصناف رئيسية", value: items.filter((i) => i.isMain).length, color: "primary" },
];

export default function RestaurantMenuPage() {
  const {
    items,
    loading,
    error,
    saving,
    form,
    editingId,
    isFormOpen,
    handleFieldChange,
    openAddForm,
    openEditForm,
    saveMeal,
    deleteItem,
    resetForm,
  } = useRestaurantMenu();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={s.empty}>
        <Typography color="error.main" fontWeight={600}>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Quick stats strip */}
      <Box sx={s.statsStrip}>
        {STAT_PILLS(items).map((pill) => (
          <Box key={pill.label} sx={s.statPill(pill.color)}>
            <Typography fontWeight={800} fontSize={18} lineHeight={1}>
              {pill.value}
            </Typography>
            <Typography fontSize={12} color="text.secondary" fontWeight={500}>
              {pill.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Meals section */}
      <Box sx={s.section}>
        {/* Header */}
        <Box sx={s.sectionHead}>
          <Box>
            <Typography sx={s.sectionTitle}>قائمة الأصناف</Typography>
            <Typography sx={s.sectionSub}>
              أضف الأصناف وعدّل أسعارها وحالة توفرها في أي وقت.
            </Typography>
          </Box>
          {!isFormOpen && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddForm}
              sx={{ borderRadius: 2.5, fontWeight: 700, whiteSpace: "nowrap", px: 2.5 }}
            >
              إضافة صنف
            </Button>
          )}
        </Box>

        <Box sx={s.sectionBody}>
          {/* Add / Edit form */}
          {isFormOpen && (
            <MealFormPanel
              form={form}
              editingId={editingId}
              saving={saving}
              onChange={handleFieldChange}
              onSubmit={saveMeal}
              onCancel={resetForm}
            />
          )}

          {/* Items grid */}
          {items.length === 0 ? (
            <Box
              sx={{
                ...s.empty,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                py: 8,
              }}
            >
              <RestaurantMenuOutlinedIcon sx={{ fontSize: 52, color: "text.disabled" }} />
              <Typography fontWeight={700} color="text.secondary">
                لا توجد أصناف بعد
              </Typography>
              <Typography variant="body2" color="text.disabled">
                أضف أول صنف في قائمة مطعمك الآن
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddForm}
                sx={{ borderRadius: 2.5, fontWeight: 700, mt: 1 }}
              >
                إضافة صنف
              </Button>
            </Box>
          ) : (
            <Box sx={s.mealGrid}>
              {items.map((item) => (
                <MealCard
                  key={item.id}
                  meal={item}
                  onEdit={() => openEditForm(item)}
                  onDelete={() => deleteItem(item.id)}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
