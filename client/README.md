# 🌐 NetLearn — Client (Frontend)

The frontend for the **NetLearn** Internet Basics application built using **React 19**, **Vite**, and **Tailwind CSS v4**.

---

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

---

## 📁 Key Pages & Components

- `src/pages/Home.jsx`: Landing page with hero banner, benefits, and curriculum overview.
- `src/pages/Register.jsx`: Simple user registration & sign-in.
- `src/pages/Assessment.jsx`: 5-question initial assessment determining learner starting level.
- `src/pages/Dashboard.jsx`: Progress overview, dynamic module unlocking, and quiz launcher.
- `src/pages/Lesson.jsx`: Interactive lesson reader with analogies, key points, and detailed breakdowns.
- `src/pages/Quiz.jsx`: Topic-specific multiple-choice quizzes with live feedback.
- `src/pages/QuizResult.jsx`: Score summary, automatic progress advancement, and navigation.
- `src/data/lessonsData.js`: Centralized data store for lessons, analogies, and quizzes.
