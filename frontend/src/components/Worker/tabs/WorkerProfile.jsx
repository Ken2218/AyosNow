import React from 'react';
import styles from '../../../styles/workerdashboard.module.css';

export const WorkerProfile = ({ data }) => (
    <div className={styles.profileContainer}>
        <h2 className={styles.profileHeader}>My Professional Profile</h2>
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
        <div className={styles.membershipCard}>
            <h4>Performance Rating: <strong>{data?.rating || 4.5}</strong> Stars</h4>
            <p className={styles.statusDetail}>High rating ensures priority matching with premium clients.</p>
            <button className={styles.upgradeButton}>View Reviews</button>
        </div>
    </div>
);
