import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { toast } from "sonner";

import {
  getAllOrders,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLOR,
} from "@/api/admin-orders";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(val) {
  if (val == null) return "—";
  return `₪ ${Number(val).toFixed(2)}`;
}

// ── OrderDetailDialog ─────────────────────────────────────────────────────────

function OrderDetailDialog({ order, onClose }) {
  if (!order) return null;

  const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status;
  const statusColor = ORDER_STATUS_COLOR[order.status] ?? "default";

  return (
    <Dialog open={Boolean(order)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
        <ReceiptLongIcon color="primary" fontSize="small" />
        تفاصيل الطلب #{order.id}
        <Box flex={1} />
        <Chip label={statusLabel} color={statusColor} size="small" />
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={3} mt={1}>
          {/* ── Summary row ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 2,
            }}
          >
            {[
              { label: "العميل", value: order.customerName },
              { label: "رقم الهاتف", value: order.customerPhone ?? "—" },
              { label: "السائق", value: order.driverName ?? "لم يُعيَّن" },
              { label: "المجموع", value: formatPrice(order.totalPrice) },
              { label: "التاريخ", value: formatDate(order.createdAt) },
              ...(order.notes ? [{ label: "ملاحظات", value: order.notes }] : []),
            ].map(({ label, value }) => (
              <Box
                key={label}
                sx={{ p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
              >
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography fontWeight={600} mt={0.25} variant="body2">
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* ── Order items ── */}
          {order.items.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} mb={1} color="primary">
                عناصر الطلب ({order.items.length})
              </Typography>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>الصنف</TableCell>
                      <TableCell>النوع</TableCell>
                      <TableCell>المطعم</TableCell>
                      <TableCell align="right">الكمية</TableCell>
                      <TableCell align="right">السعر</TableCell>
                      <TableCell align="right">رسوم التوصيل</TableCell>
                      <TableCell align="right">الإجمالي</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{item.itemName}</TableCell>
                        <TableCell>
                          <Chip label={item.itemType} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{item.restaurantName ?? "—"}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatPrice(item.unitPrice)}</TableCell>
                        <TableCell align="right">{formatPrice(item.deliveryFee)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {formatPrice(item.lineTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* ── Restaurant parts ── */}
          {order.restaurantParts.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} mb={1} color="primary">
                حالة التحضير لدى المطاعم
              </Typography>
              <Stack spacing={1}>
                {order.restaurantParts.map((part) => (
                  <Box
                    key={part.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {part.restaurantName}
                    </Typography>
                    <Chip
                      label={ORDER_STATUS_LABELS[part.status] ?? part.status}
                      color={ORDER_STATUS_COLOR[part.status] ?? "default"}
                      size="small"
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>إغلاق</Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [detailOrder, setDetailOrder] = useState(null);

  // ── Load ────────────────────────────────────────────────────────────────────

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getAllOrders();
    if (result.ok) {
      setOrders(result.orders);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // ── Filtering ────────────────────────────────────────────────────────────────

  const filtered = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.includes(q) ||
      o.driverName?.toLowerCase().includes(q) ||
      String(o.id).includes(q);
    return matchesSearch;
  });



  // ── Status filter chips ──────────────────────────────────────────────────────

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
            <ReceiptLongIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              مراقبة الطلبات
            </Typography>
            <Chip
              label={`${orders.length} طلب`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            متابعة الطلبات وتحديث حالاتها عبر المنصة.
          </Typography>
        </Box>
      </Box>

      {/* ── Filters ── */}
      <Stack spacing={2}>
        <TextField
          placeholder="ابحث بالاسم أو الهاتف أو رقم الطلب…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ maxWidth: 360 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* ── Table ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>العميل</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>السائق</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>العناصر</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">المجموع</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">تفاصيل</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="error" variant="body2">{error}</Typography>
                    <Button size="small" onClick={loadOrders} sx={{ mt: 1 }}>
                      إعادة المحاولة
                    </Button>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    لا توجد طلبات مطابقة.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => {
                  return (
                    <TableRow key={order.id} hover>
                      {/* ID */}
                      <TableCell
                        sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12 }}
                      >
                        {order.id}
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {order.customerName}
                        </Typography>
                        {order.customerPhone && (
                          <Typography variant="caption" color="text.secondary">
                            {order.customerPhone}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Driver */}
                      <TableCell>
                        {order.driverName ?? (
                          <Typography variant="caption" color="text.disabled">
                            لم يُعيَّن
                          </Typography>
                        )}
                      </TableCell>

                      {/* Items summary */}
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {order.items.length > 0
                            ? order.items
                              .map((i) => `${i.itemName} ×${i.quantity}`)
                              .join("، ")
                              .substring(0, 60) +
                            (order.items.map((i) => `${i.itemName} ×${i.quantity}`).join("، ")
                              .length > 60
                              ? "…"
                              : "")
                            : "—"}
                        </Typography>
                      </TableCell>

                      {/* Total */}
                      <TableCell align="right">
                        <Typography fontWeight={700} color="primary.main" variant="body2">
                          {formatPrice(order.totalPrice)}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={ORDER_STATUS_LABELS[order.status] ?? order.status}
                          color={ORDER_STATUS_COLOR[order.status] ?? "default"}
                          size="small"
                        />
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(order.createdAt)}
                        </Typography>
                      </TableCell>

                      {/* Detail button */}
                      <TableCell align="center">
                        <Tooltip title="عرض التفاصيل">
                          <IconButton size="small" onClick={() => setDetailOrder(order)}>
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Detail Dialog ── */}
      <OrderDetailDialog
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
      />
    </Stack>
  );
}
