import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import styles from '../styles/Login.module.css';

export default function Login({ onRegisterClick, setView, setUser, showMessage }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simulating a successful login with a static user object
    const user = {
      name: 'John Doe',
      email: email || 'johndoe@example.com',
      role: 'USER',  // Simulate a user (you can change to 'WORKER' for testing worker role)
    };

    // Replaced the real API call with a simulated response
    showMessage(`Welcome, ${user.name}!`, 'success'); 
    
    setUser(user);

    // Simulate navigation based on user role
    if (user.role === 'WORKER') {
      setView('WORKER_DASHBOARD');
    } else {
      setView('USER_DASHBOARD');
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleLogin}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Email</label>
        <div className={styles.inputWrapper}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label className={styles.label}>Password</label>
        </div>
        <div className={styles.inputWrapper}>
          <input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={styles.input}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.iconButton}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        Sign In
        <ArrowRight size={20} />
      </button>

      <p className={styles.footerText}>
        Don't have an account?{' '}
        <button type="button" onClick={onRegisterClick} className={styles.link}>
          Sign up for free
        </button>
      </p>
    </form>
  );
}
