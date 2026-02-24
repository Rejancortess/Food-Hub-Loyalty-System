import CurrentBalance from "../../components/client/CurrentBalance";
import FoodCard from "../../components/client/FoodCard";
import { Link } from "react-router-dom";
import Food1 from "../../assets/food/food-1.png";
import Food2 from "../../assets/food/food-2.png";
import Food3 from "../../assets/food/food-3.png";
import Food4 from "../../assets/food/food-4.png";
import Food5 from "../../assets/food/food-5.png";
import Food6 from "../../assets/food/food-6.png";
import Food7 from "../../assets/food/food-7.png";

import { QrCode } from "lucide-react";

const ClientDashboard = () => {
  const freeFood = [
    {
      img: Food1,
      points: 100,
      name: "Warrior Burger",
      description: "Our signature double patty with secret sauce.",
    },
    {
      img: Food2,
      points: 150,
      name: "Spicy Chicken Wrap",
      description: "A fiery wrap packed with crispy chicken and fresh veggies.",
    },
    {
      img: Food3,
      points: 130,
      name: "Cheese Loaded Fries",
      description: "Crispy fries topped with melted cheese and herbs.",
    },
    {
      img: Food4,
      points: 180,
      name: "BBQ Beef Bowl",
      description: "Smoky BBQ beef served with rice and fresh greens.",
    },
    {
      img: Food5,
      points: 3000,
      name: "Classic Club Sandwich",
      description: "Triple-layer sandwich with ham, cheese, and veggies.",
    },
    {
      img: Food6,
      points: 250,
      name: "Veggie Delight Salad",
      description: "A refreshing mix of greens, veggies, and light dressing.",
    },
    {
      img: Food7,
      points: 5000,
      name: "Ultimate Feast Platter",
      description:
        "A grand platter featuring a bit of everything for the true food warrior.",
    },
  ];

  const currentPoints = 1250;

  return (
    <div className="py-10">
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
      <div className="px-2 mt-5 flex flex-wrap gap-10 justify-center">
        {freeFood.map((food) => (
          <FoodCard
            key={food.name}
            img={food.img}
            points={food.points}
            name={food.name}
            description={food.description}
            isLocked={currentPoints < food.points}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;
