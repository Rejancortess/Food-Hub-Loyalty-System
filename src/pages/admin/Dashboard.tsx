import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../app/config/firebase";
import Dashboardcard from "../../components/admin/Dashboardcard";
import QuickActions from "../../components/admin/QuickActions";
import RecentActivity from "../../components/admin/RecentActivity";

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pointsIssuedToday, setPointsIssuedToday] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [rewardsRedeemed, setRewardsRedeemed] = useState(0);

  // Fetch total customers
  useEffect(() => {
    const customersQuery = query(
      collection(db, "users"),
      where("role", "==", "client"),
    );

    const unsubscribe = onSnapshot(customersQuery, (snapshot) => {
      setTotalCustomers(snapshot.size);
    });

    return unsubscribe;
  }, []);

  // Fetch active users (currently active)
  useEffect(() => {
    const activeQuery = query(
      collection(db, "users"),
      where("status", "==", "Active"),
    );

    const unsubscribe = onSnapshot(activeQuery, (snapshot) => {
      setActiveUsers(snapshot.size);
    });

    return unsubscribe;
  }, []);

  // Fetch points issued today
  useEffect(() => {
    const fetchPointsIssuedToday = async () => {
      try {
        const now = new Date();
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        const endOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
        );

        const usersSnapshot = await getDocs(collection(db, "users"));
        let totalPoints = 0;

        for (const userDoc of usersSnapshot.docs) {
          const transactionsQuery = query(
            collection(db, "users", userDoc.id, "transactions"),
            where("createdAt", ">=", Timestamp.fromDate(startOfDay)),
            where("createdAt", "<", Timestamp.fromDate(endOfDay)),
          );

          const transactionsSnapshot = await getDocs(transactionsQuery);
          transactionsSnapshot.forEach((doc) => {
            const pointsAdjustment = doc.data().pointsAdjustment ?? 0;
            if (pointsAdjustment > 0) {
              totalPoints += pointsAdjustment;
            }
          });
        }

        setPointsIssuedToday(totalPoints);
      } catch (error) {
        console.error("Error fetching points issued today:", error);
      }
    };

    fetchPointsIssuedToday();
    const interval = setInterval(fetchPointsIssuedToday, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Fetch rewards redeemed (for now, count published rewards)
  useEffect(() => {
    const rewardsQuery = query(
      collection(db, "rewards"),
      where("status", "==", "Published"),
    );

    const unsubscribe = onSnapshot(rewardsQuery, (snapshot) => {
      setRewardsRedeemed(snapshot.size);
    });

    return unsubscribe;
  }, []);
  return (
    <div className="py-4 sm:py-6 px-3 sm:px-0 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Dashboardcard variant="total-customers" number={totalCustomers} />
        <Dashboardcard
          variant="Points Issued Today"
          number={pointsIssuedToday}
        />
        <Dashboardcard variant="Active Scanners" number={activeUsers} />
        <Dashboardcard variant="Rewards Redeemed" number={rewardsRedeemed} />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
