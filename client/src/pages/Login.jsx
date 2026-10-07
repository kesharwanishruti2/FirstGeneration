import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import axios from "axios";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If already logged in, send directly to dashboard
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u?._id) {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (e) {}
  }, [navigate]);

  const [email, setEmail] = useState(location.state?.registeredEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(location.state?.redirectMsg || "");
  const [successMsg, setSuccessMsg] = useState(location.state?.successMsg || "");
  const [isNotRegistered, setIsNotRegistered] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setIsNotRegistered(false);

    try {
      const response = await axios.post("http://localhost:3000/api/users/login", {
        email: email.trim(),
        password: password
      });

      const user = response.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      // If user hasn't taken the assessment yet, guide them to assessment; otherwise go to dashboard
      const currentLevel = user?.assessment?.level;
      if (!currentLevel || currentLevel === "Not assessed") {
        navigate("/assessment");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const isUnregistered = error.response?.status === 404 || error.response?.data?.notRegistered;
      setIsNotRegistered(!!isUnregistered);

      setErrorMsg(
        error.response?.data?.message ||
        "Could not connect to server. Please ensure the backend is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9F6] text-[#173B3A]">
      {/* Top Header */}
      <header className="border-b border-[#E4EBE7] bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-[#24645D] transition hover:text-[#173B3A]"
          >
            <span>←</span> Back to Home
          </Link>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCEFE8] text-lg shadow-xs">
              🌐
            </div>
            <span className="text-lg font-bold tracking-tight">
              Net<span className="text-[#E67E52]">Learn</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="rounded-3xl border border-[#E4EBE7] bg-white p-8 shadow-xl shadow-emerald-950/5">
            
            {/* Header Badge & Title */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCEFE8] text-2xl shadow-inner">
                🔑
              </div>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#173B3A]">
                Welcome Back
              </h1>
              <p className="mt-1.5 text-xs text-[#71817D]">
                Enter your registered credentials to continue your learning journey.
              </p>
            </div>

            {/* Success Message Alert (from Registration) */}
            {successMsg && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs text-[#1E615A] animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base">✅</span>
                  <div className="flex-1">
                    <p className="font-semibold leading-relaxed">{successMsg}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs text-rose-800 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base">⚠️</span>
                  <div className="flex-1">
                    <p className="font-semibold leading-relaxed">{errorMsg}</p>
                    {isNotRegistered && (
                      <div className="mt-3">
                        <Link
                          to="/signup"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#24645D] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#1b4d47]"
                        >
                          Register Free Account →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173B3A]">
                  Email Address
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#D5E2DC] bg-[#FAFDFB] px-4 py-3 text-sm text-[#173B3A] placeholder-[#9AA8A4] outline-none transition focus:border-[#24645D] focus:bg-white focus:ring-2 focus:ring-[#24645D]/15"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#173B3A]">
                    Password
                  </label>
                </div>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#D5E2DC] bg-[#FAFDFB] px-4 py-3 pr-12 text-sm text-[#173B3A] placeholder-[#9AA8A4] outline-none transition focus:border-[#24645D] focus:bg-white focus:ring-2 focus:ring-[#24645D]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-xs text-[#71817D] hover:text-[#173B3A]"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#24645D] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b4d47] hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In →</span>
                )}
              </button>
            </form>

            {/* Switch to Signup */}
            <div className="mt-6 border-t border-[#E4EBE7] pt-5 text-center">
              <p className="text-xs text-[#71817D]">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-[#24645D] hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Friendly Tip Box */}
          <div className="mt-4 rounded-2xl border border-[#E4EBE7] bg-[#FAFDFB] p-4 text-center text-xs text-[#71817D]">
            <span>🌱 </span>
            <span className="font-semibold text-[#173B3A]">New to NetLearn?</span> It only takes 30 seconds to sign up and start your first lesson!
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
