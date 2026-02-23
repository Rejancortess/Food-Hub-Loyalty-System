import Button from "../ui/Button";

type FoodCardProps = {
  img: string;
  points: number;
  name: string;
  description: string;
  isLocked?: boolean;
};

const FoodCard = ({
  img,
  points,
  name,
  description,
  isLocked = false,
}: FoodCardProps) => {
  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden h-[340px] w-[300px] flex flex-col ${
        isLocked ? "opacity-75" : ""
      }`}
    >
      <div className="h-40 relative">
        <img src={img} className="w-full h-full object-cover" alt="Food" />
        <span className="absolute top-3 right-4 bg-white text-green-600 text-xs font-bold px-2 py-1 rounded-full">
          {points} pts
        </span>
        {isLocked && (
          <span className="absolute top-3 left-4 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full">
            Locked
          </span>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <p className="font-semibold text-xl">{name}</p>
        <p className="text-sm font-light mt-1 h-10 overflow-hidden">{description}</p>
        <Button className="mt-auto" disabled={isLocked}>
          {isLocked ? "Locked" : "Redeem"}
        </Button>
      </div>
    </div>
  );
};

export default FoodCard;
