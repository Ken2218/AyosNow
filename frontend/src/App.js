import React, { useState, useEffect } from 'react';
import { Wrench, Star, XCircle, CheckCircle } from 'lucide-react';
import Login from './components/Login';
import SignupRole from './components/SignupRole';
import WorkerDashboard from './components/WorkerDashboard'; 
import UserDashboard from './components/UserDashboard';
import './index.css';

// Custom Toast/Message Component
const Toast = ({ message, type, onClose }) => {
  const baseStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'white',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'opacity 0.3s, transform 0.3s',
  };

  const typeStyles = {
    success: { backgroundColor: '#10b981' }, // emerald-500
    error: { backgroundColor: '#ef4444' }, // red-500
  };

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div style={{...baseStyle, ...typeStyles[type]}}>
      <Icon size={20} style={{ marginRight: '10px' }} />
      <span>{message}</span>
      <button onClick={onClose} style={{ marginLeft: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
        &times;
      </button>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('LOGIN'); // LOGIN | REGISTER | WORKER_DASHBOARD | USER_DASHBOARD
  const [user, setUser] = useState(null); 
  
  // State for the custom message box (to replace alert())
  const [message, setMessage] = useState(null);

  // Function to show a message
  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    // Auto-hide after 4 seconds
    setTimeout(() => setMessage(null), 4000);
  };

  // Helper to check if we are in a dashboard view
  const isDashboard = view === 'WORKER_DASHBOARD' || view === 'USER_DASHBOARD';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Left Column - Hide if in ANY dashboard view */}
      {!isDashboard && (
        <div style={{ 
          width: '50%', 
          backgroundColor: '#4f46e5', 
          color: 'white', 
          padding: '3rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          position: 'relative', 
          overflow: 'hidden' 
        }} className="desktop-only">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '2rem', fontWeight: 'bold', zIndex: 10 }}>
            <Wrench color="#fbbf24" size={32} />
            <span>AyosNow</span>
          </div>
          <div style={{ zIndex: 10 }}>
            <h1 style={{ fontSize: '3rem', lineHeight: 1.2, marginBottom: '1.5rem' }}>
              Fix your problems, <br />
              <span style={{ color: '#bfdbfe' }}>one click away.</span>
            </h1>
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '1rem', display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
              <Star fill="currentColor" color="#1e1b4b" />
              <div>
                <div style={{ fontWeight: 'bold' }}>4.9/5 Rating</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Trusted by 10k+ users</div>
              </div>
            </div>
          </div>
          <div style={{ zIndex: 10, opacity: 0.7 }}>&copy; 2024 AyosNow Inc.</div>
        </div>
      )}

      {/* Right Column - Full screen for dashboard */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: isDashboard ? '0' : '2rem',
        backgroundColor: isDashboard ? 'white' : '#f9fafb' // Light background for auth pages
      }}>
        <div style={{ width: '100%', maxWidth: isDashboard ? 'none' : '450px' }}>
          
          {view === 'LOGIN' && (
            <Login 
              onRegisterClick={() => setView('REGISTER')} 
              setView={setView} 
              setUser={setUser} 
              showMessage={showMessage} // Pass the message handler
            />
          )}
          
          {view === 'REGISTER' && (
            <SignupRole 
              onLoginClick={() => setView('LOGIN')} 
              setView={setView} 
              setUser={setUser} 
            />
          )}
          
          {view === 'WORKER_DASHBOARD' && user && (
            <WorkerDashboard user={user} setView={setView} setUser={setUser} />
          )}

          {view === 'USER_DASHBOARD' && user && (
            <UserDashboard user={user} setView={setView} setUser={setUser} />
          )}

        </div>
      </div>
      
      {/* Render the Toast Message */}
      {message && (
        <Toast 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage(null)} 
        />
      )}

    </div>
  );
}