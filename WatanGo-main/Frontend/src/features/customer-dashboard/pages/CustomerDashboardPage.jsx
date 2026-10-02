import { Box, Divider, Typography } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { useAuth } from "@/lib/auth";
import { useCustomerDashboard } from "../hooks/use-customer-dashboard";
import ServiceShortcuts from "../components/ServiceShortcuts";
import ActivityFilters from "../components/ActivityFilters";
import ActivityList from "../components/ActivityList";
import { dashboardStyles as s } from "../customer-dashboard.styles";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const {
    activities,
    totalPages,
    loading,
    error,
    type,
    setType,
    page,
    setPage,
  } = useCustomerDashboard();

  return (
    <Box sx={s.page} dir="rtl">
      <Box sx={s.hero}>
        <Box sx={s.heroEyebrow}>
          <DashboardOutlinedIcon sx={{ fontSize: 14 }} />
          لوحة تحكم العميل
        </Box>
        <Typography variant="h3" sx={s.heroTitle}>
          أهلاً، {user?.name ?? "..."}
        </Typography>
        <Typography sx={s.heroSubtitle}>
          تابع طلباتك ورحلاتك، أو ابدأ طلباً جديداً
        </Typography>
      </Box>

      <Box sx={s.content}>
        <ServiceShortcuts />

        <Box sx={s.activitySection}>
          <Box sx={s.activityHeader}>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>
              سجل النشاطات
            </Typography>
            <ActivityFilters type={type} setType={setType} />
          </Box>
          <Divider />
          <ActivityList
            type={type}
            activities={activities}
            loading={loading}
            error={error}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
          />
        </Box>
      </Box>
    </Box>
  );
}
