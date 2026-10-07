import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useRef } from "react";
import { lessonsData } from "../data/lessonsData";

function QuizResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasSaved = useRef(false);

  const {
    score = 0,
    total = 5,
    quizId = "internet-basics",
    lessonId = "1",
    lessonTitle = "Internet Basics",
    answers = []
  } = location.state || {};

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 60;

  const currentLessonNum = parseInt(lessonId, 10) || 1;
  const nextLessonNum = currentLessonNum + 1;
  const hasNextLesson = nextLessonNum <= lessonsData.length;

  const message =
    percentage >= 80
      ? "Outstanding Job! 🎉"
      : percentage >= 60
      ? "Good Work! Passed. 🌱"
      : "Keep Practicing! You'll get there. 💪";

  useEffect(() => {
    if (hasSaved.current || !user?._id) return;
    hasSaved.current = true;

    const saveQuizAndProgress = async () => {
      try {
        // 1. Save Quiz Record with answers
        const quizRes = await axios.post(`http://localhost:3000/api/users/${user._id}/quiz`, {
          quizId,
          score,
          total,
          answers
        });

        if (quizRes.data?.user) {
          localStorage.setItem("user", JSON.stringify(quizRes.data.user));
        }

        // 2. If quiz was passed and advances progress, update user progress
        const currentCompleted = user.lessonsCompleted || 0;
        if (passed && currentLessonNum > currentCompleted) {
          const updatedLessonsCompleted = currentLessonNum;
          const updatedProgress = Math.min(
            100,
            Math.round((updatedLessonsCompleted / lessonsData.length) * 100)
          );

          const progressRes = await axios.patch(
            `http://localhost:3000/api/users/${user._id}/progress`,
            {
              progress: updatedProgress,
              lessonsCompleted: updatedLessonsCompleted
            }
          );

          if (progressRes.data?.user) {
            localStorage.setItem(
              "user",
              JSON.stringify(progressRes.data.user)
            );
          }
        }
      } catch (error) {
        console.error("Failed to save quiz or progress:", error);
      }
    };

    saveQuizAndProgress();
  }, [user?._id, quizId, score, total, passed, currentLessonNum]);

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#173B3A]">
      {/* Header */}
      <header className="border-b border-[#E4EBE7] bg-white px-6 py-5">
        <div
          onClick={() => navigate("/dashboard")}
          className="mx-auto flex max-w-5xl cursor-pointer items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCEFE8] text-lg">
            🌐
          </div>
          <h1 className="font-bold">
            Net<span className="text-[#E67E52]">Learn</span>
          </h1>
        </div>
      </header>

      {/* Result Card */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-[#E4EBE7] bg-white p-8 text-center shadow-xl shadow-emerald-950/5">
          {/* Trophy / Medal */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E4F3EC] text-4xl shadow-xs">
            {passed ? "🏆" : "🌱"}
          </div>

          <p className="mt-6 text-xs font-bold tracking-wider text-[#E67E52]">
            {lessonTitle.toUpperCase()} QUIZ
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#173B3A] sm:text-3xl">
            {message}
          </h2>

          <p className="mt-2 text-xs text-[#81908C]">
            Here is your result for this module:
          </p>

          {/* Score Circle */}
          <div className="mx-auto mt-6 flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 border-[#DCEFE8] bg-[#FAFDFB]">
            <p className="text-3xl font-extrabold text-[#175B56]">
              {score} / {total}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[#81908C]">
              {percentage}%
            </p>
          </div>

          {/* Encouragement Banner */}
          <div className="mt-6 rounded-2xl bg-[#F1F7F1] p-4 text-xs leading-relaxed text-[#36574D]">
            {passed
              ? "Awesome! You have successfully mastered this topic. Your progress has been updated on your dashboard."
              : "Don't worry! Review the lesson notes and try the quiz again anytime to improve your score."}
          </div>

          {/* Answers Breakdown */}
          {answers && answers.length > 0 && (
            <div className="mt-6 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#81908C]">
                Your Answers Review:
              </h4>
              <div className="mt-3 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {answers.map((item, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-3 text-xs ${
                      item.isCorrect
                        ? "border-[#D2EBDD] bg-[#F4FAF6]"
                        : "border-[#FBDCD3] bg-[#FDF6F4]"
                    }`}
                  >
                    <p className="font-semibold text-[#173B3A]">
                      {idx + 1}. {item.question}
                    </p>
                    <div className="mt-1.5 flex flex-col gap-0.5 text-[11px]">
                      <span className={item.isCorrect ? "text-[#24645D] font-medium" : "text-red-600 font-medium"}>
                        Your answer: {item.selectedOption} {item.isCorrect ? "✓" : "✗"}
                      </span>
                      {!item.isCorrect && (
                        <span className="text-[#24645D]">
                          Correct: {item.correctOption}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 rounded-xl border border-[#DDE6E1] bg-white px-5 py-3 text-xs font-semibold text-[#48645D] transition hover:bg-[#F4F7F5]"
            >
              Back to Dashboard
            </button>

            {passed && hasNextLesson ? (
              <button
                onClick={() => navigate(`/lesson/${nextLessonNum}`)}
                className="flex-1 rounded-xl bg-[#175B56] px-5 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-[#124A46]"
              >
                Next Lesson ({nextLessonNum}) →
              </button>
            ) : (
              <button
                onClick={() => navigate(`/lesson/${currentLessonNum}`)}
                className="flex-1 rounded-xl bg-[#175B56] px-5 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-[#124A46]"
              >
                Review Lesson →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default QuizResult;