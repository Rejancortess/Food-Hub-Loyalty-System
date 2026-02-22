import Footer from "../components/public/Footer";
import Header from "../components/public/Header";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="p-5 flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
