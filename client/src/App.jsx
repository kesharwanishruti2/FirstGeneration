
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard.jsx";
import Lesson from "./pages/Lesson.jsx";
import Quiz from "./pages/Quiz.jsx";
import QuizResult from "./pages/QuizResult";
const App = () => {
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
          <Route path="/assessment" element={<Assessment />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/lesson/:id" element={<Lesson />} />

        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/quiz-result" element={<QuizResult />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
