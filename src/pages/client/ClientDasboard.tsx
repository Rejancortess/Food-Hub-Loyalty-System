import CurrentBalance from "../../components/client/CurrentBalance";
import FoodCard from "../../components/client/FoodCard";
import { Link } from "react-router-dom";
import Food1 from "../../assets/food/food-1.png";
import Food2 from "../../assets/food/food-2.png";
import Food3 from "../../assets/food/food-3.png";
import Food4 from "../../assets/food/food-4.png";
import Food5 from "../../assets/food/food-5.png";
import { QrCode } from "lucide-react";

const ClientDashboard = () => {
  const FoodImage = {
    Food1,
    Food2,
    Food3,
    Food4,
    Food5,
  };

  return (
    <div className="py-5 px-2 sm:px-20">
      <h1 className="font-bold text-3xl">Redeem Your Points</h1>
      <p className="font-extralight mt-2">
        Treat yourself! Exchange your earned points for these delicious rewards.
      </p>
      <CurrentBalance />

      <Link to="/client/qr-code" className="flex">
        <div className="mt-5 bg-green-100 p-2 rounded-lg w-max cursor-pointer">
          <QrCode size={24} className="inline mr-2 text-green-600" />
          <span className="text-green-600 font-semibold cursor-pointer">
            View QR Code
          </span>
        </div>
      </Link>

      <p className="mt-7 font-bold text-xl">Available Rewards</p>
      <hr className="my-5 text-gray-300" />
      <div className="px-2 mt-5 flex flex-wrap gap-10">
        {Object.entries(FoodImage).map(([key, value]) => (
          <FoodCard key={key} img={value} />
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;
