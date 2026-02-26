import { Outlet } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import AdminHeader from "../components/Admin/AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans flex-1">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;