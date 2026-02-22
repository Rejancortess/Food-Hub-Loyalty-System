import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { PATHS, ROLES } from "../config/constants";

export default function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (user.role === ROLES.ADMIN) {
    return <Navigate to={PATHS.ADMIN_DASHBOARD} replace />;
  }

  return <Navigate to={PATHS.CLIENT_DASHBOARD} replace />;
}
