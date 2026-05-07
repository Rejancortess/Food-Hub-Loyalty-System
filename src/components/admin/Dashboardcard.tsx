import { User, Tag, ScanQrCode, Gift, Loader2 } from "lucide-react";

const Dashboardcard = ({
  variant,
  number,
  loading = false,
}: {
  variant: string;
  number: number;
  loading?: boolean;
}) => {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-gray-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-medium tracking-wide text-gray-500 sm:text-sm">
          {variant}
        </p>
        <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 sm:mt-2">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : (
            number.toLocaleString()
          )}
        </h2>
      </div>
      <div>
        {variant === "total-customers" ? (
          <div className="flex items-center justify-center rounded-2xl bg-green-100 p-3 sm:p-4">
            <User size={32} className="text-green-600 sm:w-10 sm:h-10" />
          </div>
        ) : variant === "Points Issued Today" ? (
          <div className="flex items-center justify-center rounded-2xl bg-green-100 p-3 sm:p-4">
            <Tag size={32} className="text-green-600 sm:w-10 sm:h-10" />
          </div>
        ) : variant === "Active Scanners" ? (
          <div className="flex items-center justify-center rounded-2xl bg-blue-100 p-3 sm:p-4">
            <ScanQrCode size={32} className="text-blue-600 sm:w-10 sm:h-10" />
          </div>
        ) : variant === "Rewards Redeemed" ? (
          <div className="flex items-center justify-center rounded-2xl bg-purple-100 p-3 sm:p-4">
            <Gift size={32} className="text-purple-600 sm:w-10 sm:h-10" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboardcard;
