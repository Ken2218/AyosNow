import React from 'react';
import styles from '../../../styles/workerdashboard.module.css';

export const WorkerSettings = () => (
    <div className={styles.settingsContainer}>
        <h2 className={styles.profileHeader}>Account Settings ⚙️</h2>
        <div className={styles.settingsGroup}>
            <h4>Security & Access</h4>
            <button className={styles.securityButton}>Change Password</button>
        </div>
    </div>
);