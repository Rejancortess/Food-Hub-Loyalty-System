import { CircleUser } from "lucide-react";

const RecentUser = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-start gap-3 sm:flex-1 sm:items-center">
          <CircleUser className="h-11 w-11 shrink-0 text-gray-400 sm:h-12 sm:w-12" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 sm:text-base">
              Rejan{" "}
              <span className="text-sm text-gray-500">redeemed a reward</span>
            </p>
            <p className="text-sm text-gray-500">Loyalty level: Gold</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs sm:ml-auto sm:min-w-28 sm:flex-col sm:items-end sm:justify-center">
          <span className="text-orange-500">-500 pts</span>
          <span className="text-gray-400">2 hours ago</span>
        </div>
      </div>
    </div>
  );
};

export default RecentUser;
