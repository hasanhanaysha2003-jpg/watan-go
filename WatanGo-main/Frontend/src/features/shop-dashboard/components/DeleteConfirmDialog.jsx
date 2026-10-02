import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export function DeleteConfirmDialog({ open, name, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>تأكيد الحذف</DialogTitle>
      <DialogContent>
        <Typography fontSize={14}>
          هل أنت متأكد من حذف «{name}»؟ لا يمكن التراجع عن هذه العملية.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={loading}
          sx={{ minWidth: 90 }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : "حذف"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
