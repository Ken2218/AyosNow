import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import styles from '../styles/Login.module.css';
import axios from 'axios';

// Added showMessage prop
export default function Login({ onRegisterClick, setView, setUser, showMessage }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = { email, password };
      // Note: In a real app, you should securely store the token/session ID here.
      const response = await axios.post('http://localhost:8080/api/auth/login', payload);
      const user = response.data;

      // Replaced alert() with custom message box
      showMessage(`Welcome, ${user.name}!`, 'success'); 
      
      setUser(user);

      // Role-Based Access Control (RBAC) logic already implemented here:
      if (user.role === 'WORKER') {
        setView('WORKER_DASHBOARD');
      } else {
        setView('USER_DASHBOARD');
      }

    } catch (err) {
      console.error(err);
      // Replaced alert() with custom message box
      showMessage(err.response?.data || 'Login failed. Please check your credentials.', 'error');
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
    //hehe
  );
}