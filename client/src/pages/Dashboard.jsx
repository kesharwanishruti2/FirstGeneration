import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { lessonsData } from "../data/lessonsData";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

  // Fetch freshest user data from MongoDB
  useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:3000/api/users/${user._id}`)
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        })
        .catch((err) => {
          console.warn("Could not fetch user update from backend:", err.message);
        });
    }
  }, [user?._id]);

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
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#173B3A]">
      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 hidden h-screen w-60 border-r border-[#E4EBE7] bg-white px-5 py-7 md:block">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2 px-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCEFE8] text-lg">
            🌐
          </div>
          <h1 className="text-lg font-bold">
            Net<span className="text-[#E67E52]">Learn</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-10 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex w-full items-center gap-3 rounded-xl bg-[#E4F3EC] px-4 py-3 text-sm font-semibold text-[#1E615A]"
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            onClick={() => {
              document.getElementById("lessons-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#64716F] transition hover:bg-[#F4F7F5]"
          >
            <span>▣</span>
            Lessons
          </button>

          <button
            onClick={() => navigate(`/quiz/${activeQuizId}`)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#64716F] transition hover:bg-[#F4F7F5]"
          >
            <span>✓</span>
            Quizzes
          </button>

          <button
            onClick={() => navigate("/assessment")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#64716F] transition hover:bg-[#F4F7F5]"
          >
            <span>📊</span>
            Assessment
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 transition hover:bg-red-50"
          >
            <span>🚪</span>
            Log Out
          </button>
        </nav>

        {/* Bottom encouragement message */}
        <div className="absolute bottom-7 left-5 right-5 rounded-2xl bg-[#F1F7F1] p-4">
          <div className="text-xl">🌱</div>
          <p className="mt-2 text-xs font-semibold text-[#315B4F]">
            You're doing great!
          </p>
          <p className="mt-1 text-[11px] leading-4 text-[#71817D]">
            {lessonsCompleted === totalLessons
              ? "Course completed! You mastered all lessons."
              : `Completed ${lessonsCompleted} of ${totalLessons} lessons. Keep it up!`}
          </p>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="md:ml-60">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-[#E4EBE7] bg-white px-6 py-5 md:px-10">
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCEFE8] text-base">
              🌐
            </div>
            <h1 className="font-bold">
              Net<span className="text-[#E67E52]">Learn</span>
            </h1>
          </div>

          <div className="hidden md:block">
            <p className="text-sm text-[#81908C]">
              Your personalized learning journey
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#243B53] text-xs font-bold text-white shadow-xs">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <span className="hidden text-xs font-semibold text-[#173B3A] sm:inline">
              {user?.name || "Learner"}
            </span>
          </div>
        </header>

        {/* Content Body */}
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
          {/* ================= WELCOME ================= */}
          <section>
            <p className="text-sm text-[#71817D]">
              Here's your learning journey. Keep going!
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              Welcome, {user?.name || "Learner"} 👋
            </h2>
          </section>

          {/* ================= STATS SECTION ================= */}
          <section className="mt-7 grid gap-4 md:grid-cols-2">
            {/* Level + Progress Card */}
            <div className="rounded-2xl border border-[#E4EBE7] bg-white p-5 shadow-xs">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-[#81908C]">Your Level</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xl">🌱</span>
                    <p className="font-bold text-[#173B3A]">
                      {assessmentLevel}
                    </p>
                  </div>
                  {!isAssessed && (
                    <button
                      onClick={() => navigate("/assessment")}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#24645D] hover:underline"
                    >
                      Take Assessment →
                    </button>
                  )}
                  {isAssessed && assessmentScore !== undefined && (
                    <p className="mt-1 text-[11px] text-[#81908C]">
                      Score: {assessmentScore} / 5
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#81908C]">Progress</p>
                    <p className="text-sm font-bold text-[#173B3A]">
                      {progress}%
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E7ECE9]">
                    <div
                      className="h-2 rounded-full bg-[#24645D] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons Completed Card */}
            <div className="rounded-2xl border border-[#E4EBE7] bg-white p-5 shadow-xs">
              <p className="text-xs text-[#81908C]">Lessons Completed</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2EA] text-lg">
                  📖
                </div>
                <div>
                  <p className="font-bold text-[#173B3A]">
                    {lessonsCompleted} / {totalLessons}
                  </p>
                  <p className="text-xs text-[#81908C]">
                    {lessonsCompleted === totalLessons
                      ? "All modules finished! 🎉"
                      : "Keep learning!"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Assessment Prompt Banner (if not assessed yet) */}
          {!isAssessed && (
            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#DCEFE8] bg-[#E4F3EC]/70 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-bold text-[#173B3A]">
                  🎯 You haven't taken the initial assessment yet!
                </p>
                <p className="mt-0.5 text-xs text-[#557069]">
                  Take a quick 5-question quiz to check your current skill level and personalize your journey.
                </p>
              </div>
              <button
                onClick={() => navigate("/assessment")}
                className="shrink-0 rounded-xl bg-[#24645D] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b4d47]"
              >
                Start Assessment Now
              </button>
            </div>
          )}

          {/* ================= LEARNING MODULES ================= */}
          <section id="lessons-section" className="mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#173B3A]">
                  Continue Learning
                </h3>
                <p className="mt-1 text-sm text-[#81908C]">
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
                      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-[#E4EBE7] bg-white p-4 shadow-xs transition duration-150 hover:-translate-y-0.5 hover:border-[#24645D] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#24645D]/20"
                    >
                      {/* Number Badge */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition group-hover:scale-105 ${
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
                          <h4 className="font-semibold text-[#173B3A] transition group-hover:text-[#24645D]">
                            {lesson.title}
                          </h4>
                          {isCurrent && (
                            <span className="rounded-full bg-[#E4F3EC] px-2 py-0.5 text-[10px] font-bold text-[#1E615A]">
                              Up Next
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-[#81908C]">
                          {lesson.description}
                        </p>
                      </div>

                      {/* Action Indicator */}
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <span className="rounded-full bg-[#E4F4E9] px-3 py-1 text-xs font-semibold text-[#28745F]">
                            ✓ Completed
                          </span>
                        )}

                        {isCurrent && (
                          <span className="rounded-xl bg-[#175B56] px-4 py-2 text-xs font-semibold text-white shadow-xs transition group-hover:bg-[#124A46]">
                            Start Lesson →
                          </span>
                        )}

                        {!isCompleted && !isCurrent && (
                          <span className="rounded-xl border border-[#D5E2DC] bg-[#FAFDFB] px-3 py-1.5 text-xs font-medium text-[#71817D] transition group-hover:border-[#24645D] group-hover:text-[#24645D]">
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