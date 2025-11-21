import React from 'react';
import styles from '../../../styles/UserDashboard.module.css';

export const UserProfile = ({ data }) => (
    <div className={styles.profileContainer}>
        <h2 className={styles.profileHeader}>My Profile 👤</h2>
        <div className={styles.profileCard}>
            <div className={styles.profileDetail}>
                <label>Full Name</label>
                <p>{data.name || 'Loading...'}</p>
            </div>
            <div className={styles.profileDetail}>
                <label>Email</label>
                <p>{data.email || 'Loading...'}</p>
            </div>
            <div className={styles.profileDetail}>
                <label>Primary Address</label>
                <p>{data.address || 'Loading...'}</p>
            </div>
            <button className={styles.editButton}>Edit Profile</button>
        </div>
        <div className={styles.membershipCard}>
            <h4>Your **{data.memberStatus || 'Base'}** Status</h4>
            <p className={styles.statusDetail}>
                Enjoy priority scheduling and discounted service fees.
            </p>
            <button className={styles.upgradeButton}>Manage Membership</button>
        </div>
    </div>
);