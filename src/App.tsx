import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { getToken } from "./utils/storage";
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const DeleteAccountPage = lazy(() => import("./pages/DeleteAccountPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const TradingPage = lazy(() => import("./pages/TradingPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const MarketsPage = lazy(() => import("./pages/MarketsPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
import AppShell from "./components/shell/AppShell";
const ChatPage = lazy(() => import("./pages/ChatPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage"));
const TournamentsPage = lazy(() => import("./pages/TournamentsPage"));
const OpenTradesPage = lazy(() => import("./pages/OpenTradesPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const SignalsPage = lazy(() => import("./pages/SignalsPage"));
const SocialTradingPage = lazy(() => import("./pages/SocialTradingPage"));
const ExpressTradesPage = lazy(() => import("./pages/ExpressTradesPage"));
import RouteTransition from "./components/layout/RouteTransition";

/** Older content pages rendered inside the new app frame. */
function Shelled({ title, children }: { title: string; children: ReactNode }) {
  return (
    <RequireAuth>
      <AppShell title={title}>
        <div className="neo-legacy">{children}</div>
      </AppShell>
    </RequireAuth>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteTransition>
        <Suspense fallback={<div className="neo-route-loading" role="status"><span className="neo-skeleton" />Loading NeuroOption…</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

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

          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/market" element={<Navigate to="/markets" replace />} />
          <Route path="/deposit" element={<Navigate to="/finance" replace />} />
          <Route path="/withdraw" element={<Navigate to="/finance?tab=withdraw" replace />} />
          <Route path="/transactions" element={<Navigate to="/finance?tab=history" replace />} />

          <Route
            path="/chat"
            element={
              <Shelled title="Chat">
                <ChatPage />
              </Shelled>
            }
          />

          <Route
            path="/help"
            element={
              <Shelled title="Support">
                <HelpPage />
              </Shelled>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <AccountPage />
              </RequireAuth>
            }
          />

          <Route
            path="/settings"
            element={
              <Shelled title="Settings">
                <ProfilePage />
              </Shelled>
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
              <Shelled title="Tournaments">
                <TournamentsPage />
              </Shelled>
            }
          />

          <Route
            path="/open-trades"
            element={
              <Shelled title="Open Trades">
                <OpenTradesPage />
              </Shelled>
            }
          />

          <Route
            path="/history"
            element={
              <Shelled title="History">
                <HistoryPage />
              </Shelled>
            }
          />

          <Route
            path="/signals"
            element={
              <Shelled title="Signals">
                <SignalsPage />
              </Shelled>
            }
          />

          <Route
            path="/social-trading"
            element={
              <RequireAuth>
                <SocialTradingPage />
              </RequireAuth>
            }
          />

          <Route
            path="/express-trades"
            element={
              <Shelled title="Express Trades">
                <ExpressTradesPage />
              </Shelled>
            }
          />

          <Route
            path="/delete-account"
            element={
              <Shelled title="Delete Account">
                <DeleteAccountPage />
              </Shelled>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </RouteTransition>
    </BrowserRouter>
  );
}
