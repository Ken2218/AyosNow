import React, { useState } from 'react';
import { User, Briefcase, CheckCircle, Eye, EyeOff } from 'lucide-react';
import styles from '../styles/SignupRole.module.css';
import loginStyles from '../styles/Login.module.css';

export default function SignupRole({ onLoginClick, setView, setUser }) {
  const [role, setRole] = useState('CUSTOMER');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [skill, setSkill] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // --- CORRECTION: Conditionally construct the payload ---
    const payload = {
      name,
      email,
      password,
      role,
    };
    
    // Only include skill if the user selected the WORKER role and provided a skill
    if (role === 'WORKER' && skill) {
        payload.skill = skill;
    }
    // -----------------------------------------------------

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const user = await res.json();
        alert('User registered successfully!');
        setUser(user);

        // Navigate based on role
        if (user.role === 'WORKER') {
          setView('WORKER_DASHBOARD');
        } else if (user.role === 'CUSTOMER') {
          setView('USER_DASHBOARD');
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

  // Step 1: Role selection
  if (step === 1) {
    return (
      <div className={styles.container}>
        <button type="button" onClick={onLoginClick} className={styles.backButton}>
          &larr; Back to Log In
        </button>

        <div className={styles.grid} style={{ marginTop: '0.5rem' }}>
          <button
            onClick={() => setRole('CUSTOMER')}
            className={`${styles.card} ${role === 'CUSTOMER' ? styles.cardActive : ''}`}
          >
            <div className={styles.iconBox}><User size={24} /></div>
            <div>
              <h3 className={styles.cardTitle}>I need a service</h3>
              <p className={styles.cardDesc}>Find electricians, plumbers, and more.</p>
            </div>
            {role === 'CUSTOMER' && <CheckCircle className={styles.checkIcon} />}
          </button>

          <button
            onClick={() => setRole('WORKER')}
            className={`${styles.card} ${role === 'WORKER' ? styles.cardActive : ''}`}
          >
            <div className={styles.iconBox}><Briefcase size={24} /></div>
            <div>
              <h3 className={styles.cardTitle}>I'm a skilled worker</h3>
              <p className={styles.cardDesc}>Find jobs and manage bookings.</p>
            </div>
            {role === 'WORKER' && <CheckCircle className={styles.checkIcon} />}
          </button>
        </div>

        <button onClick={() => setStep(2)} className={styles.continueButton}>
          Continue as {role}
        </button>
      </div>
    );
  }

  // Step 2: Registration Form
  return (
    <form
      className={styles.container}
      onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
    >
      <button type="button" onClick={() => setStep(1)} className={styles.backButton}>
        &larr; Back to role selection
      </button>

      {/* Full Name */}
      <div className={loginStyles.inputGroup}>
        <label className={loginStyles.label}>Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          className={loginStyles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Email */}
      <div className={loginStyles.inputGroup}>
        <label className={loginStyles.label}>Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          className={loginStyles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password */}
      <div className={loginStyles.inputGroup}>
        <label className={loginStyles.label}>Password</label>
        <div className={loginStyles.inputWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create password"
            className={loginStyles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="button"
            className={loginStyles.iconButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className={loginStyles.inputGroup}>
        <label className={loginStyles.label}>Confirm Password</label>
        <div className={loginStyles.inputWrapper}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            className={loginStyles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="button"
            className={loginStyles.iconButton}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Profession select if WORKER */}
      {role === 'WORKER' && (
        <div className={loginStyles.inputGroup}>
          <label className={loginStyles.label}>Profession</label>
          <select
            className={loginStyles.input}
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            required // Make skill required for workers
          >
            <option value="">Select</option>
            <option>Electrician</option>
            <option>Plumber</option>
            <option>Carpenter</option>
          </select>
        </div>
      )}

      <button type="submit" className={styles.continueButton}>
        Create Account
      </button>

      <p className={loginStyles.footerText}>
        Already have an account?{' '}
        <button onClick={onLoginClick} className={loginStyles.link}>
          Log in
        </button>
      </p>
    </form>
  );
}