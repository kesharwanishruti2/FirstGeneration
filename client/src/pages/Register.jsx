import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg("Please fill in both name and email.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.post("http://localhost:3000/api/users", {
        name: name.trim(),
        email: email.trim()
      });

      console.log(response.data);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      // If user hasn't done assessment yet, guide them to assessment
      const currentLevel = response.data.user?.assessment?.level;
      if (!currentLevel || currentLevel === "Not assessed") {
        navigate("/assessment");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message ||
        "Could not connect to server. Check if backend is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9F6] text-[#173B3A]">
      {/* Top bar */}
      <header className="border-b border-[#E4EBE7] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-semibold text-[#24645D] hover:underline"
          >
            <span>←</span> Back to Home
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCEFE8] text-base">
              🌐
            </div>
            <span className="font-bold">
              Net<span className="text-[#E67E52]">Learn</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main registration card */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#E4EBE7] bg-white p-8 shadow-xl shadow-emerald-950/5">
          
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCEFE8] text-2xl">
              🌱
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#173B3A]">
              Let's Get Started
            </h1>
            <p className="mt-1.5 text-xs text-[#71817D]">
              Enter your details to track your learning journey and save your progress.
            </p>
          </div>

          {errorMsg && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B3A]">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-[#D5E2DC] bg-[#FAFDFB] px-4 py-3 text-sm text-[#173B3A] placeholder-[#9AA8A4] outline-none transition focus:border-[#24645D] focus:bg-white focus:ring-2 focus:ring-[#24645D]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B3A]">
                Your Email
              </label>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-[#D5E2DC] bg-[#FAFDFB] px-4 py-3 text-sm text-[#173B3A] placeholder-[#9AA8A4] outline-none transition focus:border-[#24645D] focus:bg-white focus:ring-2 focus:ring-[#24645D]/15"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#24645D] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b4d47] hover:shadow disabled:opacity-50"
            >
              {loading ? "Setting up..." : "Start Learning →"}
            </button>
          </form>

          <div className="mt-6 border-t border-[#E4EBE7] pt-4 text-center">
            <p className="text-[11px] text-[#81908C]">
              No password needed. Simple, free, and beginner friendly.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Register;
