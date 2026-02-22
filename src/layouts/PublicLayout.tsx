import { Outlet } from "react-router-dom";
import { Gift, PartyPopper, Hamburger } from "lucide-react";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="bg-gray-50 flex-1 justify-center flex flex-col items-center gap-6 py-10">
        <Outlet />
        <div className="text-center ">
          <p className="text-sm px-10 text-gray-500">
            Need help with your account?{" "}
            <span className="font-semibold text-green-600">
              Contact Support
            </span>
          </p>
        </div>
        <div className="flex gap-10 items-center justify-center text-xs mt-5">
          <div className="flex flex-col items-center gap-1">
            <Gift size={30} className="text-green-600" />
            <p>EARN POINTS</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <PartyPopper size={30} className="text-green-600" />
            <p>BIRTHDAYS</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Hamburger size={30} className="text-green-600 " />
            <p>FREE MEALS</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
