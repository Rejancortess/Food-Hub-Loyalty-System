import Button from "../ui/Button";

const FoodCard = ({ img }: { img: string }) => {
  return (
    <div className=" rounded-lg shadow-md overflow-hidden h-80 flex flex-col max-w-100">
      <div className="h-1/2">
        <img src={img} className="w-full h-full object-cover" alt="Food" />
      </div>
      <div className="h-1/2 p-4">
        <p className="font-semibold text-xl">Warrior burger</p>
        <p className="text-sm font-light">
          Our signature double patty with secret sauce.
        </p>
        <Button>Redeem</Button>
      </div>
    </div>
  );
};

export default FoodCard;
