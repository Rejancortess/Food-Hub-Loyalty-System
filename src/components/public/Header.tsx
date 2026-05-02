import { useState } from "react";
import { UtensilsCrossed, LogOut, Menu, X, Home, QrCode } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    setIsMenuOpen(false);
    try {
      await logoutUser();
      logout();
    } catch (error) {
      console.error("Logout error:", error);
      logout();
    } finally {
      navigate(PATHS.LOGIN, { replace: true });
    }
  }

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="sm:px-40 px-10 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <UtensilsCrossed size={25} className="text-white" />
          </div>
          <span className="font-semibold sm:text-xl text-sm">
            K-warriors Food Hub
          </span>
        </div>
        {showLogout && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <button
                  type="button"
                  onClick={() => handleNavigation(PATHS.CLIENT_DASHBOARD)}
                  className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-50 border-b border-gray-100 text-gray-700"
                >
                  <Home size={18} />
                  <span className="font-medium">Home</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigation(PATHS.CLIENT_SCAN)}
                  className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-50 border-b border-gray-100 text-gray-700"
                >
                  <QrCode size={18} />
                  <span className="font-medium">QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-red-50 text-red-600 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <LogOut size={18} />
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
