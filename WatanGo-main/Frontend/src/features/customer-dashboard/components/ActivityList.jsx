import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import { dashboardStyles as s } from "../customer-dashboard.styles";

const ORDER_STATUS_MAP = {
  pending:          { label: "قيد الانتظار",  color: "warning" },
  accepted:         { label: "تم القبول",      color: "info"    },
  preparing:        { label: "قيد التحضير",    color: "info"    },
  ready_for_pickup: { label: "جاهز للاستلام",  color: "primary" },
  picked_up:        { label: "تم الاستلام",    color: "primary" },
  on_the_way:       { label: "في الطريق",      color: "primary" },
  completed:        { label: "مكتمل",          color: "success" },
  cancelled:        { label: "ملغي",           color: "error"   },
};

const RIDE_STATUS_MAP = {
  pending:   { label: "قيد الانتظار", color: "warning" },
  assigned:  { label: "مع السائق",   color: "info"    },
  completed: { label: "مكتمل",       color: "success" },
};

function StatusChip({ status, map }) {
  const cfg = map[status] ?? { label: status, color: "default" };
  return (
    <Chip
      label={cfg.label}
      color={cfg.color}
      size="small"
      sx={{ fontSize: 11.5, fontWeight: 700, height: 24 }}
    />
  );
}

function parseUtc(str) {
  if (!str) return new Date(NaN);
  const s = String(str);
  return new Date(/Z$|[+-]\d{2}:?\d{2}$/.test(s) ? s : s + "Z");
}

