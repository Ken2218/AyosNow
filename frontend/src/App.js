import React, { useState } from 'react';
import { Wrench, XCircle, CheckCircle } from 'lucide-react';
import Login from './components/Login';
import SignupRole from './components/SignupRole';
import WorkerDashboard from './components/Worker/WorkerDashboard'; 
import UserDashboard from './components/User/UserDashboard';
import './index.css';
import { Star } from 'lucide-react';

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
    success: { backgroundColor: '#10b981' },
    error: { backgroundColor: '#ef4444' },
  };

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div style={{...baseStyle, ...typeStyles[type]}}>
      <Icon size={20} style={{ marginRight: '10px' }} />
      <span>{message}</span>
      <button onClick={onClose} style={{ marginLeft: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>
        &times;
      </button>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('LOGIN');
  const [user, setUser] = useState(null); 
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const isDashboard = view === 'WORKER_DASHBOARD' || view === 'USER_DASHBOARD';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
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
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Trusted by 500 users</div>
              </div>
            </div>
le-sorting
          </div>
          <div style={{ zIndex: 10, opacity: 0.7 }}>&copy; 2025 AyosNow Inc.</div>
        </div>
      )}

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: isDashboard ? '0' : '2rem',
        backgroundColor: isDashboard ? 'white' : '#f9fafb'
      }}>
        <div style={{ width: '100%', maxWidth: isDashboard ? 'none' : '450px' }}>
          
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
          
          {view === 'WORKER_DASHBOARD' && user && (
            <WorkerDashboard 
              user={user} 
              setView={setView} 
              setUser={setUser}
            />
          )}

          {view === 'USER_DASHBOARD' && user && (
            <UserDashboard 
              user={user} 
              setView={setView} 
              setUser={setUser}
            />
          )}

        </div>
      </div>
      
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
