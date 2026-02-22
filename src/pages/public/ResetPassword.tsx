import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock, Send } from "lucide-react";
import logo from "../../assets/logo.png";
import {
  resetPasswordWithCode,
  verifyResetCode,
} from "../../features/auth/api";
import { PATHS } from "../../app/config/constants";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = useMemo(() => searchParams.get("oobCode") ?? "", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function checkCode() {
      if (!code) {
        if (isMounted) {
          setError("Invalid reset link. Please request a new password reset email.");
          setIsVerifying(false);
        }
        return;
      }

      try {
        const accountEmail = await verifyResetCode(code);
        if (!isMounted) {
          return;
        }

        setEmail(accountEmail);
      } catch {
        if (!isMounted) {
          return;
        }

        setError("This reset link is invalid or expired. Please request a new one.");
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    void checkCode();

    return () => {
      isMounted = false;
    };
  }, [code]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!code) {
      setError("Invalid reset link. Please request a new password reset email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await resetPasswordWithCode(code, password);
      setSuccessMessage("Password reset successful. You can now log in.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Unable to reset password. Please request a new reset email.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-5 py-8 shadow-md sm:px-8 sm:py-10">
        <img
          src={logo}
          alt="K-warriors Food Hub Logo"
          className="mx-auto mb-4 w-40 sm:w-44"
        />

        <h1 className="text-center text-2xl font-bold sm:text-3xl">Reset Password</h1>
        <p className="mt-2 text-center text-sm font-light text-gray-600 sm:text-base">
          {email
            ? `Set a new password for ${email}.`
            : "Set a new password to access your account again."}
        </p>

        {isVerifying ? (
          <p className="mt-6 rounded-md bg-gray-100 p-3 text-center text-sm text-gray-600">
            Verifying reset link...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <span className="text-sm font-semibold">New Password</span>
              <div className="relative mt-2">
                <Lock
                  size={20}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter new password"
                  minLength={6}
                  required
                  className="w-full rounded-md border border-gray-300 bg-gray-50 py-3 pr-3 pl-10 text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold">Confirm Password</span>
              <div className="relative mt-2">
                <Lock
                  size={20}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
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
              {isSubmitting ? "Resetting..." : "Reset Password"} <Send size={18} />
            </button>
          </form>
        )}

        {successMessage ? (
          <p className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
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

export default ResetPassword;
