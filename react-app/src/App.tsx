import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TrainingsInProgressPage from "./pages/TrainingsInProgressPage/TrainingsInProgressPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Dashboard from "./pages/DashboardPage/DashboardPage.tsx";
import TrainingsCompletedPage from "./pages/TrainingsCompletedPage/TrainingsCompletedPage.tsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx";
import TrainingLibrary from "./pages/TrainingLibraryPage/TrainingLibraryPage.tsx";
import TrainingPage from "./pages/TrainingPage/TrainingPage.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./muiTheme.ts";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/trainingsInProgress"
            element={<TrainingsInProgressPage />}
          />
          <Route
            path="/trainingsCompleted"
            element={<TrainingsCompletedPage />}
          />
          <Route path="/trainingLibrary" element={<TrainingLibrary />} />
          <Route path="/trainingPage" element={<TrainingPage/>}/> 
          <Route path="/*" element={<NotFoundPage />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
