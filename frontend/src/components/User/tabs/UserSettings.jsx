import React from 'react';
import styles from '../../../styles/UserDashboard.module.css';

export const UserSettings = () => (
    <div className={styles.settingsContainer}>
        <h2 className={styles.profileHeader}>Account Settings ⚙️</h2>
        <div className={styles.settingsGroup}>
            <h4>Notification Preferences</h4>
            <div className={styles.settingItem}>
                <p>Email Notifications for Job Updates</p>
                <input type="checkbox" defaultChecked />
            </div>
            <div className={styles.settingItem}>
                <p>SMS Alerts for Worker Arrival</p>
                <input type="checkbox" defaultChecked />
            </div>
        </div>
        <div className={styles.settingsGroup}>
            <h4>Security & Access</h4>
            <button className={styles.securityButton}>Change Password</button>
            <button className={styles.securityButton}>Manage Payment Methods</button>
        </div>
    </div>
);