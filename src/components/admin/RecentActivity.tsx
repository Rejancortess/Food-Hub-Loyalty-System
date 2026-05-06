import RecentUser from "./RecentUser";

const RecentActivity = () => {
  const recentUsers: Array<unknown> = [1, 2, 3, 4]; // Mock data for recent users

  return (
    <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:mt-8 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
      </div>
      {recentUsers.length > 0 ? (
        <div className="space-y-2">
          <RecentUser />
          <RecentUser />
          <RecentUser />
          <RecentUser />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
          No recent user activity.
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
