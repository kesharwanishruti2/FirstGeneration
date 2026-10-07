import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const questions = [
  {
    question: "What is the Internet?",
    options: [
      "A mobile app",
      "A network that connects computers and devices",
      "A phone",
      "A website"
    ],
    answer: 1,
    explanation: "The internet is a global network connecting billions of computers, phones, and devices worldwide."
  },
  {
    question: "What is Google mainly used for?",
    options: [
      "Searching for information online",
      "Charging a phone",
      "Printing photos",
      "Starting a computer"
    ],
    answer: 0,
    explanation: "Google is a search engine designed to help you search and find information, articles, and websites on the web."
  },
  {
    question: "Which one is a web browser?",
    options: [
      "Chrome",
      "WhatsApp",
      "Calculator",
      "Camera"
    ],
    answer: 0,
    explanation: "Google Chrome is a web browser used to view websites. WhatsApp is a messaging app, and calculator/camera are offline tools."
  },
  {
    question: "Which one can open a website?",
    options: [
      "A web browser",
      "A speaker",
      "A calculator",
      "A charger"
    ],
    answer: 0,
    explanation: "Web browsers like Chrome, Edge, and Safari are built specifically to load and display websites."
  },
  {
    question: "Which is a stronger password?",
    options: [
      "123456",
      "password",
      "Shruti123",
      "A mix of letters, numbers and symbols"
    ],
    answer: 3,
    explanation: "Strong passwords combine uppercase and lowercase letters, numbers, and special symbols so they cannot be easily guessed."
  }
];

function Assessment() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentQ = questions[current];

  // When user selects an option
  const handleSelect = (index) => {
    if (isAnswerChecked) return;

    setSelected(index);
    setIsAnswerChecked(true);

    const isCorrect = index === currentQ.answer;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
    }

    const answerRecord = {
      question: currentQ.question,
      selectedOption: currentQ.options[index],
      correctOption: currentQ.options[currentQ.answer],
      isCorrect
    };

    setAnswers((prev) => [...prev, answerRecord]);
  };

  // Move to next question or submit assessment
  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setIsAnswerChecked(false);
      return;
    }

    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const level =
      score >= 4
        ? "Confident Beginner"
        : score >= 2
        ? "Beginner"
        : "Starting Out";

    const updatedUser = {
      ...(user || {}),
      name: user?.name || "Learner",
      assessment: {
        score,
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
            score,
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
    } else {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    navigate("/dashboard");
  };

  const progressPercentage = Math.round(((current + 1) / questions.length) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9F6] text-[#173B3A]">
      {/* ================= HEADER ================= */}
      <header className="border-b border-[#E4EBE7] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCEFE8] text-lg">
              🌐
            </div>
            <span className="font-bold">
              Net<span className="text-[#E67E52]">Learn</span>
            </span>
          </div>

          <div className="text-xs font-semibold text-[#81908C]">
            Question <span className="text-[#173B3A]">{current + 1}</span> of {questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mt-3 max-w-4xl">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5EBE8]">
            <div
              className="h-full rounded-full bg-[#24645D] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* ================= QUESTION CARD ================= */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-3xl border border-[#E4EBE7] bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-10">
          
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#E4F3EC] px-3 py-1 text-xs font-semibold text-[#1E615A]">
              🌱 Initial Assessment
            </span>
            <span className="text-xs text-[#81908C]">
              {progressPercentage}% Complete
            </span>
          </div>

          <h2 className="mt-4 text-xl font-bold tracking-tight text-[#173B3A] sm:text-2xl">
            {currentQ.question}
          </h2>

          <p className="mt-1 text-xs text-[#71817D]">
            Click the answer that matches your current knowledge:
          </p>

          <div className="mt-6 space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selected === index;
              const isCorrectAnswer = index === currentQ.answer;

              let optionClass = "border-[#E4EBE7] bg-[#FAFDFB] text-[#334D48] hover:border-[#24645D]/40 hover:bg-white";
              let badgeColor = "border border-[#CCD8D2] bg-white text-[#71817D]";

              if (isAnswerChecked) {
                if (isCorrectAnswer) {
                  optionClass = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20";
                  badgeColor = "bg-emerald-600 text-white";
                } else if (isSelected && !isCorrectAnswer) {
                  optionClass = "border-red-400 bg-red-50 text-red-950 ring-2 ring-red-400/20";
                  badgeColor = "bg-red-500 text-white";
                } else {
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
                      ? "Correct!"
                      : `The correct answer is: "${currentQ.options[currentQ.answer]}"`}
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

          <div className="mt-8 flex items-center justify-between border-t border-[#E4EBE7] pt-6">
            <button
              onClick={() => navigate("/")}
              className="text-xs font-semibold text-[#81908C] hover:text-[#173B3A]"
            >
              Skip to Home
            </button>

            <button
              onClick={handleNext}
              disabled={!isAnswerChecked || loading}
              className="rounded-xl bg-[#24645D] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b4d47] hover:shadow disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Submitting..."
                : current === questions.length - 1
                ? "Finish Assessment →"
                : "Next Question →"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Assessment;