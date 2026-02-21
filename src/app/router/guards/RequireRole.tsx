import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

type Props = {
  role: "admin" | "client";
};

export default function RequireRole({ role }: Props) {
  const { user } = useAuth();

  if (user?.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
