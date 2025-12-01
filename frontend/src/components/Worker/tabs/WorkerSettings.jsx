import React from 'react';
import styles from '../../../styles/workerdashboard.module.css';

export const WorkerSettings = () => (
    <div className={styles.profileContainer}>
        <h2 className={styles.profileHeader}>Settings ⚙️</h2>
        <div className={styles.profileCard}>
            <div className={styles.settingsGroup}>
                <h4>Account Settings</h4>
                <button className={styles.securityButton}>Change Password</button>
                <button className={styles.securityButton}>Notification Preferences</button>
            </div>
            <div className={styles.settingsGroup}>
                <h4>Availability</h4>
                <button className={styles.securityButton}>Set Working Hours</button>
                <button className={styles.securityButton}>Vacation Mode</button>
            </div>
        </div>
    </div>
);
