import Dashboardcard from "../../components/admin/Dashboardcard";
import RecentActivity from "../../components/admin/RecentActivity";

const Dashboard = () => {
  return (
    <div>
      <div className="mb-10 text-2xl font-bold">Dashboard</div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        <Dashboardcard variant="total-customers" number={1293} />
        <Dashboardcard variant="Points Issued Today" number={456} />
        <Dashboardcard variant="Active Scanners" number={789} />
        <Dashboardcard variant="Rewards Redeemed" number={101} />
      </div>
      <div className="mt-10">
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
