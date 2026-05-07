import CurrentBalance from "../../components/client/CurrentBalance";
import FoodCard from "../../components/client/FoodCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { useAuth } from "../../app/providers/AuthProvider";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../app/config/firebase";

type Reward = {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  imageUrl: string;
  category: string;
};

const ClientDashboard = () => {
  const { user } = useAuth();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCurrentPoints(Number(data?.points ?? data?.userBalance ?? 0));
        }
      },
      (error) => {
        console.error("Error fetching user points:", error);
      },
    );

    return unsubscribe;
  }, [user?.uid]);

  useEffect(() => {
    const rewardsQuery = query(
      collection(db, "rewards"),
      where("status", "==", "Published"),
    );

    const unsubscribe = onSnapshot(
      rewardsQuery,
      (snapshot) => {
        const liveRewards = snapshot.docs.map((rewardDoc) => {
          const data = rewardDoc.data();

          return {
            id: rewardDoc.id,
            name: data.name || "Reward",
            description: data.description || "",
            pointsRequired: Number(data.pointsRequired ?? 0),
            imageUrl: data.imageUrl || "",
            category: data.category || "Reward",
          };
        });

        setRewards(liveRewards);
      },
      (snapshotError) => {
        console.error("Error loading rewards:", snapshotError);
      },
    );

    return unsubscribe;
  }, []);

  return (
    <div className="py-10">
      <h1 className="font-bold text-3xl">Redeem Your Points</h1>
      <p className="font-extralight mt-2">
        Treat yourself! Exchange your earned points for these delicious rewards.
      </p>
      <CurrentBalance points={currentPoints} userId={user?.uid} />

      <Link to="/client/qr-code" className="flex">
        <div className="mt-5 bg-green-100 p-2 rounded-lg w-max cursor-pointer">
          <QrCode size={24} className="inline mr-2 text-green-600" />
          <span className="text-green-600 font-semibold cursor-pointer">
            View QR Code
          </span>
        </div>
      </Link>

      <p className="mt-7 font-bold text-xl">Published Rewards</p>
      <hr className="my-5 text-gray-300" />
      <div className="px-2 mt-5 flex flex-wrap gap-10 justify-center">
        {(rewards.length > 0 ? rewards : []).map((reward) => (
          <FoodCard
            key={reward.id}
            img={reward.imageUrl}
            points={reward.pointsRequired}
            name={reward.name}
            description={reward.description}
            isLocked={currentPoints < reward.pointsRequired}
          />
        ))}
        {rewards.length === 0 && (
          <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
            No rewards have been published yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
