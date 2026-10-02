import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { s } from "../restaurant-dashboard.styles";

export function MealFormPanel({ form, editingId, saving, onChange, onSubmit, onCancel }) {
  const title = editingId ? "تعديل الصنف" : "إضافة صنف جديد";

  return (
    <Box component="form" onSubmit={onSubmit} sx={s.mealForm}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={700} fontSize={17}>
          {title}
        </Typography>
        <Button
          type="button"
          variant="outlined"
          size="small"
          onClick={onCancel}
          sx={{ borderRadius: 2 }}
        >
          إلغاء
        </Button>
      </Stack>

      <Box sx={s.formGrid}>
        <TextField
          label="اسم الصنف"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="مثال: شاورما دجاج"
          size="small"
          required
        />
        <TextField
          label="السعر (₪)"
          value={form.price}
          onChange={(e) => onChange("price", e.target.value)}
          placeholder="24"
          size="small"
          slotProps={{ htmlInput: { inputMode: "decimal" } }}
          required
        />
        <TextField
          label="الوصف"
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="وصف مختصر يظهر في بطاقة الصنف"
          size="small"
          multiline
          rows={3}
          sx={s.fullSpan}
        />
        <Stack direction="row" spacing={3} sx={s.fullSpan}>
          <FormControlLabel
            control={
              <Switch
                checked={form.isAvailable}
                onChange={(e) => onChange("isAvailable", e.target.checked)}
                color="success"
              />
            }
            label="متاح للطلب"
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.isMain}
                onChange={(e) => onChange("isMain", e.target.checked)}
                color="primary"
              />
            }
            label="صنف رئيسي (يظهر على بطاقة المطعم)"
          />
        </Stack>
      </Box>

      <Box mt={2.5}>
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          sx={{ borderRadius: 2.5, fontWeight: 700, px: 3 }}
        >
          {saving ? "جارٍ الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الصنف"}
        </Button>
      </Box>
    </Box>
  );
}
