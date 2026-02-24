import { useState } from "react";
import { UtensilsCrossed, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../app/config/constants";
import { useAuth } from "../../app/providers/AuthProvider";
import { logout as logoutUser } from "../../features/auth/api";

type HeaderProps = {
  showLogout?: boolean;
};

const Header = ({ showLogout = false }: HeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } finally {
      logout();
      navigate(PATHS.LOGIN, { replace: true });
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sm:px-40 px-10 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <UtensilsCrossed size={25} className="text-white" />
          </div>
          <span className="font-semibold sm:text-xl text-lg">
            K-warriors Food Hub
          </span>
        </div>
        {showLogout && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogOut size={16} />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
