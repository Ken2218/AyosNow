import React, { useState } from 'react';
import { User, Briefcase, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// 1. MAP SKILLS TO DATABASE IDs
const JOB_TYPE_MAP = {
  'Plumbing': 1,
  'Electrical': 2,
  'Cleaning': 3,
  'Landscaping': 4,
  'Appliance Repair': 5,
  'Painting': 6
};

export default function SignupRole({ onLoginClick, setView, setUser, showMessage }) {
  const [role, setRole] = useState('CUSTOMER');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 added
  const [skill, setSkill] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);

    const payload = { 
      name, 
      email, 
      password, 
      role,
      jobTypeId: role === 'WORKER' ? JOB_TYPE_MAP[skill] : null,
      location: role === 'WORKER' ? location : address,
      phoneNumber: phoneNumber,
      experienceYears: role === 'WORKER' ? experienceYears : null
    };

    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', payload);
      const user = res.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      showMessage(`Account created successfully! Welcome, ${user.name}!`, 'success');
      setUser(user);

      if (user.role === 'WORKER') {
        setView('WORKER_DASHBOARD');
      } else {
        setView('USER_DASHBOARD');
      }

    } catch (err) {
      console.error(err);
      showMessage(err.response?.data || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const cardStyle = (isSelected) => ({
    border: `2px solid ${isSelected ? '#4f46e5' : '#e5e7eb'}`,
    borderRadius: '12px',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    backgroundColor: isSelected ? '#eef2ff' : 'white',
    marginBottom: '1rem'
  });

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
        {step === 1 ? 'Join AyosNow' : 'Create Your Account'}
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        {step === 1 ? 'Get started in minutes' : 'Fill in your details'}
      </p>

      {step === 1 && (
        <div>
          <div 
            style={cardStyle(role === 'CUSTOMER')}
            onClick={() => setRole('CUSTOMER')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <User size={40} color="#4f46e5" />
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.25rem' }}>I Need Services</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Book trusted professionals</p>
              </div>
            </div>
            {role === 'CUSTOMER' && (
              <CheckCircle 
                size={24} 
                color="#10b981" 
                style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              />
            )}
          </div>

          <div 
            style={cardStyle(role === 'WORKER')}
            onClick={() => setRole('WORKER')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Briefcase size={40} color="#4f46e5" />
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.25rem' }}>I Provide Services</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Connect with customers</p>
              </div>
            </div>
            {role === 'WORKER' && (
              <CheckCircle 
                size={24} 
                color="#10b981" 
                style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              />
            )}
          </div>

          <button 
            onClick={() => setStep(2)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1rem'
            }}
          >
            Continue <ArrowRight size={20} />
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={onLoginClick}
              style={{
                background: 'none',
                border: 'none',
                color: '#4f46e5',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          
          {/* NAME */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Full Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {/* PASSWORD WITH SHOW/HIDE 👇 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Password
            </label>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  paddingRight: '2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* CUSTOMER FIELDS */}
          {role === 'CUSTOMER' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0917-123-4567"
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Primary Address
                </label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>
            </>
          )}

          {/* WORKER FIELDS */}
          {role === 'WORKER' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Professional Skill
                </label>
                <select 
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select your skill</option>
                  {Object.keys(JOB_TYPE_MAP).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Service Area / Address
                </label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0917-123-4567"
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Years of Experience
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="e.g. 3"
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>
            </>
          )}

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
            {!isLoading && <ArrowRight size={20} />}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              style={{
                background: 'none',
                border: 'none',
                color: '#4f46e5',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ← Go Back
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
