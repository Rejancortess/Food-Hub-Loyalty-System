import { Wallet, History } from "lucide-react";

const CurrentBalance = () => {
  return (
    <div className="mt-5 border p-5 rounded-lg bg-white shadow-sm border-green-500">
      <div className="flex gap-4 flex-col md:flex-row items-center justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="flex items-center justify-center bg-green-200 w-12 h-12 rounded-full">
            <Wallet className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <p className="font-light text-gray-500 ">YOUR CURRENT BALANCE</p>
            <p className="text-3xl font-extrabold">
              1,250 <span className="text-green-600">Points</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-center bg-gray-100 py-2 px-4 rounded-full font-bold">
          <History className="w-6 h-6 text-green-600" />
          <p className="text-sm">Recent: +50 pts</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentBalance;
