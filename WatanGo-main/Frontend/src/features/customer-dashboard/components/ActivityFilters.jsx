import { Box } from "@mui/material";
import { dashboardStyles as s } from "../customer-dashboard.styles";

const TYPE_TABS = [
  { value: "orders", label: "الطلبات" },
  { value: "rides", label: "الرحلات" },
];

export default function ActivityFilters({ type, setType }) {
  return (
    <Box sx={s.filterTabs}>
      {TYPE_TABS.map((tab) => (
        <Box
          key={tab.value}
          component="button"
          sx={s.filterTab(type === tab.value)}
          onClick={() => setType(tab.value)}
        >
          {tab.label}
        </Box>
      ))}
    </Box>
  );
}
