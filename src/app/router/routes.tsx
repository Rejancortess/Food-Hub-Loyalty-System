import type { RouteObject } from "react-router-dom";
import RequireAuth from "./guards/RequireAuth";
import RequireRole from "./guards/RequireRole";
import HomeRedirect from "./HomeRedirect";
import PublicLayout from "../../layouts/PublicLayout";
import Login from "../../pages/public/login";
import Register from "../../pages/public/Register";

export const routes: RouteObject[] = [
  // Public routes
  {
    path: "/",
    element: <HomeRedirect />,
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
            path: "dashboard",
            element: <div>Client Dashboard</div>,
          },
          {
            path: "scan",
            element: <div>Client QR Scanner</div>,
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
            path: "dashboard",
            element: <div>Admin Dashboard</div>,
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
];
