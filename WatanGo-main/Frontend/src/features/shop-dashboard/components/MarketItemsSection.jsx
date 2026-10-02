import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { toast } from "sonner";
import { s } from "../shop-dashboard.styles";
import { MarketItemFormDialog } from "./MarketItemFormDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export function MarketItemsSection({ items, loading, error, create, update, remove }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openAdd() {
    setEditItem(null);
    setFormOpen(true);
  }

  function openEdit(item) {
    setEditItem(item);
    setFormOpen(true);
  }

  async function handleFormSubmit(payload) {
    const result = editItem
      ? await update(editItem.id, payload)
      : await create(payload);
    if (result.ok) {
      toast.success(editItem ? "تم تعديل المنتج بنجاح" : "تمت إضافة المنتج بنجاح");
      setFormOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  async function handleDelete() {
    const result = await remove(deleteTarget.id);
    if (result.ok) {
      toast.success(`تم حذف "${deleteTarget.name}"`);
    } else {
      toast.error(result.message);
    }
    setDeleteTarget(null);
  }

  return (
    <>
      <Box sx={s.section}>
        <Box sx={s.sectionHead}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Inventory2OutlinedIcon color="primary" />
            <Typography sx={s.sectionTitle}>إدارة المنتجات</Typography>
            {!loading && (
              <Chip
                label={items.length}
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Stack>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={openAdd}
          >
            إضافة منتج
          </Button>
        </Box>

        <Box sx={s.sectionBody}>
          {loading ? (
            <Stack alignItems="center" py={5}>
              <CircularProgress size={32} />
            </Stack>
          ) : error ? (
            <Typography color="error" textAlign="center" py={3} fontSize={14}>
              {error}
            </Typography>
          ) : items.length === 0 ? (
            <Box sx={s.empty}>
              <Inventory2OutlinedIcon sx={{ fontSize: 38, mb: 1, opacity: 0.35 }} />
              <Typography fontSize={14}>
                لا توجد منتجات بعد · اضغط «إضافة منتج» للبدء
              </Typography>
            </Box>
          ) : (
            <Stack divider={<Divider />}>
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onEdit={() => openEdit(item)}
                  onDelete={() => setDeleteTarget(item)}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>

      <MarketItemFormDialog
        open={formOpen}
        item={editItem}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        name={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

function ItemRow({ item, onEdit, onDelete }) {
  const outOfStock = item.quantity === 0;

  return (
    <Box sx={s.itemRow}>
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} minWidth={0}>
        <Avatar sx={s.itemAvatar}>{item.name.charAt(0)}</Avatar>
        <Box minWidth={0}>
          <Typography fontWeight={600} fontSize={14} noWrap>
            {item.name}
          </Typography>
          {item.description && (
            <Typography fontSize={12} color="text.secondary" noWrap>
              {item.description}
            </Typography>
          )}
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} flexShrink={0} flexWrap="wrap">
        <Chip
          label={`₪ ${Number(item.price).toFixed(2)}`}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
        <Chip
          label={outOfStock ? "نفد المخزون" : `${item.quantity} قطعة`}
          size="small"
          color={outOfStock ? "error" : "success"}
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label={`⭐ ${Number(item.rating).toFixed(1)}`}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
        <Tooltip title="تعديل">
          <IconButton size="small" onClick={onEdit} color="primary">
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="حذف">
          <IconButton size="small" onClick={onDelete} color="error">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
