import { useState } from "react";
import Menu from "../components/admin/Menu";
import { Outlet } from "react-router-dom";
import { Menu as MenuIcon } from "lucide-react";

const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Burger Menu Button - Mobile Only */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 hover:bg-gray-200 rounded-lg bg-white shadow-md"
        >
          <MenuIcon size={24} className="text-gray-700" />
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:transform-none lg:w-72 bg-white border-r border-gray-200 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <Menu onClose={() => setIsMenuOpen(false)} />
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mt-16 lg:mt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
