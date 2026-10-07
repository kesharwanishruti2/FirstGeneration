import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    } catch {
      setUser(null);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
  };

  const modules = [
    {
      number: "01",
      icon: "🌐",
      title: "What is the Internet?",
      desc: "Understand what the global web is and how devices connect together seamlessly.",
      badge: "Lesson 1"
    },
    {
      number: "02",
      icon: "🧭",
      title: "Web Browsers",
      desc: "Discover how Google Chrome, Edge, and other browsers help you visit websites.",
      badge: "Lesson 2"
    },
    {
      number: "03",
      icon: "🔍",
      title: "Search Engines",
      desc: "Master search tricks to quickly find accurate answers, recipes, and news.",
      badge: "Lesson 3"
    },
    {
      number: "04",
      icon: "🛡️",
      title: "Online Safety",
      desc: "Keep your personal information safe, spot scams, and create bulletproof passwords.",
      badge: "Lesson 4"
    }
  ];

  const features = [
    {
      icon: "🌱",
      title: "Zero Jargon",
      description: "Everything explained in everyday language. No confusing tech terminology."
    },
    {
      icon: "🎯",
      title: "Step-by-Step",
      description: "Bite-sized modules designed to be finished in just 3 to 5 minutes each."
    },
    {
      icon: "✨",
      title: "Interactive Quizzes",
      description: "Reinforce what you learn with fun, friendly questions at the end of each topic."
    },
    {
      icon: "🏆",
      title: "Track Confidence",
      description: "Watch your personal progress bar fill up as you master each internet skill."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#173B3A]">
      {/* ================= NAVIGATION ================= */}
      <header className="sticky top-0 z-50 border-b border-[#E4EBE7] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCEFE8] text-xl shadow-xs">
              🌐
            </div>
            <span className="text-xl font-bold tracking-tight">
              Net<span className="text-[#E67E52]">Learn</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user && user._id ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-2xl border border-[#DCEFE8] bg-white px-3.5 py-1.5 shadow-xs transition hover:border-[#24645D]/40 hover:bg-[#FAFDFB] focus:outline-none focus:ring-2 focus:ring-[#24645D]/15"
                  aria-expanded={menuOpen}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#24645D] text-xs font-bold text-white shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-[#173B3A] leading-tight">
                      {user.name || "Learner"}
                    </p>
                    <p className="text-[10px] text-[#71817D]">
                      {user.assessment?.level && user.assessment.level !== "Not assessed"
                        ? user.assessment.level
                        : "Learner"}
                    </p>
                  </div>
                  <svg
                    className={`h-4 w-4 text-[#71817D] transition-transform duration-200 ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Card */}
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-[#E4EBE7] bg-white p-2 shadow-2xl shadow-emerald-950/10 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Header */}
                    <div className="px-3 py-2.5 border-b border-[#F0F4F2]">
                      <p className="text-xs font-bold text-[#173B3A] truncate">
                        {user.name || "Learner"}
                      </p>
                      {user.email && (
                        <p className="text-[11px] text-[#71817D] truncate mt-0.5">
                          {user.email}
                        </p>
                      )}
                      <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#E4F3EC] px-2 py-0.5 text-[10px] font-semibold text-[#1E615A]">
                        <span>🌱</span>
                        <span>{user.assessment?.level || "Learner"}</span>
                      </div>
                    </div>

                    {/* Sign Out Only */}
                    <div className="pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <span className="text-sm">🚪</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl border border-[#DCEFE8] bg-white px-4 py-2 text-sm font-semibold text-[#1E615A] transition hover:bg-[#F0F8F5]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="rounded-xl bg-[#24645D] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b4d47] hover:shadow"
                >
                  Start Learning
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            
            {/* Left Column: Heading & CTA */}
            <div className="text-center lg:col-span-7 lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DCEFE8] bg-[#E4F3EC] px-4 py-1.5 text-xs font-semibold text-[#1E615A]">
                <span>🌱</span>
                <span>Internet Basics for Everyone</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Learn the internet from the{" "}
                <span className="text-[#24645D]">very beginning</span>.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#667572] sm:text-lg lg:mx-0">
                One simple step at a time. Clear explanations, friendly visuals, and bite-sized quizzes designed to help you feel confident navigating the digital world.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3.5 sm:flex-row lg:justify-start">
                {user && user._id ? (
                  <>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full rounded-xl bg-[#24645D] px-7 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[#1b4d47] hover:shadow-lg sm:w-auto"
                    >
                      Go to Dashboard →
                    </button>
                    <button
                      onClick={() => navigate("/lesson/1")}
                      className="w-full rounded-xl border border-[#D5E2DC] bg-white px-6 py-3.5 text-base font-semibold text-[#173B3A] transition hover:bg-[#F2F6F4] sm:w-auto"
                    >
                      Continue Lessons
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full rounded-xl bg-[#24645D] px-7 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[#1b4d47] hover:shadow-lg sm:w-auto"
                    >
                      Start Learning Free →
                    </button>
                    <button
                      onClick={() => navigate("/assessment")}
                      className="w-full rounded-xl border border-[#D5E2DC] bg-white px-6 py-3.5 text-base font-semibold text-[#173B3A] transition hover:bg-[#F2F6F4] sm:w-auto"
                    >
                      Quick Assessment
                    </button>
                  </>
                )}
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#71817D] lg:justify-start">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#24645D]">✓</span> 100% Free
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#24645D]">✓</span> Beginner friendly
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#24645D]">✓</span> Self-paced
                </span>
              </div>
            </div>

            {/* Right Column: Visual Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-3xl border border-[#E4EBE7] bg-white p-6 shadow-xl shadow-emerald-950/5">
                <div className="flex items-center justify-between border-b border-[#E4EBE7] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-[#E67E52]" />
                    <span className="flex h-3 w-3 rounded-full bg-[#E5B558]" />
                    <span className="flex h-3 w-3 rounded-full bg-[#3FB88B]" />
                  </div>
                  <span className="rounded-full bg-[#E4F3EC] px-3 py-0.5 text-xs font-semibold text-[#1E615A]">
                    Interactive Lesson
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-[#F7F9F6] p-4">
                    <div className="text-2xl">🌐</div>
                    <h3 className="mt-2 text-sm font-bold text-[#173B3A]">
                      Lesson 1: What is the Internet?
                    </h3>
                    <p className="mt-1 text-xs text-[#71817D]">
                      Think of the internet like an invisible road connecting millions of computers worldwide.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-[#81908C]">
                      <span>Course Completion</span>
                      <span className="font-semibold text-[#24645D]">4 Lessons</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#E5EBE8]">
                      <div className="h-full w-2/5 rounded-full bg-[#24645D]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <div className="rounded-xl border border-[#E4EBE7] bg-white p-3 text-center">
                      <p className="text-xs text-[#81908C]">Level</p>
                      <p className="mt-0.5 text-sm font-bold text-[#173B3A]">Beginner</p>
                    </div>
                    <div className="rounded-xl border border-[#E4EBE7] bg-white p-3 text-center">
                      <p className="text-xs text-[#81908C]">Quizzes</p>
                      <p className="mt-0.5 text-sm font-bold text-[#E67E52]">Included 🎯</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS / FEATURES ================= */}
      <section className="border-t border-[#E4EBE7] bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="rounded-full bg-[#E4F3EC] px-4 py-1 text-xs font-bold text-[#1E615A]">
              WHY NETLEARN
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              Made specifically for first-time learners
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm text-[#667572] md:text-base">
              Learning technology doesn't have to be overwhelming. We break every concept down into bite-sized, everyday understanding.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[#E4EBE7] bg-[#F7F9F6] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#24645D]/30 hover:bg-white hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-xs">
                  {feature.icon}
                </div>
                <h3 className="mt-4 font-bold text-[#173B3A]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#71817D]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CURRICULUM PREVIEW ================= */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="rounded-full bg-[#E4F3EC] px-4 py-1 text-xs font-bold text-[#1E615A]">
              CURRICULUM
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              What you will learn
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm text-[#667572] md:text-base">
              Four fundamental lessons that take you from beginner to confident web explorer.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {modules.map((mod) => (
              <div
                key={mod.number}
                className="flex items-start gap-4 rounded-2xl border border-[#E4EBE7] bg-white p-6 shadow-xs transition hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DCEFE8] text-2xl">
                  {mod.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#81908C]">
                      Module {mod.number}
                    </span>
                    <span className="rounded-full bg-[#F1F7F1] px-2.5 py-0.5 text-[11px] font-semibold text-[#315B4F]">
                      {mod.badge}
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-[#173B3A]">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#71817D]">
                    {mod.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="border-t border-[#E4EBE7] bg-[#173B3A] text-white py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">
            🌱
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl text-white">
            Ready to take your first step online?
          </h2>
          <p className="mt-3 text-sm text-emerald-100/80 md:text-base">
            Start learning today with NetLearn. No credit card or previous experience required.
          </p>
          <div className="mt-8 flex justify-center">
            {user && user._id ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-xl bg-[#E67E52] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#d66e43] hover:shadow-xl"
              >
                Go to Your Dashboard →
              </button>
            ) : (
              <button
                onClick={() => navigate("/signup")}
                className="rounded-xl bg-[#E67E52] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#d66e43] hover:shadow-xl"
              >
                Get Started Now — It's Free
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#E4EBE7] bg-white py-8 text-center text-xs text-[#81908C]">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🌐</span>
            <span className="font-bold text-[#173B3A]">Net<span className="text-[#E67E52]">Learn</span></span>
            <span>— Empowering every learner.</span>
          </div>
          <div>
            © {new Date().getFullYear()} NetLearn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
