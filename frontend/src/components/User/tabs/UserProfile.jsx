import React, { useState } from 'react';
import styles from '../../../styles/UserDashboard.module.css';

export const UserProfile = ({ data }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(data.name || '');
    const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || '');
    const [address, setAddress] = useState(data.address || '');

    const handleSave = () => {
        // TODO: Add API call to save profile
        alert('Profile update feature coming soon!');
        setIsEditing(false);
    };

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.profileHeader}>My Profile 👤</h2>
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
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    ) : (
                        <p>{data.address || 'Loading...'}</p>
                    )}
                </div>
                
                {isEditing ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className={styles.editButton} onClick={handleSave}>
                            Save Changes
                        </button>
                        <button 
                            className={styles.editButton} 
                            onClick={() => setIsEditing(false)}
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
            <div className={styles.settingsGroup}>
                <h4>Security & Access</h4>
                <button className={styles.securityButton}>Change Password</button>
            </div>
        </div>
    );
};
