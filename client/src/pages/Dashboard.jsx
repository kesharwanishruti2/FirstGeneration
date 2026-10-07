import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";
import { lessonsData } from "../data/lessonsData";

function Dashboard() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

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

  // Redirect if not logged in & fetch freshest user data from MongoDB
  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
      return;
    }

    api
      .get(`/users/${user._id}`)
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch user update from backend:", err.message);
      });
  }, [user?._id, navigate]);

  const totalLessons = lessonsData.length;
  const lessonsCompleted = user?.lessonsCompleted || 0;
  const calculatedProgress = Math.min(100, Math.round((lessonsCompleted / totalLessons) * 100));
  const progress = user?.progress !== undefined && user?.progress !== null ? user.progress : calculatedProgress;

  const assessmentLevel = user?.assessment?.level || "Not assessed";
  const assessmentScore = user?.assessment?.score;
  const isAssessed = assessmentLevel !== "Not assessed" && assessmentLevel !== "";

  // Compute lesson status dynamically
  const lessonsWithStatus = lessonsData.map((lesson, index) => {
    let status = "Locked";
    if (index < lessonsCompleted) {
      status = "Completed";
    } else if (index === lessonsCompleted) {
      status = "Start";
    }
    return { ...lesson, status };
  });

  // Determine current active quiz
  const currentLessonIndex = Math.min(lessonsCompleted, totalLessons - 1);
  const activeQuizId = lessonsData[currentLessonIndex]?.quizId || "internet-basics";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

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
            className="flex w-full items-center gap-3 rounded-xl bg-[#E4F3EC] px-4 py-3 text-sm font-semibold text-[#1E615A]"
          >
            <span className="text-base">⌂</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => navigate(`/quiz/${activeQuizId}`)}
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
          <div className="text-xl">🌱</div>
          <p className="mt-2 text-xs font-semibold text-[#315B4F]">
            You're doing great!
          </p>
          <p className="mt-1 text-[11px] leading-4 text-[#71817D]">
            {lessonsCompleted === totalLessons
              ? "Course completed! You mastered all lessons."
              : `Completed ${lessonsCompleted} of ${totalLessons} lessons.`}
          </p>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#E4EBE7] bg-white/95 backdrop-blur-md px-3 py-2 shadow-lg md:hidden">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center gap-0.5 py-1 text-xs font-bold text-[#1E615A]"
        >
          <span className="text-base">⌂</span>
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => navigate(`/quiz/${activeQuizId}`)}
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
        {/* Top bar */}
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

            <div className="hidden md:block">
              <p className="text-sm text-[#81908C]">
                Your personalized learning journey
              </p>
            </div>
          </div>

          {/* Profile Dropdown (Only Logout as requested) */}
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

            {/* Dropdown Card - Only User Summary & Logout */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-[#E4EBE7] bg-white p-2 shadow-2xl shadow-emerald-950/10 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User Header */}
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

        {/* Content Body */}
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-10 md:py-8 pb-24 md:pb-10">
          {/* ================= WELCOME ================= */}
          <section>
            <p className="text-xs sm:text-sm text-[#71817D]">
              Here's your learning journey. Keep going!
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Welcome, {user?.name || "Learner"} 👋
            </h2>
          </section>

          {/* ================= STATS SECTION ================= */}
          <section className="mt-6 sm:mt-7 grid gap-4 grid-cols-1 sm:grid-cols-2">
            {/* Level + Progress Card */}
            <div className="rounded-2xl border border-[#E4EBE7] bg-white p-4 sm:p-5 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <p className="text-xs font-semibold text-[#81908C]">Your Level</p>
                  <div className="mt-1.5 sm:mt-2 flex items-center gap-2">
                    <span className="text-xl">
                      {assessmentLevel === "Confident Beginner"
                        ? "🌟"
                        : assessmentLevel === "Beginner"
                        ? "🌿"
                        : "🌱"}
                    </span>
                    <p className="font-bold text-[#173B3A]">
                      {assessmentLevel}
                    </p>
                  </div>
                  {!isAssessed ? (
                    <button
                      onClick={() => navigate("/assessment")}
                      className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-[#E4F3EC] px-3 py-1 text-xs font-bold text-[#1E615A] transition hover:bg-[#D3EDE0]"
                    >
                      Take Assessment →
                    </button>
                  ) : (
                    <div className="mt-2 flex flex-col gap-1">
                      {assessmentScore !== undefined && (
                        <span className="text-[11px] font-medium text-[#71817D]">
                          Score: {assessmentScore} / 5
                        </span>
                      )}
                      <button
                        onClick={() => navigate("/assessment")}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#24645D] hover:underline"
                      >
                        Retake Assessment ↻
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#81908C]">Progress</p>
                    <p className="text-sm font-bold text-[#173B3A]">
                      {progress}%
                    </p>
                  </div>
                  <div className="mt-2.5 sm:mt-3 h-2.5 overflow-hidden rounded-full bg-[#E7ECE9]">
                    <div
                      className="h-2.5 rounded-full bg-[#24645D] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-[#81908C]">
                    {lessonsCompleted} of {totalLessons} completed
                  </p>
                </div>
              </div>
            </div>

            {/* Lessons Completed Card */}
            <div
              onClick={() => navigate(`/lesson/${Math.min(lessonsCompleted + 1, totalLessons)}`)}
              className="group cursor-pointer rounded-2xl border border-[#E4EBE7] bg-white p-4 sm:p-5 shadow-xs transition hover:border-[#24645D]/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#81908C]">Lessons Completed</p>
                <span className="text-xs font-semibold text-[#24645D] group-hover:underline">
                  {lessonsCompleted === totalLessons ? "Review Lessons →" : `Start Lesson ${Math.min(lessonsCompleted + 1, totalLessons)} →`}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2EA] text-lg transition group-hover:scale-105">
                  📖
                </div>
                <div>
                  <p className="font-bold text-[#173B3A]">
                    {lessonsCompleted} / {totalLessons}
                  </p>
                  <p className="text-xs text-[#81908C]">
                    {lessonsCompleted === totalLessons
                      ? "All modules finished! 🎉"
                      : `Keep learning! (${lessonsCompleted}/${totalLessons})`}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Assessment Prompt Banner (if not assessed yet) */}
          {!isAssessed && (
            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#DCEFE8] bg-[#E4F3EC]/70 p-4 sm:p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-bold text-sm sm:text-base text-[#173B3A]">
                  🎯 You haven't taken the initial assessment yet!
                </p>
                <p className="mt-0.5 text-xs text-[#557069]">
                  Take a quick 5-question quiz to check your current skill level and personalize your journey.
                </p>
              </div>
              <button
                onClick={() => navigate("/assessment")}
                className="w-full sm:w-auto shrink-0 rounded-xl bg-[#24645D] px-5 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b4d47]"
              >
                Start Assessment Now
              </button>
            </div>
          )}

          {/* ================= LEARNING MODULES ================= */}
          <section id="lessons-section" className="mt-8 sm:mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#173B3A]">
                  Continue Learning
                </h3>
                <p className="mt-0.5 text-xs sm:text-sm text-[#81908C]">
                  Learn one simple step at a time.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_280px]">
              {/* Lessons List */}
              <div className="space-y-3">
                {lessonsWithStatus.map((lesson) => {
                  const isCompleted = lesson.status === "Completed";
                  const isCurrent = lesson.status === "Start";

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigate(`/lesson/${lesson.id}`);
                        }
                      }}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer rounded-2xl border border-[#E4EBE7] bg-white p-4 shadow-xs transition duration-150 hover:-translate-y-0.5 hover:border-[#24645D] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#24645D]/20"
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Number Badge */}
                        <div
                          className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition group-hover:scale-105 ${
                            isCompleted
                              ? "bg-[#E3F2E8] text-[#27705F]"
                              : isCurrent
                              ? "bg-[#F8EBD8] text-[#B36B31]"
                              : "bg-[#F1F2F1] text-[#8A9491]"
                          }`}
                        >
                          {lesson.number}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm sm:text-base text-[#173B3A] transition group-hover:text-[#24645D]">
                              {lesson.title}
                            </h4>
                            {isCurrent && (
                              <span className="rounded-full bg-[#E4F3EC] px-2 py-0.5 text-[10px] font-bold text-[#1E615A]">
                                Up Next
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-[#81908C] line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Indicator */}
                      <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0F4F2]">
                        {isCompleted && (
                          <span className="rounded-full bg-[#E4F4E9] px-3 py-1 text-xs font-semibold text-[#28745F]">
                            ✓ Completed
                          </span>
                        )}

                        {isCurrent && (
                          <span className="w-full sm:w-auto text-center rounded-xl bg-[#175B56] px-4 py-2 text-xs font-semibold text-white shadow-xs transition group-hover:bg-[#124A46]">
                            Start Lesson →
                          </span>
                        )}

                        {!isCompleted && !isCurrent && (
                          <span className="w-full sm:w-auto text-center rounded-xl border border-[#D5E2DC] bg-[#FAFDFB] px-3 py-1.5 text-xs font-medium text-[#71817D] transition group-hover:border-[#24645D] group-hover:text-[#24645D]">
                            Open Lesson →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= PRACTICE QUIZ CARD ================= */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#E4EBE7] bg-white p-6 shadow-xs">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0D8] text-xl">
                    📝
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#173B3A]">
                    Practice Quiz
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#81908C]">
                    Test what you've learned from Lesson {currentLessonIndex + 1}:
                    <br />
                    <strong className="text-[#173B3A]">
                      {lessonsData[currentLessonIndex]?.title}
                    </strong>
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => navigate(`/quiz/${activeQuizId}`)}
                    className="mt-6 w-full rounded-xl bg-[#175B56] px-4 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#124A46]"
                  >
                    Take Quiz
                  </button>

                  <div className="mt-5 border-t border-[#EDF0EE] pt-4 text-center">
                    <p className="text-xs text-[#81908C]">
                      Learning is a journey,
                      <br />
                      not a race. 🌱
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;