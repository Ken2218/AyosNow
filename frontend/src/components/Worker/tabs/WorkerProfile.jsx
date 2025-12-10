import React from 'react';
import styles from '../../../styles/workerdashboard.module.css';

export const WorkerProfile = ({ data }) => (
    <div className={styles.profileContainer}>
        <h2 className={styles.profileHeader}>My Professional Profile 💼</h2>
        <div className={styles.profileCard}>
            <div className={styles.profileDetail}>
                <label>Full Name</label>
                <p>{data?.name || 'Loading...'}</p>
            </div>
            <div className={styles.profileDetail}>
                <label>Professional Title / Skill</label>
                <p><strong>{data?.skill || 'Loading...'}</strong></p>
            </div>
            <div className={styles.profileDetail}>
                <label>Primary Service Area</label>
                <p>{data?.location || 'Loading...'}</p>
            </div>
            <div className={styles.profileDetail}>
                <label>Email</label>
                <p>{data?.email || 'Loading...'}</p>
            </div>
            <button className={styles.editButton}>Edit Profile Details</button>
        </div>

            <div className={styles.settingsGroup}>
            <h4>Account Settings</h4>
            <button className={styles.securityButton}>Change Password</button>
            </div>
    </div>
);

