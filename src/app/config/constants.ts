export const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

const configuredAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)
  ?.trim()
  .toLowerCase();

export const ADMIN_EMAIL = configuredAdminEmail || "";

export const PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  CLIENT_DASHBOARD: "/client/dashboard",
  CLIENT_SCAN: "/client/scan",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_QR: "/admin/qr-scanner",
  ADMIN_REWARD_NEW: "/admin/rewards/new",
} as const;

export function resolveRoleByEmail(email: string | null | undefined): Role {
  if (email && ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL) {
    return ROLES.ADMIN;
  }

  return ROLES.CLIENT;
}