function formatDate(iso) {
  return parseUtc(iso).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function OrdersTable({ activities }) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHead sx={s.tableHead}>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>الطلب</TableCell>
          <TableCell align="center">العناصر</TableCell>
          <TableCell align="center">الإجمالي</TableCell>
          <TableCell align="center">الحالة</TableCell>
          <TableCell align="center">التاريخ</TableCell>
          <TableCell align="center">الخريطة</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {activities.map((item) => {
          const isActive = item.status === "picked_up" || item.status === "on_the_way";
          return (
            <TableRow
              key={item.id}
              sx={(theme) => ({
                ...s.tableRow(theme),
                cursor: isActive ? "pointer" : "default",
                "&:hover": isActive
                  ? { bgcolor: alpha(theme.palette.info.main, 0.06) }
                  : s.tableRow(theme)["&:hover"],
              })}
              onClick={() => isActive && navigate(`/orders/${item.id}/tracking`)}
            >
              <TableCell sx={s.tableCell}>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  #{item.id}
                </Typography>
              </TableCell>
              <TableCell sx={s.tableCell}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                  {item.restaurantName ? `${item.restaurantName}` : "طلب تسوق"}
                </Typography>
              </TableCell>
              <TableCell sx={s.tableCell} align="center">
                {item.itemCount ?? "—"}
              </TableCell>
              <TableCell sx={s.tableCell} align="center">
                <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>
                  {item.totalPrice != null
                    ? `${Number(item.totalPrice).toFixed(0)} ₪`
                    : "—"}
                </Typography>
              </TableCell>
              <TableCell sx={s.tableCell} align="center">
                <StatusChip status={item.status} map={ORDER_STATUS_MAP} />
              </TableCell>
              <TableCell sx={s.tableCell} align="center">
                <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
                  {formatDate(item.createdAt)}
                </Typography>
              </TableCell>
              <TableCell sx={s.tableCell} align="center">
                <Tooltip
                  title={isActive ? "تتبع الطلب على الخريطة" : "التتبع يبدأ عند استلام السائق للطلب"}
                  arrow
                >
                  <Box
                    sx={(theme) => ({
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: isActive
                        ? alpha(theme.palette.info.main, 0.12)
                        : "transparent",
                      color: isActive ? "info.main" : "text.disabled",
                      transition: "all 0.15s",
                      "&:hover": isActive
                        ? {
                            bgcolor: alpha(theme.palette.info.main, 0.22),
                            transform: "scale(1.1)",
                          }
                        : {},
                    })}
                  >
                    <MapOutlinedIcon sx={{ fontSize: 17 }} />
                  </Box>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function RidesTable({ activities }) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHead sx={s.tableHead}>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>نقطة الانطلاق</TableCell>
          <TableCell>الوجهة</TableCell>
          <TableCell align="center">المسافة</TableCell>
          <TableCell align="center">السعر</TableCell>
          <TableCell align="center">الحالة</TableCell>
          <TableCell align="center">التاريخ</TableCell>
          <TableCell align="center">الخريطة</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {activities.map((item) => {
          const isActive = item.status === "assigned";
          return (
            <TableRow
              key={item.id}
              sx={(theme) => ({
                ...s.tableRow(theme),
                cursor: isActive ? "pointer" : "default",
                "&:hover": isActive
                  ? { bgcolor: alpha(theme.palette.info.main, 0.06) }
                  : s.tableRow(theme)["&:hover"],
              })}
              onClick={() => isActive && navigate(`/rides/${item.id}/tracking`)}
            >
              <TableCell sx={s.tableCell}>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  #{item.id}
                </Typography>
              </TableCell>
              <TableCell sx={{ ...s.tableCell, maxWidth: 180 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>
                  {item.pickupAddress}
                </Typography>
              </TableCell>
              <TableCell sx={{ ...s.tableCell, maxWidth: 180 }}>
                <Typography sx={{ fontSize: 13 }} noWrap>
                  {item.destinationAddress}
                </Typography>
              </TableCell>
              <TableCell sx={s.tableCell} align="center">
                {item.distanceKm != null
                  ? `${Number(item.distanceKm).toFixed(1)} كم`
                  : "—"}
              </TableCell>
              <TableCell sx={s.tableCell} align="center">
                <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>
                  {item.price != null ? `${item.price} ₪` : "—"}
                </Typography>
              </TableCell>
              <TableCell sx={s.tableCell} align="center">
                <StatusChip status={item.status} map={RIDE_STATUS_MAP} />
              </TableCell>
              <TableCell sx={s.tableCell} align="center">
                <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
                  {formatDate(item.createdAt)}
                </Typography>
              </TableCell>
              <TableCell sx={s.tableCell} align="center">
                <Tooltip
                  title={isActive ? "تتبع الرحلة على الخريطة" : "التتبع يبدأ عند قبول السائق"}
                  arrow
                >
                  <Box
                    sx={(theme) => ({
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: isActive
                        ? alpha(theme.palette.info.main, 0.12)
                        : "transparent",
                      color: isActive ? "info.main" : "text.disabled",
                      transition: "all 0.15s",
                      "&:hover": isActive
                        ? {
                            bgcolor: alpha(theme.palette.info.main, 0.22),
                            transform: "scale(1.1)",
                          }
                        : {},
                    })}
                  >
                    <MapOutlinedIcon sx={{ fontSize: 17 }} />
                  </Box>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function ActivityList({
  type,
  activities,
  loading,
  error,
  totalPages,
  page,
  setPage,
}) {
  if (loading) {
    return (
      <Box sx={s.loadingBox}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (error) {
    return <Box sx={s.errorBox}>{error}</Box>;
  }

  if (activities.length === 0) {
    return (
      <Box sx={s.emptyState}>
        <InboxOutlinedIcon sx={{ fontSize: 46, opacity: 0.3 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>لا توجد نتائج</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer sx={s.tableContainer}>
        {type === "orders" ? (
          <OrdersTable activities={activities} />
        ) : (
          <RidesTable activities={activities} />
        )}
      </TableContainer>
      {totalPages >= 1 && (
        <Box sx={s.paginationBox}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ChevronRightIcon />}
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            السابق
          </Button>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mx: 1 }}>
            صفحة {page} من {totalPages}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            endIcon={<ChevronLeftIcon />}
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            التالي
          </Button>
        </Box>
      )}
    </>
  );
}
