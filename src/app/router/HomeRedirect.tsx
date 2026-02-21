import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function HomeRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/client/dashboard" replace />;
}
