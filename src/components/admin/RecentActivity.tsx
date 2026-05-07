import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../app/config/firebase";
import RecentUser from "./RecentUser";

type ActivityItem = {
  id: string;
  name: string;
  action: string;
  detail: string;
  points: string;
  time: string;
};

const formatTimeAgo = (value: unknown) => {
  if (!value || typeof value !== "object" || !("toDate" in value)) {
    return "Just now";
  }

  const date = (value as { toDate: () => Date }).toDate();
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const RecentActivity = () => {
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const activityQuery = query(
      collection(db, "auditLogs"),
      orderBy("performedAt", "desc"),
      limit(5),
    );

    const unsubscribe = onSnapshot(
      activityQuery,
      (snapshot) => {
        const items = snapshot.docs.map((activityDoc) => {
          const data = activityDoc.data();
          const pointsAdjustment = Number(data.pointsAdjustment ?? 0);
          const actionType =
            data.type === "points_adjustment"
              ? "updated points"
              : "performed an action";

          return {
            id: activityDoc.id,
            name: data.customerName || data.performedBy || "Admin",
            action: actionType,
            detail:
              data.adminNote || data.transactionType || "Recent admin activity",
            points: `${pointsAdjustment >= 0 ? "+" : ""}${pointsAdjustment} pts`,
            time: formatTimeAgo(data.performedAt ?? data.createdAt),
          };
        });

        setRecentActivities(items);
      },
      (error) => {
        console.error("Failed to load recent activity:", error);
      },
    );

    return unsubscribe;
  }, []);

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-gray-200">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
      </div>
      {recentActivities.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {recentActivities.map((activity) => (
            <RecentUser
              key={activity.id}
              name={activity.name}
              action={activity.action}
              detail={activity.detail}
              points={activity.points}
              time={activity.time}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
          No recent activity yet.
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
