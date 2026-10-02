// Navigation sections — single source of truth for sidebar + page headings
export const ADMIN_SECTIONS = [
  {
    id: "users",
    title: "إدارة المستخدمين",
    description: "حسابات العملاء وأصحاب الأدوار",
    path: "/dashboard/admin",
  },
  {
    id: "orders",
    title: "مراقبة الطلبات",
    description: "متابعة الطلبات والرحلات النشطة",
    path: "/dashboard/admin/orders",
  },
];

// All possible ride statuses in display order
export const RIDE_STATUSES = [
  "pending",
  "accepted",
  "driver_assigned",
  "on_the_way",
  "completed",
  "cancelled",
];

// MUI chip color mapping for ride statuses
export const RIDE_STATUS_CHIP_COLOR = {
  pending: "warning",
  accepted: "info",
  driver_assigned: "primary",
  on_the_way: "success",
  completed: "success",
  cancelled: "error",
};

// Arabic labels for ride statuses
export const RIDE_STATUS_LABELS = {
  pending: "قيد الانتظار",
  accepted: "مقبول",
  driver_assigned: "تم تعيين سائق",
  on_the_way: "في الطريق",
  completed: "مكتمل",
  cancelled: "ملغي",
};

// Arabic labels for user statuses
export const USER_STATUS_LABELS = {
  active: "نشط",
  pending: "قيد المراجعة",
  suspended: "موقوف",
};

// MUI chip color mapping for user statuses
export const USER_STATUS_CHIP_COLOR = {
  active: "success",
  pending: "warning",
  suspended: "error",
};

// LocalStorage key for admin user metadata (status, createdAt)
export const USER_META_KEY = "watan_go_admin_user_meta";
