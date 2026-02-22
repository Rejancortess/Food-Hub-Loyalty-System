import { Outlet } from "react-router-dom";
import { UtensilsCrossed, Gift, PartyPopper, Hamburger } from "lucide-react";

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
      <main className="bg-gray-50 flex-1 justify-center flex flex-col items-center gap-6 py-10">
        <Outlet />
        <div className="text-center ">
          <p className="text-sm px-10 text-gray-500">
            Need help with your account?{" "}
            <span className="font-semibold text-green-600">
              Contact Support
            </span>
          </p>
        </div>
        <div className="flex gap-10 items-center justify-center text-xs mt-5">
          <div className="flex flex-col items-center gap-1">
            <Gift size={30} className="text-green-600" />
            <p>EARN POINTS</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <PartyPopper size={30} className="text-green-600" />
            <p>BIRTHDAYS</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Hamburger size={30} className="text-green-600 " />
            <p>FREE MEALS</p>
          </div>
        </div>
      </main>
      <footer className="text-gray-400 flex items-center justify-center py-4 sm:text-sm text-xs border-t border-gray-100  ">
        &copy; {new Date().getFullYear()} K-warriors Food Hub. Eat fresh, fight
        hunger.
      </footer>
    </div>
  );
};

export default PublicLayout;
