import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import api from "../services/api";

const Register = () => {
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg("Please fill in your name and email.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("Please choose a password with at least 6 characters.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/users/signup", {
        name: name.trim(),
        email: email.trim(),
        password: password
      });

      const user = response.data.user;

      // If user took the assessment prior to registering, save it now
      const pendingAssessmentRaw = localStorage.getItem("pendingAssessment");
      if (pendingAssessmentRaw) {
        try {
          const pendingAssessment = JSON.parse(pendingAssessmentRaw);
          await api.patch(
            `/users/${user._id}/assessment`,
            pendingAssessment
          );
          localStorage.removeItem("pendingAssessment");
        } catch (e) {
          console.warn("Could not attach pending assessment:", e);
        }
      }

      // Do NOT auto-login. Redirect user to Login page so they must log in explicitly!
      navigate("/login", {
        state: {
          successMsg: "Registration successful! Please log in with your email and password.",
          registeredEmail: email.trim()
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 409) {
        setErrorMsg("An account with this email already exists. Please sign in instead.");
      } else {
        setErrorMsg(
          error.response?.data?.message ||
          "Could not connect to server. Check if the backend is running on port 3000."
        );
      }
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

      {/* Main Registration Card */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="rounded-3xl border border-[#E4EBE7] bg-white p-8 shadow-xl shadow-emerald-950/5">
            
            {/* Header Badge & Title */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCEFE8] text-2xl shadow-inner">
                🌱
              </div>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#173B3A]">
                Create Your Account
              </h1>
              <p className="mt-1.5 text-xs text-[#71817D]">
                Join NetLearn for free and start mastering the digital world today.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 animate-in fade-in duration-200">
                <span className="shrink-0 text-sm">⚠️</span>
                <span className="leading-relaxed font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173B3A]">
                  Full Name
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    placeholder="e.g. Shruti Kesharwani"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#D5E2DC] bg-[#FAFDFB] px-4 py-3 text-sm text-[#173B3A] placeholder-[#9AA8A4] outline-none transition focus:border-[#24645D] focus:bg-white focus:ring-2 focus:ring-[#24645D]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173B3A]">
                  Email Address
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#D5E2DC] bg-[#FAFDFB] px-4 py-3 text-sm text-[#173B3A] placeholder-[#9AA8A4] outline-none transition focus:border-[#24645D] focus:bg-white focus:ring-2 focus:ring-[#24645D]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173B3A]">
                  Create Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account →</span>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-6 border-t border-[#E4EBE7] pt-5 text-center">
              <p className="text-xs text-[#71817D]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#24645D] hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits Info Card */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#81908C]">
            <span className="flex items-center gap-1">
              <span className="text-[#24645D]">✓</span> 100% Free
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="text-[#24645D]">✓</span> Save Your Progress
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="text-[#24645D]">✓</span> Earn Badges
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
