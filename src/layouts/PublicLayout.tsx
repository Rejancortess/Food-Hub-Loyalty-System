import { Outlet } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sm:px-15 px-5 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <UtensilsCrossed size={25} className="text-white" />
          </div>
          <span className="font-semibold sm:text-xl text-lg">
            K-warriors Food Hub
          </span>
        </div>
      </header>
      <main className="bg-gray-50 flex-1 justify-center flex">
        <Outlet />
      </main>
      <footer className="text-gray-400 flex items-center justify-center py-4 sm:text-sm text-xs border-t border-gray-100  ">
        &copy; {new Date().getFullYear()} K-warriors Food Hub. Eat fresh, fight
        hunger.
      </footer>
    </div>
  );
};

export default PublicLayout;
