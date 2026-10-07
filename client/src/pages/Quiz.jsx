import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { quizzesData } from "../data/lessonsData";

function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();

  const quiz = quizzesData[id] || quizzesData["internet-basics"];
  const questions = quiz.questions;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const currentQ = questions[current];

  // When user clicks an option
  const handleSelect = (index) => {
    if (isAnswerChecked) return; // Prevent changing answer after selection

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

  // Move to next question or submit quiz
  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setIsAnswerChecked(false);
    } else {
      navigate("/quiz-result", {
        state: {
          score,
          total: questions.length,
          quizId: id || "internet-basics",
          lessonId: quiz.lessonId,
          lessonTitle: quiz.lessonTitle,
          answers
        }
      });
    }
  };

  const progressPercent = Math.round(((current + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#173B3A]">
      {/* Top Header */}
      <header className="border-b border-[#E4EBE7] bg-white px-6 py-5 md:px-10">
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex cursor-pointer items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCEFE8] text-lg">
              🌐
            </div>
            <h1 className="font-bold">
              Net<span className="text-[#E67E52]">Learn</span>
            </h1>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#243B53] text-xs font-bold text-white shadow-xs">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mx-auto mt-5 max-w-3xl">
          <div className="flex justify-between text-xs text-[#81908C]">
            <span>
              {quiz.title} • Question {current + 1} of {questions.length}
            </span>
            <span className="font-semibold text-[#24645D]">
              {progressPercent}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5EBE8]">
            <div
              className="h-2 rounded-full bg-[#24645D] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Quiz Area */}
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl border border-[#E4EBE7] bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-10">
          <span className="rounded-full bg-[#E4F3EC] px-3.5 py-1 text-xs font-semibold text-[#24645D]">
            {quiz.lessonTitle}
          </span>

          <h2 className="mt-4 text-xl font-bold tracking-tight text-[#173B3A] sm:text-2xl">
            {currentQ.question}
          </h2>

          <p className="mt-1 text-xs text-[#71817D]">
            Click the option you think is correct:
          </p>

          {/* Options List */}
          <div className="mt-6 space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selected === index;
              const isCorrectAnswer = index === currentQ.answer;

              // Determine visual styling for each state
              let optionClass = "border-[#E4EBE7] bg-[#FAFDFB] text-[#334D48] hover:border-[#24645D]/40 hover:bg-white";
              let badgeColor = "border border-[#CCD8D2] bg-white text-[#71817D]";

              if (isAnswerChecked) {
                if (isCorrectAnswer) {
                  // Always highlight correct answer in green
                  optionClass = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20";
                  badgeColor = "bg-emerald-600 text-white";
                } else if (isSelected && !isCorrectAnswer) {
                  // Highlight user's wrong answer in red
                  optionClass = "border-red-400 bg-red-50 text-red-950 ring-2 ring-red-400/20";
                  badgeColor = "bg-red-500 text-white";
                } else {
                  // Mute unaffected options
                  optionClass = "border-[#E4EBE7] bg-white text-gray-400 opacity-60";
                  badgeColor = "border border-gray-200 bg-gray-100 text-gray-400";
                }
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={isAnswerChecked}
                  onClick={() => handleSelect(index)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-medium transition duration-150 ${optionClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${badgeColor}`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {/* Icon Indicator */}
                  {isAnswerChecked && isCorrectAnswer && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      ✓ Correct
                    </span>
                  )}
                  {isAnswerChecked && isSelected && !isCorrectAnswer && (
                    <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800">
                      ✗ Wrong
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Explanation / Feedback Box */}
          {isAnswerChecked && (
            <div
              className={`mt-6 rounded-2xl border p-4 text-xs leading-relaxed transition-all duration-200 ${
                selected === currentQ.answer
                  ? "border-emerald-200 bg-[#F2FAF5] text-emerald-900"
                  : "border-amber-200 bg-[#FDF9F2] text-[#694813]"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-base">
                  {selected === currentQ.answer ? "🎉" : "💡"}
                </span>
                <div>
                  <p className="font-bold text-sm">
                    {selected === currentQ.answer
                      ? "Great Job! That's Correct."
                      : `Not quite! The correct answer is: "${currentQ.options[currentQ.answer]}"`}
                  </p>
                  {currentQ.explanation && (
                    <p className="mt-1 text-xs opacity-90">
                      {currentQ.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-[#E4EBE7] pt-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs font-semibold text-[#81908C] hover:text-[#173B3A]"
            >
              Exit Quiz
            </button>

            <button
              onClick={handleNext}
              disabled={!isAnswerChecked}
              className="rounded-xl bg-[#24645D] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b4d47] hover:shadow disabled:cursor-not-allowed disabled:opacity-40"
            >
              {current === questions.length - 1 ? "Finish Quiz →" : "Next Question →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Quiz;