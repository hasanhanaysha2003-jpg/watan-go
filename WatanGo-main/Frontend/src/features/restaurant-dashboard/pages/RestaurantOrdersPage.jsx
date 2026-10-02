import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";
import { OrderSection } from "../components/OrderSection";
import { useRestaurantOrders } from "../hooks/use-restaurant-orders";
import { s } from "../restaurant-dashboard.styles";

export default function RestaurantOrdersPage() {
  const {
    loading,
    error,
    actionLoadingId,
    refresh,
    newOrders,
    preparingOrders,
    readyOrders,
    rejectedOrders,
    completedOrders,
    acceptOrder,
    rejectOrder,
    startPreparing,
    markReady,
  } = useRestaurantOrders();

  // Helper: is this particular order currently saving?
  const isBusy = (orderId) => actionLoadingId === orderId;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Tooltip title="تحديث الطلبات">
          <IconButton onClick={refresh} color="primary" size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Error banner (non-blocking) ─────────────────────────────── */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error} —{" "}
          <Button size="small" onClick={refresh} sx={{ fontWeight: 700 }}>
            أعد المحاولة
          </Button>
        </Alert>
      )}

      {/* ── Kanban grid ─────────────────────────────────────────────── */}
      <Box sx={s.orderSectionGrid}>

        {/* New orders */}
        <OrderSection
          title="الطلبات الجديدة"
          description="راجع الطلبات الواردة واقبلها أو ارفضها قبل بدء التحضير."
          orders={newOrders}
          emptyText="لا توجد طلبات جديدة حالياً."
          renderActions={(order) => (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  isBusy(order.id)
                    ? <CircularProgress size={14} color="inherit" />
                    : <CheckCircleOutlineIcon />
                }
                size="small"
                disabled={isBusy(order.id)}
                sx={{ borderRadius: 2, fontWeight: 600 }}
                onClick={() => acceptOrder(order.id)}
              >
                قبول
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={
                  isBusy(order.id)
                    ? <CircularProgress size={14} color="inherit" />
                    : <CancelOutlinedIcon />
                }
                size="small"
                disabled={isBusy(order.id)}
                sx={{ borderRadius: 2, fontWeight: 600 }}
                onClick={() => rejectOrder(order.id)}
              >
                رفض
              </Button>
            </>
          )}
        />

        {/* Preparing */}
        <OrderSection
          title="طلبات قيد التحضير"
          description="الطلبات المقبولة والتي يعمل عليها فريق المطبخ."
          orders={preparingOrders}
          emptyText="لا توجد طلبات قيد التحضير."
          renderActions={(order) => (
            <>
              {order.status === "accepted" && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={
                    isBusy(order.id)
                      ? <CircularProgress size={14} color="inherit" />
                      : <PlayArrowOutlinedIcon />
                  }
                  disabled={isBusy(order.id)}
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                  onClick={() => startPreparing(order.id)}
                >
                  بدء التحضير
                </Button>
              )}
              {order.status === "preparing" && (
                <Button
                  variant="outlined"
                  color="info"
                  size="small"
                  startIcon={
                    isBusy(order.id)
                      ? <CircularProgress size={14} color="inherit" />
                      : <DoneAllIcon />
                  }
                  disabled={isBusy(order.id)}
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                  onClick={() => markReady(order.id)}
                >
                  جاهز للاستلام
                </Button>
              )}
            </>
          )}
        />

        {/* Ready for pickup */}
        <OrderSection
          title="الطلبات الجاهزة للاستلام"
          description="هنا يتوقف دور المطعم، والسائق هو من يكمل التوصيل."
          orders={readyOrders}
          emptyText="لا توجد طلبات جاهزة للاستلام."
          renderActions={() => (
            <Chip
              label="بانتظار السائق"
              color="info"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        />

        {/* Rejected */}
        <OrderSection
          title="الطلبات المرفوضة"
          description="طلبات رفضها المطعم وتم إلغاؤها قبل بدء التحضير."
          orders={rejectedOrders}
          emptyText="لا توجد طلبات مرفوضة بعد."
          renderActions={() => null}
        />

        {/* Completed */}
        <OrderSection
          title="الطلبات المكتملة"
          description="طلبات تم تسليمها بواسطة السائق. تظهر هنا للمتابعة فقط."
          orders={completedOrders}
          emptyText="لا توجد طلبات مكتملة بعد."
          renderActions={() => null}
        />

      </Box>
    </Box>
  );
}
