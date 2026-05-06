import { NavLink } from "react-router-dom";
import { LayoutDashboard, QrCode, Users } from "lucide-react";
import { PATHS } from "../../app/config/constants";

const linkBase =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors";

const Menu = () => {
  return (
    <nav className="h-full p-4 sm:p-6">
      <div className="mb-6 rounded-2xl bg-green-600 px-4 py-5 text-white shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-white/80">
          K-warriors
        </p>
        <p className="mt-1 text-xl font-bold">Admin Menu</p>
      </div>

      <ul className="space-y-2">
        <li>
          <NavLink
            to={PATHS.ADMIN_DASHBOARD}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to={PATHS.ADMIN_QR}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <QrCode size={18} />
            QR Scanner
          </NavLink>
        </li>
        <li>
          <NavLink
            to={PATHS.ADMIN_CUSTOMERS}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Users size={18} />
            Customers
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
