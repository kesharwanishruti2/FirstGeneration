import { useNavigate, useParams } from "react-router";
import { lessonsData } from "../data/lessonsData";

function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find corresponding lesson or fallback to first
  const lesson =
    lessonsData.find((l) => l.id === id || l.number === id) || lessonsData[0];

  const lessonIndex = lessonsData.findIndex((l) => l.id === lesson.id);
  const totalLessons = lessonsData.length;
  const progressPercent = Math.round(((lessonIndex + 1) / totalLessons) * 100);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#173B3A]">
      {/* Top Navbar */}
      <header className="flex items-center justify-between border-b border-[#E4EBE7] bg-white px-6 py-5 md:px-10">
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

        {/* Lesson Progress Bar */}
        <div className="hidden w-64 md:block">
          <div className="flex justify-between text-xs text-[#81908C]">
            <span>
              {lessonIndex + 1} of {totalLessons} lessons
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5EBE8]">
            <div
              className="h-2 rounded-full bg-[#24645D] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#243B53] text-xs font-bold text-white shadow-xs">
          {user?.name?.charAt(0)?.toUpperCase() || "S"}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8 md:px-10">
        {/* Lesson Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#E4F3EC] px-4 py-1.5 text-xs font-semibold text-[#24645D]">
          <span>●</span>
          Module {lesson.number}: {lesson.title}
        </div>

        {/* Lesson Heading Section */}
        <section className="mt-5 grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#173B3A] md:text-4xl">
              {lesson.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#667572] md:text-base">
              {lesson.subtitle}
            </p>
          </div>

          {/* Visual Illustration Badge */}
          <div className="flex h-52 items-center justify-center rounded-3xl border border-[#DCEFE8] bg-[#EAF4EE]">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-[#BBDDD0] text-7xl shadow-xs">
              {lesson.id === "1" ? "🌍" : lesson.id === "2" ? "🧭" : lesson.id === "3" ? "🔍" : "🛡️"}
              <span className="absolute -right-5 top-2 text-3xl">💻</span>
              <span className="absolute -left-6 bottom-2 text-3xl">📱</span>
            </div>
          </div>
        </section>

        {/* Friendly Analogy / Intuition Card */}
        <section className="mt-8 rounded-2xl border border-[#DCEFE8] bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💡</span>
            <h3 className="text-base font-bold text-[#173B3A]">
              Think of it this way
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#556965]">
            {lesson.analogy}
          </p>
        </section>

        {/* Key Takeaways */}
        <section className="mt-6 rounded-2xl bg-[#EAF5EF] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D2EBDD] text-sm font-bold text-[#27705F]">
              ✓
            </div>
            <h3 className="font-bold text-[#173B3A]">
              Key Points to Remember
            </h3>
          </div>

          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#35534B]">
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
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {lesson.details.map((detail, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#E4EBE7] bg-white p-5 shadow-xs"
              >
                <h4 className="font-bold text-sm text-[#173B3A]">
                  {detail.heading}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#71817D]">
                  {detail.body}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-10 flex items-center justify-between border-t border-[#E4EBE7] pt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-[#DDE6E1] bg-white px-5 py-3 text-sm font-semibold text-[#48645D] transition hover:bg-[#F4F7F5]"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={() => navigate(`/quiz/${lesson.quizId}`)}
            className="rounded-xl bg-[#175B56] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#124A46]"
          >
            Take Lesson Quiz →
          </button>
        </div>
      </main>
    </div>
  );
}

export default Lesson;