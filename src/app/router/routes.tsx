import type { RouteObject } from "react-router-dom";
import RequireAuth from "./guards/RequireAuth";
import RequireRole from "./guards/RequireRole";
import HomeRedirect from "./HomeRedirect";
import PublicLayout from "../../layouts/PublicLayout";
import ClientLayout from "../../layouts/ClientLayout";
import Login from "../../pages/public/Login";
import Register from "../../pages/public/Register";
import ClientDashboard from "../../pages/client/ClientDasboard";
import ForgetPassword from "../../pages/public/ForgetPassword";
import ResetPassword from "../../pages/public/ResetPassword";
import { PATHS } from "../config/constants";
import AdminLayout from "../../layouts/AdminLayout";
import AdminDashboard from "../../pages/Admin/AdminDashboard";

export const routes: RouteObject[] = [
  // Public routes
  {
    path: "/",
    element: <HomeRedirect />,
  },
  {
    path: PATHS.FORGOT_PASSWORD,
    element: <ForgetPassword />,
  },
  {
    path: PATHS.RESET_PASSWORD,
    element: <ResetPassword />,
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },

  // Client Protected routes
  {
    path: "/client",
    element: <RequireAuth />,
    children: [
      {
        element: <RequireRole role="client" />,
        children: [
          {
            element: <ClientLayout />,
            children: [
              {
                path: "dashboard",
                element: <ClientDashboard />,
              },
              {
                path: "qr-code",
                element: <div>Client QR Scanner</div>,
              },
            ],
          },
        ],
      },
    ],
  },

  // Admin Protected routes
  {
    path: "/admin",
    element: <RequireAuth />,
    children: [
      {
        element: <RequireRole role="admin" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: "dashboard",
                element: <AdminDashboard />,
              },
              {
                path: "qr-scanner",
                element: <div>Admin QR Scanner</div>,
              },
              {
                path: "rewards",
                element: <div>Admin Rewards Management</div>,
              },
            ],
          },
        ],
      },
    ],
  },
];