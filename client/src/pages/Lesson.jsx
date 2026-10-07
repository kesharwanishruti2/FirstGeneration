import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { lessonsData } from "../data/lessonsData";

function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dropdownRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Close dropdown on outside click
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
    navigate("/login");
  };

  // Find corresponding lesson or fallback to first
  const lesson =
    lessonsData.find((l) => l.id === id || l.number === id) || lessonsData[0];

  const lessonIndex = lessonsData.findIndex((l) => l.id === lesson.id);
  const totalLessons = lessonsData.length;
  const progressPercent = Math.round(((lessonIndex + 1) / totalLessons) * 100);

  const currentLessonNum = parseInt(lesson.number || lesson.id, 10) || (lessonIndex + 1);
  const isCompleted = (user?.lessonsCompleted || 0) >= currentLessonNum;

  const handleMarkCompleted = async () => {
    if (!user || !user._id) return;
    setSaving(true);
    const updatedCompleted = Math.max(user.lessonsCompleted || 0, currentLessonNum);
    const updatedProgress = Math.min(100, Math.round((updatedCompleted / totalLessons) * 100));

    try {
      const res = await axios.patch(`http://localhost:3000/api/users/${user._id}/progress`, {
        lessonsCompleted: updatedCompleted,
        progress: updatedProgress
      });
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
    } finally {
      setSaving(false);
    }
  };
  const assessmentLevel = user?.assessment?.level || "Learner";

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#173B3A]">
      {/* ================= SIDEBAR (Desktop) ================= */}
      <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#E4EBE7] bg-white px-5 py-6 shadow-xs">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2.5 px-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCEFE8] text-lg shadow-xs">
            🌐
          </div>
          <h1 className="text-lg font-bold text-[#173B3A]">
            Net<span className="text-[#E67E52]">Learn</span>
          </h1>
        </div>

        {/* Navigation - Lessons removed */}
        <nav className="mt-8 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#64716F] transition hover:bg-[#F4F7F5] hover:text-[#173B3A]"
          >
            <span className="text-base">⌂</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => navigate(`/quiz/${lesson.quizId}`)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#64716F] transition hover:bg-[#F4F7F5] hover:text-[#173B3A]"
          >
            <span className="text-base">✓</span>
            <span>Quizzes</span>
          </button>

          <button
            onClick={() => navigate("/assessment")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#64716F] transition hover:bg-[#F4F7F5] hover:text-[#173B3A]"
          >
            <span className="text-base">📊</span>
            <span>Assessment</span>
          </button>
        </nav>

        {/* Bottom encouragement message */}
        <div className="absolute bottom-6 left-5 right-5 rounded-2xl bg-[#F1F7F1] p-4">
          <div className="text-xl">📖</div>
          <p className="mt-2 text-xs font-semibold text-[#315B4F]">
            Interactive Lesson
          </p>
          <p className="mt-1 text-[11px] leading-4 text-[#71817D]">
            Lesson {lessonIndex + 1} of {totalLessons}. Read key takeaways before taking the quiz!
          </p>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#E4EBE7] bg-white/95 backdrop-blur-md px-3 py-2 shadow-lg md:hidden">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center gap-0.5 py-1 text-xs font-medium text-[#64716F] transition hover:text-[#173B3A]"
        >
          <span className="text-base">⌂</span>
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => navigate(`/quiz/${lesson.quizId}`)}
          className="flex flex-col items-center gap-0.5 py-1 text-xs font-medium text-[#64716F] transition hover:text-[#173B3A]"
        >
          <span className="text-base">✓</span>
          <span>Quizzes</span>
        </button>
        <button
          onClick={() => navigate("/assessment")}
          className="flex flex-col items-center gap-0.5 py-1 text-xs font-medium text-[#64716F] transition hover:text-[#173B3A]"
        >
          <span className="text-base">📊</span>
          <span>Assessment</span>
        </button>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="md:ml-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E4EBE7] bg-white/90 backdrop-blur-md px-4 py-3 sm:px-6 md:px-10">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate("/")}
              className="flex cursor-pointer items-center gap-2 md:hidden"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCEFE8] text-base">
                🌐
              </div>
              <h1 className="font-bold text-[#173B3A]">
                Net<span className="text-[#E67E52]">Learn</span>
              </h1>
            </div>

            {/* Lesson Progress Bar */}
            <div className="hidden sm:block w-60">
              <div className="flex justify-between text-xs text-[#81908C]">
                <span>
                  {lessonIndex + 1} of {totalLessons} lessons
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#E5EBE8]">
                <div
                  className="h-2 rounded-full bg-[#24645D] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Profile Dropdown (Only Logout) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-2xl border border-[#DCEFE8] bg-white px-3 py-1.5 shadow-xs transition hover:border-[#24645D]/40 hover:bg-[#FAFDFB] focus:outline-none focus:ring-2 focus:ring-[#24645D]/15"
              aria-expanded={menuOpen}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#24645D] text-xs font-bold text-white shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#173B3A] leading-tight">
                  {user?.name || "Learner"}
                </p>
                <p className="text-[10px] text-[#71817D]">
                  {assessmentLevel}
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
                <div className="px-3 py-2.5 border-b border-[#F0F4F2]">
                  <p className="text-xs font-bold text-[#173B3A] truncate">
                    {user?.name || "Learner"}
                  </p>
                  {user?.email && (
                    <p className="text-[11px] text-[#71817D] truncate mt-0.5">
                      {user.email}
                    </p>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#E4F3EC] px-2 py-0.5 text-[10px] font-semibold text-[#1E615A]">
                    <span>🌱</span>
                    <span>{assessmentLevel}</span>
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
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 md:px-10 md:py-8 pb-24 md:pb-10">
          {/* Lesson Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E4F3EC] px-3.5 py-1 text-xs font-semibold text-[#24645D]">
            <span>●</span>
            Module {lesson.number}: {lesson.title}
          </div>

          {/* Lesson Heading Section */}
          <section className="mt-4 sm:mt-5 grid items-center gap-6 sm:gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-[#173B3A]">
                {lesson.title}
              </h2>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-[#667572] md:text-base">
                {lesson.subtitle}
              </p>
            </div>

            {/* Visual Illustration Badge */}
            <div className="flex h-44 sm:h-52 items-center justify-center rounded-3xl border border-[#DCEFE8] bg-[#EAF4EE]">
              <div className="relative flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center rounded-full bg-[#BBDDD0] text-6xl sm:text-7xl shadow-xs">
                {lesson.id === "1" ? "🌍" : lesson.id === "2" ? "🧭" : lesson.id === "3" ? "🔍" : "🛡️"}
                <span className="absolute -right-4 top-2 text-2xl sm:text-3xl">💻</span>
                <span className="absolute -left-4 bottom-2 text-2xl sm:text-3xl">📱</span>
              </div>
            </div>
          </section>

          {/* Friendly Analogy / Intuition Card */}
          <section className="mt-6 sm:mt-8 rounded-2xl border border-[#DCEFE8] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-lg sm:text-xl">💡</span>
              <h3 className="text-sm sm:text-base font-bold text-[#173B3A]">
                Think of it this way
              </h3>
            </div>
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-[#556965]">
              {lesson.analogy}
            </p>
          </section>

          {/* Key Takeaways */}
          <section className="mt-5 sm:mt-6 rounded-2xl bg-[#EAF5EF] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#D2EBDD] text-xs sm:text-sm font-bold text-[#27705F]">
                ✓
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#173B3A]">
                Key Points to Remember
              </h3>
            </div>

            <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm leading-relaxed text-[#35534B]">
              {lesson.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#24645D] font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* In-depth Breakdowns */}
          {lesson.details && lesson.details.length > 0 && (
            <div className="mt-5 sm:mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
              {lesson.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E4EBE7] bg-white p-4 sm:p-5 shadow-xs"
                >
                  <h4 className="font-bold text-xs sm:text-sm text-[#173B3A]">
                    {detail.heading}
                  </h4>
                  <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-[#71817D]">
                    {detail.body}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#E4EBE7] pt-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto rounded-xl border border-[#DDE6E1] bg-white px-5 py-3 text-center text-xs sm:text-sm font-semibold text-[#48645D] transition hover:bg-[#F4F7F5]"
            >
              ← Back to Dashboard
            </button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={handleMarkCompleted}
                disabled={saving}
                className={`w-full sm:w-auto rounded-xl px-5 py-3 text-center text-xs sm:text-sm font-semibold transition ${
                  isCompleted
                    ? "border border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border border-[#24645D] bg-white text-[#24645D] hover:bg-[#F0F8F5]"
                }`}
              >
                {saving
                  ? "Saving..."
                  : isCompleted
                  ? "✓ Completed"
                  : "✓ Mark as Completed"}
              </button>

              <button
                onClick={() => navigate(`/quiz/${lesson.quizId}`)}
                className="w-full sm:w-auto rounded-xl bg-[#24645D] px-6 sm:px-7 py-3 text-center text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b4d47]"
              >
                Take Lesson Quiz →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Lesson;