import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import theme from "./muiTheme.ts";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Dashboard from "./pages/DashboardPage/DashboardPage.tsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx";
import TrainingLibrary from "./pages/TrainingLibraryPage/TrainingLibraryPage.tsx";
import PathwayLibrary from "./pages/PathwayLibraryPage/PathwayLibraryPage.tsx";
import VolunteerLoginPage from "./pages/LoginPage/VolunteerLoginPage/VolunteerLoginPage.tsx";
import AdminLoginPage from "./pages/LoginPage/AdminLoginPage/AdminLoginPage.tsx";
import AchievementsPage from "./pages/AchievementsPage/AchievementsPage.tsx";
import TrainingPage from "./pages/TrainingPage/TrainingPage.tsx";
import TrainingLandingPage from "./pages/TrainingLandingPage/TrainingLandingPage.tsx";
import RequireAuth from "./auth/RequireAuth/RequireAuth.tsx";
import LogoutPage from "./pages/LogoutPage/LogoutPage.tsx";
import QuizPage from "./pages/QuizPage/QuizPage.tsx";
import QuizResult from "./pages/QuizResultPage/QuizResultPage.tsx";

import { getVolunteer } from "./backend/FirestoreCalls";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/volunteer" element={<VolunteerLoginPage />} />
            <Route path="/login/admin" element={<AdminLoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />

            <Route
              path="/"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings"
              element={
                <RequireAuth>
                  <TrainingLibrary />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings/:id"
              element={
                <RequireAuth>
                  <TrainingLandingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings/resources/:idx"
              element={
                <RequireAuth>
                  <TrainingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings/quizresult"
              element={
                <RequireAuth>
                  <QuizResult
                    achievedScore={5}
                    totalScore={10}
                    passingScore={5}
                  />
                </RequireAuth>
              }
            />
            <Route
              path="/trainings/quiz"
              element={
                <RequireAuth>
                  <QuizPage />
                </RequireAuth>
              }
            />
            <Route
              path="/pathways"
              element={
                <RequireAuth>
                  <PathwayLibrary />
                </RequireAuth>
              }
            />
            <Route
              path="/achievements"
              element={
                <RequireAuth>
                  <AchievementsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <NotFoundPage />
                </RequireAuth>
              }
            />

            <Route
              path="/testfunctions"
              element={
                <RequireAuth>
                  <button
                    onClick={() => {
                      // Add test function
                      console.log(getVolunteer("ZpfkIPPdBuaeA6iFyhaR"));
                    }}>
                    TEST
                  </button>
                </RequireAuth>
              }
            />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
