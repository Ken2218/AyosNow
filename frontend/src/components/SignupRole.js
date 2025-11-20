import React, { useState } from 'react';
import { User, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import styles from '../styles/SignupRole.module.css';
import loginStyles from '../styles/Login.module.css';

export default function SignupRole({ onLoginClick, setView, setUser }) {
  const [role, setRole] = useState('CUSTOMER');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skill, setSkill] = useState('');

  const handleRegister = async () => {
    const payload = { name, email, password, role, skill: role === 'WORKER' ? skill : null };

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const user = await res.json(); // backend must return created user
        alert('User registered successfully!');
        setUser(user);

      if (user.role === 'WORKER') {
          setView('WORKER_DASHBOARD');
        } else if (user.role === 'CUSTOMER') {
          setView('USER_DASHBOARD'); // Changed from alert to actual redirect
        }

      } else {
        const error = await res.text();
        alert('Registration failed: ' + error);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Check console.');
    }
  };

  // Step 1: Choose Role
  if (step === 1) {
    return (
      <div className={styles.container}>
        <div className={styles.grid}>
          <button onClick={() => setRole('CUSTOMER')} className={`${styles.card} ${role === 'CUSTOMER' ? styles.cardActive : ''}`}>
            <div className={styles.iconBox}><User size={24} /></div>
            <div><h3 className={styles.cardTitle}>I need a service</h3><p className={styles.cardDesc}>Find electricians, plumbers, and more.</p></div>
            {role === 'CUSTOMER' && <CheckCircle className={styles.checkIcon} />}
          </button>

          <button onClick={() => setRole('WORKER')} className={`${styles.card} ${role === 'WORKER' ? styles.cardActive : ''}`}>
            <div className={styles.iconBox}><Briefcase size={24} /></div>
            <div><h3 className={styles.cardTitle}>I'm a skilled worker</h3><p className={styles.cardDesc}>Find jobs and manage bookings.</p></div>
            {role === 'WORKER' && <CheckCircle className={styles.checkIcon} />}
          </button>
        </div>

        <button onClick={() => setStep(2)} className={styles.continueButton}>Continue as {role}</button>
        <p className={loginStyles.footerText}>Already have an account? <button onClick={onLoginClick} className={loginStyles.link}>Log in</button></p>
      </div>
    );
  }

  // Step 2: Registration Form
  return (
    <form className={styles.container} onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
      <button type="button" onClick={() => setStep(1)} className={styles.backButton}>&larr; Back to role selection</button>

      <div className={loginStyles.inputGroup}><label className={loginStyles.label}>Full Name</label><input type="text" placeholder="John Doe" className={loginStyles.input} value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className={loginStyles.inputGroup}><label className={loginStyles.label}>Email Address</label><input type="email" placeholder="you@example.com" className={loginStyles.input} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className={loginStyles.inputGroup}><label className={loginStyles.label}>Password</label><input type="password" placeholder="Create password" className={loginStyles.input} value={password} onChange={(e) => setPassword(e.target.value)} /></div>

      {role === 'WORKER' && (
        <div className={loginStyles.inputGroup}>
          <label className={loginStyles.label}>Profession</label>
          <select className={loginStyles.input} value={skill} onChange={(e) => setSkill(e.target.value)}>
            <option value="">Select</option>
            <option>Electrician</option>
            <option>Plumber</option>
            <option>Carpenter</option>
          </select>
        </div>
      )}

      <button className={styles.continueButton}>Create Account</button>
    </form>
  );
}
