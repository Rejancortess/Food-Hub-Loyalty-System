import logo from "../../assets/logo.png";

const Login = () => {
  return (
    <div>
      <div>
        <img
          src={logo}
          alt="K-warriors Food Hub Logo"
          className="w-50 my-5 mx-auto "
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-center">
          Welcome Back, Warrior!
        </h1>
        <p className="text-gray-500 mt-2 font-light">
          Access your rewards and track your food journey.
        </p>
      </div>
      <div className="bg-white mt-5">
        <div className="flex justify-around">
          <div className="border-b-2 border-blue-500 w-1/2 p-4 font-semibold justify-center flex">
            Login
          </div>
          <div className="p-2 w-1/2 flex justify-center items-center font-semibold">
            Register
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
