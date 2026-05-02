import { useState } from "react";
import logo from "../../assets/logo.png";
import { Mail, Lock, EyeClosed, Eye, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail } from "../../features/auth/api";
import { PATHS, resolveRoleByEmail, ROLES } from "../../app/config/constants";
import { useAuth } from "../../app/providers/AuthProvider";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const credential = await loginWithEmail(trimmedEmail, password);

      const role = resolveRoleByEmail(trimmedEmail);
      login({
        uid: credential.user.uid,
        email: credential.user.email,
        role,
      });
      toast.success("Login successful!");

      if (role === ROLES.ADMIN) {
        navigate(PATHS.ADMIN_DASHBOARD, { replace: true });
        return;
      }

      navigate(PATHS.CLIENT_DASHBOARD, { replace: true });
    } catch {
      setError("Invalid email or password. Please try again.");
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-4 sm:px-6">
      <div>
        <img
          src={logo}
          alt="K-warriors Food Hub Logo"
          className="w-60 mb-4 mx-auto "
        />
      </div>
      <div className="text-center px-4">
        <h1 className="text-2xl font-bold text-center">
          Welcome Back, Warrior!
        </h1>
        <p className="text-gray-500 mt-2 font-light">
          Access your rewards and track your food journey.
        </p>
      </div>

      <div className="bg-white mt-10 rounded-2xl overflow-hidden shadow-md w-full max-w-md mx-auto">
        <div className="flex justify-around border-b border-gray-200">
          <div className="border-b-3 border-green-500 w-1/2 p-4 font-semibold justify-center flex text-green-600">
            Login
          </div>
          <div className="p-2 w-1/2 flex justify-center items-center font-semibold">
            <Link to="/register">Register</Link>
          </div>
        </div>
        <div className="px-4 sm:px-8 py-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <span className="font-semibold text-sm">Email Address</span>
              <div className="relative mt-2">
                <Mail
                  size={22}
                  className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-400 pointer-events-none"
                />
                <input
                  type="email"
                  placeholder="Enter your warrior email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
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
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
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

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login as Warrior"}
              <ArrowRight size={20} />
            </Button>
            <div className="flex items-center gap-4 my-4">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-500 text-sm font-extralight">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>
            <button
              type="button"
              className="border border-green-500 py-3 rounded-xl font-semibold text-green-600"
            >
              <Link to="/register">Register for new Account</Link>
            </button>
          </form>
          <div className="text-center mt-5 font-extralight cursor-pointer">
            <Link to={PATHS.FORGOT_PASSWORD}>Forget Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
