import { CircleUser } from "lucide-react";

type RecentUserProps = {
  name: string;
  action: string;
  detail: string;
  points: string;
  time: string;
};

const RecentUser = ({
  name,
  action,
  detail,
  points,
  time,
}: RecentUserProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-start gap-3 sm:flex-1 sm:items-center">
          <CircleUser className="h-10 w-10 shrink-0 text-gray-400 sm:h-12 sm:w-12" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 sm:text-base">
              {name}{" "}
              <span className="text-xs sm:text-sm text-gray-500">{action}</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{detail}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm sm:ml-auto sm:min-w-32 sm:flex-col sm:items-end sm:justify-center gap-2">
          <span className="font-semibold text-orange-500">{points}</span>
          <span className="text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default RecentUser;
