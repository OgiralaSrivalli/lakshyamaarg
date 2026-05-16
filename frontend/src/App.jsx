import React from 'react';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AssessmentPage from './pages/AssessmentPage';
import ResultsPage from './pages/ResultsPage';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

const AppRouter = () => {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('landing');

  useEffect(() => {
    if (user && page === 'landing') setPage('dashboard');
  }, [user]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 16 }}>
          <img src="/logo.png" alt="Logo" style={{ height: '24px', width: '24px', borderRadius: '6px', opacity: 0.9, boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)' }} />
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'Outfit', fontSize: 16, fontWeight: 500 }}>Loading Lakshyamaarg...</p>
        </div>
      </div>
    );
  }

  const navigate = (p) => setPage(p);

  if (!user) {
    if (page === 'auth') return <AuthPage navigate={navigate} />;
    return <LandingPage navigate={navigate} />;
  }

  if (page === 'assessment') return <AssessmentPage navigate={navigate} />;
  if (page === 'results') return <ResultsPage navigate={navigate} />;
  return <Dashboard navigate={navigate} currentPage={page} />;
};

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
