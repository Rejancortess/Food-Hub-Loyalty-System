import Footer from "../components/public/Footer";
import Header from "../components/public/Header";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showLogout />
      <main className="sm:px-40 px-10 flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
