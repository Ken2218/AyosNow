import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import styles from '../styles/Login.module.css';
import axios from 'axios';

export default function Login({ onRegisterClick, setView, setUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = { email, password };
      const response = await axios.post('http://localhost:8080/api/auth/login', payload);
      const user = response.data;

      alert(`Welcome, ${user.name}!`);
      setUser(user);

      // Redirect based on role
      if (user.role === 'WORKER') {
        setView('WORKER_DASHBOARD');
      } else {
        alert('Customer dashboard not implemented yet.');
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data || 'Login failed');
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleLogin}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Email Address</label>
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
        <button onClick={onRegisterClick} className={styles.link}>
          Sign up for free
        </button>
      </p>
    </form>
  );
}
