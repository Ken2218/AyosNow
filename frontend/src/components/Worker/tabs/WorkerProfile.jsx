import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X, Star, User } from 'lucide-react';
import styles from '../../../styles/workerdashboard.module.css';

// WorkerHome-Style Notification and Modal
const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h4 className={styles.modalTitle}>Confirm Action</h4>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.modalButtonYes}>
            Yes
          </button>
          <button onClick={onCancel} className={styles.modalButtonNo}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button className={styles.modalCloseButton} onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export const WorkerProfile = ({ data }) => {
  const [worker, setWorker] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: null, onCancel: null });

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [name, setName] = useState(data?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(data?.phoneNumber || '+63');
  const [address, setAddress] = useState(data?.address || '');
  const [experienceYears, setExperienceYears] = useState(data?.experienceYears || 0);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const workerId = worker?.id || localStorage.getItem('userId');

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const showConfirmModal = (message, onConfirm, onCancel) => {
    setConfirmModal({ isOpen: true, message, onConfirm, onCancel });
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (!workerId) return;
      try {
        const response = await fetch(`http://localhost:8080/api/workers/${workerId}/profile`);
        if (response.ok) {
          const profileData = await response.json();
          setReviews(profileData.reviews || []);
          setAverageRating(profileData.rating || 0);
          setTotalReviews(profileData.totalReviews || 0);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [workerId]);

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+63')) {
      value = '+63';
    }
    const digits = value.slice(3).replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 10);
    setPhoneNumber('+63' + limitedDigits);
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !phoneNumber.trim()) {
      showNotification('Name and phone number are required', 'error');
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/workers/${workerId}/profile`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phoneNumber: phoneNumber.trim(),
            address: address.trim(),
            experienceYears: experienceYears.toString(),
          }),
        }
      );

      if (response.ok) {
        const updatedWorker = await response.json();
        showNotification('Profile updated successfully!', 'success');
        setIsEditing(false);

        setWorker(updatedWorker);
        setName(updatedWorker.name || '');
        setPhoneNumber(updatedWorker.phoneNumber || '+63');
        setAddress(updatedWorker.address || '');
        setExperienceYears(updatedWorker.experienceYears || 0);

        localStorage.setItem('user', JSON.stringify(updatedWorker));
      } else {
        const error = await response.text();
        showNotification('Failed to update profile: ' + error, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Something went wrong: ' + error.message, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification('All password fields are required', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showNotification('New password must be at least 6 characters', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification('New password and confirm password do not match', 'error');
      return;
    }

    setIsSavingPassword(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/workers/${workerId}/password`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        showNotification('Password changed successfully!', 'success');
        closePasswordModal();
      } else {
        const error = await response.text();
        showNotification(error, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Something went wrong: ' + error.message, 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const closePasswordModal = () => {
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? "#fbbf24" : "none"}
            stroke={star <= rating ? "#fbbf24" : "#d1d5db"}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={styles.profileContainer}>
      {/* Styled Notification */}
      {notification.message && (
        <div className={`${styles.notification} ${notification.type === 'success' ? styles.success : styles.error}`}>
          {notification.message}
        </div>
      )}

      {/* Styled Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
        message={confirmModal.message}
      />

      <h2 className={styles.profileHeader}>My Professional Profile</h2>

      <div className={styles.profileCard}>
        <div className={styles.profileDetail}>
          <label>Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.inputField}
            />
          ) : (
            <p>{worker?.name || 'Loading...'}</p>
          )}
        </div>

        <div className={styles.profileDetail}>
          <label>Professional Title / Skill</label>
          <p><strong>{worker?.skill || 'Loading...'}</strong></p>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Skill/Job type cannot be changed
          </span>
        </div>

        <div className={styles.profileDetail}>
          <label>Email</label>
          <p>{worker?.email || 'Loading...'}</p>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Email cannot be changed
          </span>
        </div>

        <div className={styles.profileDetail}>
          <label>Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className={styles.inputField}
              placeholder="+63"
            />
          ) : (
            <p>{worker?.phoneNumber || 'Not provided'}</p>
          )}
        </div>

        <div className={styles.profileDetail}>
          <label>Primary Service Area</label>
          {isEditing ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your service area"
              className={styles.inputField}
            />
          ) : (
            <p>{worker?.address || 'Not provided'}</p>
          )}
        </div>

        <div className={styles.profileDetail}>
          <label>Years of Experience</label>
          {isEditing ? (
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
              min="0"
              className={styles.inputField}
            />
          ) : (
            <p>{worker?.experienceYears || 0} years</p>
          )}
        </div>

        {isEditing ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={styles.editButton}
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              className={styles.editButton}
              onClick={() => {
                setIsEditing(false);
                setName(worker?.name || '');
                setPhoneNumber(worker?.phoneNumber || '+63');
                setAddress(worker?.address || '');
                setExperienceYears(worker?.experienceYears || 0);
              }}
              disabled={isSavingProfile}
              style={{ backgroundColor: '#6b7280' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Reviews Section */}
      <div className={styles.profileCard} style={{ marginTop: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
            Reviews & Ratings
          </h3>
          <div style={{ 
            textAlign: 'right',
            padding: '0.75rem 1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '8px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              justifyContent: 'flex-end'
            }}>
              <Star size={20} fill="#fbbf24" stroke="#fbbf24" />
              <span style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold',
                color: '#78350f'
              }}>
                {averageRating ? averageRating.toFixed(2) : '0.00'}
              </span>
            </div>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#92400e',
              marginTop: '0.25rem',
              margin: 0
            }}>
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>

        {loadingReviews ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {reviews.map((review) => (
              <div 
                key={review.id} 
                style={{
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <User size={18} color="#4f46e5" />
                    </div>
                    <div>
                      <p style={{ 
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        color: '#1f2937',
                        margin: 0,
                        marginBottom: '0.25rem'
                      }}>
                        {review.customerName}
                      </p>
                      <p style={{ 
                        fontSize: '0.7rem',
                        color: '#9ca3af',
                        margin: 0
                      }}>
                        {formatDate(review.date)}
                      </p>
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {renderStars(review.rating)}
                    <span style={{ 
                      fontWeight: '600',
                      color: '#4b5563',
                      fontSize: '0.85rem'
                    }}>
                      {review.rating}.0
                    </span>
                  </div>
                </div>
                {review.comment && (
                  <div style={{
                    paddingLeft: '3rem'
                  }}>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: '#4b5563',
                      lineHeight: '1.5',
                      fontStyle: 'italic',
                      margin: 0
                    }}>
                      "{review.comment}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#9ca3af'
          }}>
            <Star size={48} color="#d1d5db" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#6b7280' }}>
              No reviews yet
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Complete jobs to start receiving reviews from customers
            </p>
          </div>
        )}
      </div>

      <div className={styles.settingsGroup}>
        <h4>Security & Access</h4>
        <button
          className={styles.securityButton}
          onClick={() => setIsChangingPassword(true)}
        >
          Change Password
        </button>
      </div>

      <Modal
        isOpen={isChangingPassword}
        onClose={closePasswordModal}
        title="Change Password"
      >
        <div className={styles.passwordForm}>
          <div className={styles.formGroup}>
            <label>Current Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className={styles.eyeButton}
              >
                {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>New Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={styles.eyeButton}
              >
                {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Confirm New Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeButton}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              className={styles.updateButton}
              onClick={handleChangePassword}
              disabled={isSavingPassword}
            >
              {isSavingPassword ? 'Changing...' : 'Update Password'}
            </button>
            <button
              className={styles.cancelButton}
              onClick={closePasswordModal}
              disabled={isSavingPassword}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};