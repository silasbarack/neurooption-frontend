import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DeleteAccountPage from "./pages/DeleteAccountPage";
import ProfilePage from "./pages/ProfilePage";
import TradingPage from "./pages/TradingPage";
import FinancePage from "./pages/FinancePage";
import MarketPage from "./pages/MarketPage";
import ChatPage from "./pages/ChatPage";
import HelpPage from "./pages/HelpPage";
import AchievementsPage from "./pages/AchievementsPage";
import TournamentsPage from "./pages/TournamentsPage";

function RequireAuth({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("neurooption_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registration" element={<Navigate to="/register" replace />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/trading"
          element={
            <RequireAuth>
              <TradingPage />
            </RequireAuth>
          }
        />

        <Route
          path="/finance"
          element={
            <RequireAuth>
              <FinancePage />
            </RequireAuth>
          }
        />

        <Route
          path="/market"
          element={
            <RequireAuth>
              <MarketPage />
            </RequireAuth>
          }
        />

        <Route
          path="/chat"
          element={
            <RequireAuth>
              <ChatPage />
            </RequireAuth>
          }
        />

        <Route
          path="/help"
          element={
            <RequireAuth>
              <HelpPage />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
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
          path="/tournaments"
          element={
            <RequireAuth>
              <TournamentsPage />
            </RequireAuth>
          }
        />

        <Route
          path="/delete-account"
          element={
            <RequireAuth>
              <DeleteAccountPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
