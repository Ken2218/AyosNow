import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import styles from '../../../styles/UserDashboard.module.css';

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button
            className={styles.modalCloseButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export const UserProfile = ({ data }) => {
  // Local copy of user so UI can update immediately after save
  const [user, setUser] = useState(data);

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Form states for profile
  const [name, setName] = useState(data.name || '');
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || '');
  const [address, setAddress] = useState(data.address || '');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userId = user?.id || localStorage.getItem('userId');

  const handleSaveProfile = async () => {
    if (!name.trim() || !phoneNumber.trim()) {
      alert('Name and phone number are required');
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/profile`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phoneNumber: phoneNumber.trim(),
            address: address.trim(),
          }),
        }
      );

      if (response.ok) {
        // Expecting updated user object from backend
        const updatedUser = await response.json();
        alert('✅ Profile updated successfully!');
        setIsEditing(false);

        // Update local user + form fields so UI reflects changes
        setUser(updatedUser);
        setName(updatedUser.name || '');
        setPhoneNumber(updatedUser.phoneNumber || '');
        setAddress(updatedUser.address || '');

        // Optional: also update localStorage if you store user there
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        const error = await response.text();
        alert('❌ Failed to update profile: ' + error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Something went wrong: ' + error.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    setIsSavingPassword(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/password`,
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
        alert('✅ Password changed successfully!');
        closePasswordModal();
      } else {
        const error = await response.text();
        alert('❌ ' + error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Something went wrong: ' + error.message);
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

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.profileHeader}>My Profile</h2>

      {/* Profile Information Card */}
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
            <p>{user?.name || 'Loading...'}</p>
          )}
        </div>

        <div className={styles.profileDetail}>
          <label>Email</label>
          <p>{user?.email || 'Loading...'}</p>
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
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.inputField}
            />
          ) : (
            <p>{user?.phoneNumber || 'Not provided'}</p>
          )}
        </div>

        <div className={styles.profileDetail}>
          <label>Primary Address</label>
          {isEditing ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
              className={styles.inputField}
            />
          ) : (
            <p>{user?.address || 'Not provided'}</p>
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
                // reset form fields to last saved user values
                setName(user?.name || '');
                setPhoneNumber(user?.phoneNumber || '');
                setAddress(user?.address || '');
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

      {/* Security & Access Card */}
      <div className={styles.settingsGroup}>
        <h4>Security & Access</h4>
        <button
          className={styles.securityButton}
          onClick={() => setIsChangingPassword(true)}
        >
          Change Password
        </button>
      </div>

      {/* Password Change Modal */}
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
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className={styles.eyeButton}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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