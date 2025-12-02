import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from '../../../styles/UserDashboard.module.css';

export const UserProfile = ({ data }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Profile editing states
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

    // Get userId from data (assuming it's passed from parent or available in user context)
    const userId = data.id || localStorage.getItem('userId');

    const handleSave = async () => {
        if (!name.trim() || !phoneNumber.trim()) {
            alert('Name and phone number are required');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    phoneNumber: phoneNumber.trim(),
                    address: address.trim()
                })
            });

            if (response.ok) {
                await response.json();
                alert('✅ Profile updated successfully!');
                setIsEditing(false);
                window.location.reload();
                // Refresh page to show updated data
                window.location.reload();
            } else {
                const error = await response.text();
                alert('❌ Failed to update profile: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Something went wrong: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        // Validate inputs
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

        setIsSaving(true);
        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (response.ok) {
                alert('✅ Password changed successfully!');
                setIsChangingPassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const error = await response.text();
                alert('❌ ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Something went wrong: ' + error.message);
        } finally {
            setIsSaving(false);
        }
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
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    ) : (
                        <p>{data.name || 'Loading...'}</p>
                    )}
                </div>
                
                <div className={styles.profileDetail}>
                    <label>Email</label>
                    <p>{data.email || 'Loading...'}</p>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Email cannot be changed</span>
                </div>
                
                <div className={styles.profileDetail}>
                    <label>Phone Number</label>
                    {isEditing ? (
                        <input 
                            type="tel" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    ) : (
                        <p>{data.phoneNumber || 'Not provided'}</p>
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
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    ) : (
                        <p>{data.address || 'Not provided'}</p>
                    )}
                </div>
                
                {isEditing ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            className={styles.editButton} 
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                            className={styles.editButton} 
                            onClick={() => {
                                setIsEditing(false);
                                setName(data.name || '');
                                setPhoneNumber(data.phoneNumber || '');
                                setAddress(data.address || '');
                            }}
                            disabled={isSaving}
                            style={{ backgroundColor: '#6b7280' }}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Security & Access Card */}
            <div className={styles.settingsGroup}>
                <h4>Security & Access</h4>
                
                {!isChangingPassword ? (
                    <button 
                        className={styles.securityButton}
                        onClick={() => setIsChangingPassword(true)}
                    >
                        Change Password
                    </button>
                ) : (
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                Current Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        paddingRight: '3rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#6b7280'
                                    }}
                                >
                                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min 6 characters)"
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        paddingRight: '3rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#6b7280'
                                    }}
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                Confirm New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        paddingRight: '3rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#6b7280'
                                    }}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className={styles.editButton}
                                onClick={handleChangePassword}
                                disabled={isSaving}
                                style={{ backgroundColor: '#10b981' }}
                            >
                                {isSaving ? 'Changing...' : 'Update Password'}
                            </button>
                            <button 
                                className={styles.editButton}
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                                disabled={isSaving}
                                style={{ backgroundColor: '#6b7280' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
