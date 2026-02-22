import { useState } from "react";
import logo from "../../assets/logo.png";
import { Mail, Lock, EyeClosed, Eye, ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="px-4 sm:px-6">
      <div>
        <img
          src={logo}
          alt="K-warriors Food Hub Logo"
          className="w-50 my-5 mx-auto "
        />
      </div>
      <div className="text-center px-4">
        <h1 className="text-2xl font-bold text-center">
          Welcome to K-warriors Food Hub Loyalty Program
        </h1>
        <p className="text-gray-500 mt-2 font-light">
          Join the hub and start earning rewards with every bite!
        </p>
      </div>

      <div className="bg-white mt-10 rounded-2xl overflow-hidden shadow-md w-full max-w-md mx-auto">
        <div className="flex justify-around border-b border-gray-200">
          <div className=" w-1/2 p-4 font-semibold justify-center flex ">
            <Link to="/login">Login</Link>
          </div>
          <div className="p-2 w-1/2 flex justify-center items-center font-semibold border-b-3 border-green-500 text-green-600">
            Register
          </div>
        </div>
        <div className="px-4 sm:px-8 py-10">
          <form action="" className="flex flex-col gap-4">
            <div>
              <span className="font-semibold text-sm">Full Name</span>
              <div className="relative mt-2">
                <Mail
                  size={22}
                  className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="border w-full p-2 rounded-md py-3 pl-11 bg-gray-50 border-gray-300 focus:ring-green-500 focus:border-green-500 font-extralight"
                />
              </div>
            </div>

            <div>
              <span className="font-semibold text-sm">Email Address</span>
              <div className="relative mt-2">
                <Mail
                  size={22}
                  className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-400 pointer-events-none"
                />
                <input
                  type="email"
                  placeholder="warrior@foodhub.com"
                  className="border w-full p-2 rounded-md py-3 pl-11 bg-gray-50 border-gray-300 focus:ring-green-500 focus:border-green-500 font-extralight"
                />
              </div>
            </div>

            <div>
              <span className="font-semibold text-sm">Mobile Number</span>
              <div className="relative mt-2">
                <Phone
                  size={22}
                  className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-400 pointer-events-none"
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="09XX-XXX-XXXX"
                  maxLength={11}
                  className="border w-full p-2 rounded-md py-3 pl-11 bg-gray-50 border-gray-300 focus:ring-green-500 focus:border-green-500 font-extralight"
                />
              </div>
            </div>

            <div>
              <span className="font-semibold text-sm">Password</span>
              <div className="relative mt-2">
                <Lock
                  size={22}
                  className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-400 pointer-events-none"
                />
                <input
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  className="border w-full font-extralight p-2 rounded-md py-3 pl-11 pr-11 bg-gray-50 border-gray-300 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeClosed size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>
            <button className="bg-green-600 text-white font-bold  w-full py-3 rounded-lg mt-4 flex items-center justify-center gap-2">
              Login as Warrior <ArrowRight size={20} />
            </button>
            <div className="flex items-center gap-4 my-4">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-500 text-sm font-extralight">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>
            <button className="border border-green-500 py-3 rounded-xl font-semibold text-green-600">
              Register for new Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
