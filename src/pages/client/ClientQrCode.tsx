import { QrcodeCard } from "../../components/client/QrcodeCard";
import { Award, ScanBarcode, Share2, ArrowDownToLine } from "lucide-react";
import { useAuth } from "../../app/providers/AuthProvider";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/config/firebase";

const WarriorLevels = [
  { level: "Bronze", points: 0 },
  { level: "Silver", points: 500 },
  { level: "Gold", points: 1000 },
  { level: "Platinum", points: 2000 },
  { level: "Diamond", points: 5000 },
];

const ClientQrCode = () => {
  const { user } = useAuth();
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCurrentBalance(Number(data?.points ?? data?.userBalance ?? 0));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setCurrentBalance(0);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  const getCurrentLevel = (balance: number) => {
    return [...WarriorLevels]
      .reverse()
      .find((warrior) => balance >= warrior.points);
  };

  const currentLevel = getCurrentLevel(currentBalance);

  return (
    <div className="my-10 px-4 sm:px-0">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-linear-to-r from-green-600 to-emerald-500 px-6 py-8 text-white shadow-lg sm:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80">
              Membership Access
            </p>
            <p className="mt-2 text-3xl font-bold sm:text-4xl">
              Your Membership QR Code
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
              Scan this code at checkout to earn or redeem points instantly.
            </p>
          </div>
        </div>

        <QrcodeCard
          currentBalance={currentBalance}
          currentLevel={currentLevel?.level || "Bronze"}
        />
        <div className="mt-8 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
          <div className="flex items-center gap-2">
            <Award className="text-green-500" />
            <span className="text-sm font-bold uppercase tracking-wide text-gray-700">
              Warrior Levels
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {WarriorLevels.map((warrior) => {
              const isCurrent = currentLevel?.level === warrior.level;

              return (
                <div
                  key={warrior.level}
                  className={`flex h-full flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                    isCurrent
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="text-sm font-semibold text-gray-900">
                    {warrior.level}
                  </span>
                  <p className="mt-1 text-sm text-gray-500">
                    {warrior.points.toLocaleString()} pts
                  </p>
                  {isCurrent && (
                    <span className="mt-2 rounded-full bg-green-600 px-3 py-1 text-[11px] font-semibold text-white">
                      Current level
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-green-600 px-4 py-4 text-center shadow-lg sm:px-6">
          <ScanBarcode size={24} className="mx-auto text-white" />
          <span className="mt-2 block text-sm font-semibold text-white">
            Show this to the cashier to earn or redeem points.
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <Share2 size={20} />
            <span>Share Your Code</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <ArrowDownToLine size={20} />
            <span>Download Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientQrCode;
