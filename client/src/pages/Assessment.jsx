import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { getRandomAssessmentQuestions } from "../data/questionBank";

function Assessment() {
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Randomized questions from the 100+ question bank
  const [questions, setQuestions] = useState(() => getRandomAssessmentQuestions(5));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRestart = () => {
    setQuestions(getRandomAssessmentQuestions(5));
    setCurrent(0);
    setSelected(null);
    setIsAnswerChecked(false);
    setScore(0);
    setAnswers([]);
  };

  const currentQ = questions[current] || questions[0];

  const handleSelect = (index) => {
    if (isAnswerChecked) return;

    setSelected(index);
    setIsAnswerChecked(true);

    const isCorrect = index === currentQ.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const answerRecord = {
      question: currentQ.question,
      selectedOption: currentQ.options[index],
      correctOption: currentQ.options[currentQ.answer],
      isCorrect
    };

    setAnswers((prev) => [...prev, answerRecord]);
  };

  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setIsAnswerChecked(false);
      return;
    }

    setLoading(true);

    // Calculate score reliably from all answered records
    const finalScore = answers.filter((a) => a.isCorrect).length;

    const level =
      finalScore >= 4
        ? "Confident Beginner"
        : finalScore >= 2
        ? "Beginner"
        : "Starting Out";

    const updatedUser = {
      ...(user || {}),
      name: user?.name || "Learner",
      assessment: {
        score: finalScore,
        total: questions.length,
        level,
        answers
      }
    };

    if (user?._id) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/users/${user._id}/assessment`,
          {
            score: finalScore,
            total: questions.length,
            level,
            answers
          }
        );

        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Assessment patch failed:", error);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      navigate("/dashboard");
    } else {
      localStorage.setItem(
        "pendingAssessment",
        JSON.stringify({
          score: finalScore,
          total: questions.length,
          level,
          answers
        })
      );
      navigate("/signup");
    }
  };

  const progressPercentage = Math.round(((current + 1) / questions.length) * 100);
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
            onClick={() => navigate("/quiz/internet-basics")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#64716F] transition hover:bg-[#F4F7F5] hover:text-[#173B3A]"
          >
            <span className="text-base">✓</span>
            <span>Quizzes</span>
          </button>

          <button
            onClick={() => navigate("/assessment")}
            className="flex w-full items-center gap-3 rounded-xl bg-[#E4F3EC] px-4 py-3 text-sm font-semibold text-[#1E615A]"
          >
            <span className="text-base">📊</span>
            <span>Assessment</span>
          </button>
        </nav>

        {/* Bottom encouragement message */}
        <div className="absolute bottom-6 left-5 right-5 rounded-2xl bg-[#F1F7F1] p-4">
          <div className="text-xl">🌟</div>
          <p className="mt-2 text-xs font-semibold text-[#315B4F]">
            100+ Skill Assessment
          </p>
          <p className="mt-1 text-[11px] leading-4 text-[#71817D]">
            Fresh randomized questions every time to accurately evaluate your confidence level.
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
          onClick={() => navigate("/quiz/internet-basics")}
          className="flex flex-col items-center gap-0.5 py-1 text-xs font-medium text-[#64716F] transition hover:text-[#173B3A]"
        >
          <span className="text-base">✓</span>
          <span>Quizzes</span>
        </button>
        <button
          onClick={() => navigate("/assessment")}
          className="flex flex-col items-center gap-0.5 py-1 text-xs font-bold text-[#1E615A]"
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

            <div className="hidden md:block">
              <p className="text-sm text-[#81908C]">
                Baseline Digital Skill Assessment
              </p>
            </div>
          </div>

          {/* Profile Dropdown (Only Logout) */}
          {user && user._id ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-2xl border border-[#DCEFE8] bg-white px-3 py-1.5 shadow-xs transition hover:border-[#24645D]/40 hover:bg-[#FAFDFB] focus:outline-none focus:ring-2 focus:ring-[#24645D]/15"
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
                      {user.name || "Learner"}
                    </p>
                    {user.email && (
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
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-[#DCEFE8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1E615A] hover:bg-[#F0F8F5]"
            >
              Sign In
            </button>
          )}
        </header>

        {/* Content Body */}
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 md:px-10 md:py-8 pb-24 md:pb-10">
          {/* Assessment Header banner & Controls */}
          <div className="mb-5 sm:mb-6 flex items-center justify-between flex-wrap gap-2.5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E4F3EC] px-3.5 py-1 text-xs font-semibold text-[#1E615A]">
                <span>🌱</span>
                <span>Question {current + 1} of {questions.length}</span>
              </div>
              <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#173B3A]">
                Evaluate Your Starting Skill Level
              </h1>
            </div>

            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D5E2DC] bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-[#1E615A] transition hover:bg-[#F0F8F5]"
              title="Draw new randomized assessment questions"
            >
              <span>🎲</span>
              <span>New Questions</span>
            </button>
          </div>

          {/* Progress Card */}
          <div className="rounded-2xl border border-[#E4EBE7] bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#81908C]">
                Progress: {current + 1} / {questions.length} answered
              </span>
              <span className="font-bold text-[#24645D]">
                Current Score: {score} / {questions.length}
              </span>
            </div>
            <div className="mt-2.5 sm:mt-3 h-2 overflow-hidden rounded-full bg-[#E5EBE8]">
              <div
                className="h-2 rounded-full bg-[#24645D] transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Main Question Card */}
          <div className="mt-5 sm:mt-6 rounded-3xl border border-[#E4EBE7] bg-white p-5 sm:p-7 shadow-xs">
            <h2 className="text-xl font-bold text-[#173B3A] md:text-2xl leading-relaxed">
              {currentQ?.question}
            </h2>

            {/* Options List */}
            <div className="mt-6 space-y-3">
              {currentQ?.options.map((opt, idx) => {
                let cardStyle =
                  "border-[#E4EBE7] bg-[#FAFDFB] hover:border-[#24645D]/40 hover:bg-[#F0F8F5]";

                if (isAnswerChecked) {
                  if (idx === currentQ.answer) {
                    cardStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20";
                  } else if (selected === idx) {
                    cardStyle = "border-rose-400 bg-rose-50 text-rose-900";
                  } else {
                    cardStyle = "border-[#E4EBE7] bg-white opacity-50";
                  }
                } else if (selected === idx) {
                  cardStyle = "border-[#24645D] bg-[#E4F3EC] text-[#173B3A] ring-2 ring-[#24645D]/20";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswerChecked}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-medium transition duration-150 ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white border border-[#D5E2DC] text-xs font-bold text-[#173B3A] shadow-2xs">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswerChecked && idx === currentQ.answer && (
                      <span className="shrink-0 text-emerald-600 font-bold text-base">✓</span>
                    )}
                    {isAnswerChecked && selected === idx && idx !== currentQ.answer && (
                      <span className="shrink-0 text-rose-600 font-bold text-base">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answering */}
            {isAnswerChecked && (
              <div className="mt-6 rounded-2xl border border-[#DCEFE8] bg-[#F4FAF7] p-4 text-xs text-[#1E615A] animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <span className="text-base">💡</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#173B3A]">Explanation:</p>
                    <p className="mt-0.5 leading-relaxed text-[#516B64]">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-8 flex items-center justify-between pt-4 border-t border-[#E4EBE7]">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-xs font-semibold text-[#81908C] hover:text-[#173B3A]"
              >
                ← Back to Dashboard
              </button>

              <button
                onClick={handleNext}
                disabled={!isAnswerChecked || loading}
                className="rounded-xl bg-[#24645D] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b4d47] hover:shadow disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading
                  ? "Saving Assessment..."
                  : current < questions.length - 1
                  ? "Next Question →"
                  : "Complete & See My Level →"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Assessment;