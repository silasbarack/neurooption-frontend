import React, { useState } from 'react';
import TradingDashboard from './pages/TradingDashboard';
import LandingPage from './pages/LandingPage';
import AuthModal from './components/AuthModal';
import { api } from './api/client';
import './styles/globals.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowAuth(false);
  };

  return (
    <div className="app-root">
      {isLoggedIn ? (
        <TradingDashboard user={user} onLogout={() => { api.auth.logout(); setUser(null); setIsLoggedIn(false); }} />
      ) : (
        <LandingPage onOpenAuth={(mode) => { setAuthMode(mode); setShowAuth(true); }} />
      )}
      {showAuth && (
        <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onLogin={handleLogin} onSwitchMode={setAuthMode} />
      )}
    </div>
  );
}
