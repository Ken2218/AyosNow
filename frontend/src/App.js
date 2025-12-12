import React, { useState } from 'react';
import { Wrench, Star } from 'lucide-react';
import Login from './components/Login';
import SignupRole from './components/SignupRole';
import WorkerDashboard from './components/Worker/WorkerDashboard';
import UserDashboard from './components/User/UserDashboard';
import './index.css';

export default function App() {
  // ✅ Initialize view from localStorage
  const [view, setView] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.role === 'WORKER' ? 'WORKER_DASHBOARD' : 'USER_DASHBOARD';
    }
    return 'LOGIN';
  });

  // ✅ Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ Notification state (replaces alert)
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  // ✅ Logout function - clears localStorage WITH DELAY
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    showNotification('You have been logged out.', 'success');

    // delay before going back to LOGIN so the message is visible
    setTimeout(() => {
      setView('LOGIN');
    }, 1500);
  };

  // Helper function to show messages (passed to children) – no alert
  const showMessage = (msg, type) => {
    showNotification(msg, type || 'success');
  };

  // ✅ Check if we are currently inside ANY dashboard
  const isDashboardView =
    view === 'WORKER_DASHBOARD' || view === 'USER_DASHBOARD';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* Fixed notification above the right card, does NOT move layout */}
      {!isDashboardView && notification.message && (
        <div
          className={`app-toast ${
            notification.type === 'success'
              ? 'app-toast-success'
              : 'app-toast-error'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Left Column - Hide if we are inside a dashboard */}
      {!isDashboardView && (
        <div
          style={{
            width: '50%',
            backgroundColor: '#4f46e5',
            color: 'white',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="desktop-only"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '2rem',
              fontWeight: 'bold',
              zIndex: 10,
            }}
          >
            <Wrench color="#fbbf24" size={32} />
            <span>AyosNow</span>
          </div>
          <div style={{ zIndex: 10 }}>
            <h1
              style={{
                fontSize: '3rem',
                lineHeight: 1.2,
                marginBottom: '1.5rem',
              }}
            >
              Fix your problems, <br />
              <span style={{ color: '#bfdbfe' }}>one click away.</span>
            </h1>
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '1rem',
                borderRadius: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Star fill="currentColor" color="#1e1b4b" />
              <div>
                <div style={{ fontWeight: 'bold' }}>4.9/5 Rating</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  Trusted by 10k+ users
                </div>
              </div>
            </div>
          </div>
          <div style={{ zIndex: 10, opacity: 0.7 }}>&copy; 2024 AyosNow Inc.</div>
        </div>
      )}

      {/* Right Column - Full screen for dashboard, centered box for login/signup */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isDashboardView ? '0' : '2rem',
          backgroundColor: isDashboardView ? '#f3f4f6' : 'transparent',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: isDashboardView ? 'none' : '450px',
          }}
        >
          {view === 'LOGIN' && (
            <Login
              onRegisterClick={() => setView('REGISTER')}
              setView={setView}
              setUser={setUser}
              showMessage={showMessage}
            />
          )}

          {view === 'REGISTER' && (
            <SignupRole
              onLoginClick={() => setView('LOGIN')}
              setView={setView}
              setUser={setUser}
              showMessage={showMessage}
            />
          )}

          {/* ✅ Render Worker Dashboard with logout */}
          {view === 'WORKER_DASHBOARD' && user && (
            <WorkerDashboard
              user={user}
              setView={setView}
              setUser={setUser}
              onLogout={handleLogout}
            />
          )}

          {/* ✅ Render User Dashboard with logout */}
          {view === 'USER_DASHBOARD' && user && (
            <UserDashboard
              user={user}
              setView={setView}
              setUser={setUser}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </div>
  );
}
