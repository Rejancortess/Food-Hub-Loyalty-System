import { UtensilsCrossed } from "lucide-react";

const Header = () => {
  return (
    <header className="sm:px-20 px-5 py-3 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="bg-green-600 p-2 rounded-lg">
          <UtensilsCrossed size={25} className="text-white" />
        </div>
        <span className="font-semibold sm:text-xl text-lg">
          K-warriors Food Hub
        </span>
      </div>
    </header>
  );
};

export default Header;
