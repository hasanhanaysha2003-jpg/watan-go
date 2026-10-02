import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";

const EMPTY = { name: "", description: "", price: "", rating: "", quantity: "" };

export function MarketItemFormDialog({ open, item, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              name: item.name,
              description: item.description ?? "",
              price: String(item.price),
              rating: String(item.rating),
              quantity: String(item.quantity),
            }
          : EMPTY,
      );
    }
  }, [open, item]);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price) || 0,
      rating: parseFloat(form.rating) || 0,
      quantity: parseInt(form.quantity, 10) || 0,
    };
    await onSubmit(payload);
    setSaving(false);
  }

  const isEdit = Boolean(item);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? "تعديل المنتج" : "إضافة منتج جديد"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2.5} pt={0.5}>
            <TextField
              label="اسم المنتج"
              value={form.name}
              onChange={set("name")}
              required
              fullWidth
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
            <TextField
              label="الوصف (اختياري)"
              value={form.description}
              onChange={set("description")}
              fullWidth
              multiline
              minRows={2}
              slotProps={{ htmlInput: { maxLength: 1000 } }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="السعر"
                value={form.price}
                onChange={set("price")}
                type="number"
                required
                fullWidth
                slotProps={{
                  htmlInput: { min: 0, max: 10000, step: 0.01 },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">₪</InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="التقييم"
                value={form.rating}
                onChange={set("rating")}
                type="number"
                required
                fullWidth
                slotProps={{
                  htmlInput: { min: 0, max: 5, step: 0.1 },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">/ 5</InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
            <TextField
              label="الكمية المتاحة"
              value={form.quantity}
              onChange={set("quantity")}
              type="number"
              required
              fullWidth
              slotProps={{
                htmlInput: { min: 0 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">قطعة</InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={onClose} disabled={saving}>
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ minWidth: 130 }}
          >
            {saving ? (
              <CircularProgress size={18} color="inherit" />
            ) : isEdit ? (
              "حفظ التعديلات"
            ) : (
              "إضافة"
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
