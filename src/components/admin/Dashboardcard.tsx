import { User, Tag, ScanQrCode, Gift } from "lucide-react";

const Dashboardcard = ({
  variant,
  number,
}: {
  variant: string;
  number: number;
}) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-gray-500 sm:text-sm">
          {variant}
        </p>
        <h2 className="mt-1 text-lg font-bold text-gray-900 sm:mt-2 sm:text-2xl">
          {number.toLocaleString()}
        </h2>
      </div>
      <div>
        {variant === "total-customers" ? (
          <div className="flex items-center justify-center rounded-2xl bg-green-100 p-2">
            <User size={32} className="text-green-600 sm:hidden" />
            <User size={48} className="hidden text-green-600 sm:block" />
          </div>
        ) : variant === "Points Issued Today" ? (
          <div className="flex items-center justify-center rounded-2xl bg-green-100 p-2">
            <Tag size={32} className="text-green-600 sm:hidden" />
            <Tag size={48} className="hidden text-green-600 sm:block" />
          </div>
        ) : variant === "Active Scanners" ? (
          <div className="flex items-center justify-center rounded-2xl bg-blue-100 p-2">
            <ScanQrCode size={32} className="text-blue-600 sm:hidden" />
            <ScanQrCode size={48} className="hidden text-blue-600 sm:block" />
          </div>
        ) : variant === "Rewards Redeemed" ? (
          <div className="flex items-center justify-center rounded-2xl bg-purple-100 p-2">
            <Gift size={32} className="text-purple-600 sm:hidden" />
            <Gift size={48} className="hidden text-purple-600 sm:block" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboardcard;
