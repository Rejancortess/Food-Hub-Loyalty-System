import { ScanQrCode, CirclePlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { PATHS } from "../../app/config/constants";

const QuickActions = () => {
  return (
    <div className="bg-white p-4 sm:p-6 shadow-sm ring-1 ring-gray-200 rounded-2xl h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3 flex flex-col">
        <NavLink
          to={PATHS.ADMIN_QR}
          className="flex items-center justify-center gap-3 rounded-xl bg-green-600 hover:bg-green-700 px-4 py-3 font-semibold text-white transition-colors"
        >
          <ScanQrCode className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-sm sm:text-base">Scan QR Code</span>
        </NavLink>

        <NavLink
          to={PATHS.ADMIN_ADDNEWREWARD}
          className="flex items-center justify-center gap-3 rounded-xl bg-green-100 hover:bg-green-200 px-4 py-3 font-semibold text-green-600 transition-colors"
        >
          <CirclePlus className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-sm sm:text-base">Add New Reward</span>
        </NavLink>

        <NavLink
          to={PATHS.ADMIN_ADDPOINTS}
          className="flex items-center justify-center gap-3 rounded-xl bg-blue-100 hover:bg-blue-200 px-4 py-3 font-semibold text-blue-600 transition-colors"
        >
          <CirclePlus className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-sm sm:text-base">Add Points</span>
        </NavLink>
      </div>
    </div>
  );
};

export default QuickActions;
