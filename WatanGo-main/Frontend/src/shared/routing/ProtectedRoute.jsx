import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { redirectToOwnDashboard, useAuth } from "@/lib/auth";

const LOGIN_REQUIRED_MESSAGE_KEY = "watan_go_login_required_message";
const LOGIN_REQUIRED_MESSAGE = "Please log in to access this section.";

function FullPageLoader() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress color="success" />
    </Box>
  );
}

export function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuth();

  if (typeof window === "undefined") return <FullPageLoader />;

  if (!isAuthenticated || !user) {
    sessionStorage.setItem(LOGIN_REQUIRED_MESSAGE_KEY, LOGIN_REQUIRED_MESSAGE);
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={redirectToOwnDashboard(user)} replace />;
  }

  return children;
}
