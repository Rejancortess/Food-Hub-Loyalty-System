import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send } from "lucide-react";
import logo from "../../assets/logo.png";
import { forgotPasswordWithEmail } from "../../features/auth/api";
import { PATHS } from "../../app/config/constants";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await forgotPasswordWithEmail(email.trim().toLowerCase());
      setSuccessMessage(
        "Password reset link sent. Please check your email inbox.",
      );
      setEmail("");
    } catch {
      setError("Unable to send reset email right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 h-screen flex items-center justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-5 py-8 shadow-md sm:px-8 sm:py-10">
        <img
          src={logo}
          alt="K-warriors Food Hub Logo"
          className="mx-auto mb-4 w-40 sm:w-44"
        />

        <h1 className="text-center text-2xl font-bold sm:text-3xl">
          Forgot Password
        </h1>
        <p className="mt-2 text-center text-sm font-light text-gray-600 sm:text-base">
          Enter your account email and we will send password reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <span className="text-sm font-semibold">Email Address</span>
            <div className="relative mt-2">
              <Mail
                size={20}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="e.g., warrior@foodhub.com"
                required
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-3 pr-3 pl-10 text-sm sm:text-base"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"} <Send size={18} />
          </button>
        </form>

        {successMessage ? (
          <p className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Link
          to={PATHS.LOGIN}
          className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-green-200 py-3 font-semibold text-green-700"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgetPassword;
