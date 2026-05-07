import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  X,
  ScanQrCode,
  Gift,
  Coins,
} from "lucide-react";
import { PATHS } from "../../app/config/constants";
import { logout as logoutUser } from "../../features/auth/api";

const linkBase =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors";

interface MenuProps {
  onClose?: () => void;
}

const Menu = ({ onClose }: MenuProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate(PATHS.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="h-full p-4 sm:p-6 flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div className="rounded-2xl bg-green-600 px-4 py-5 text-white shadow-sm flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">
            K-warriors
          </p>
          <p className="mt-1 text-xl font-bold">Admin Menu</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden ml-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} className="text-gray-700" />
          </button>
        )}
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
            <ScanQrCode size={18} />
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
        <li>
          <NavLink
            to={PATHS.ADMIN_ADDPOINTS}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Coins size={18} />
            Add Points
          </NavLink>
        </li>
        <li>
          <NavLink
            to={PATHS.ADMIN_ADDNEWREWARD}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Gift size={18} />
            Add New Reward
          </NavLink>
        </li>
      </ul>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-4  text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Menu;
