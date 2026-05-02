import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Trophy, CircleStar, Medal, Hamburger } from "lucide-react";
import { useAuth } from "../../app/providers/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/config/firebase";

type QrcodeCardProps = {
  currentBalance: number;
  currentLevel?: string;
};

export const QrcodeCard = ({
  currentBalance,
  currentLevel,
}: QrcodeCardProps) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  const qrValue = user?.uid
    ? JSON.stringify({
        userId: user.uid,
        email: user.email,
        points: currentBalance,
        level: currentLevel || "Bronze",
        timestamp: new Date().toISOString(),
      })
    : "no-user-data";
  const memberName = userData?.fullName || "Member";
  const level = currentLevel || "Bronze";

  return (
    <div className="mx-auto mt-5 w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg sm:max-w-3xl">
      <div className="border-b border-gray-100 bg-linear-to-b from-white to-gray-50 px-4 py-8 sm:px-8">
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
            <p className="text-sm text-gray-500">Loading QR Code...</p>
          </div>
        ) : (
          <div className="mx-auto flex w-fit rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <QRCodeSVG
              value={qrValue}
              size={240}
              level="H"
              includeMargin={true}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>
        )}
      </div>
      <div className="px-4 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 leading-tight">
              Member Name
            </span>
            <p className="mt-1 text-lg font-semibold leading-tight text-gray-900">
              {memberName}
            </p>
          </div>
          <div className="flex items-center self-start rounded-full bg-green-100 px-3 py-2 text-green-700 sm:self-center">
            <Trophy className="text-yellow-500" />
            <span className="ml-2 text-sm font-bold">{level} Warrior</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-4 text-center">
            <span>
              <CircleStar className="text-green-500" />
            </span>
            <span className="mt-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Total Points
            </span>
            <span className="mt-1 text-sm font-bold text-gray-900">
              {currentBalance.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-4 text-center">
            <span>
              <Medal className="text-green-500" />
            </span>
            <span className="mt-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Current Level
            </span>
            <span className="mt-1 text-sm font-bold text-gray-900">
              {level}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-4 text-center">
            <span>
              <Hamburger className="text-green-500" />
            </span>
            <span className="mt-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Visits
            </span>
            <span className="mt-1 text-sm font-bold text-gray-900">21</span>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700">
          Show this to the cashier to earn or redeem points.
        </div>
      </div>
    </div>
  );
};
