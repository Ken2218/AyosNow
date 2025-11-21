import React from 'react';
import styles from '../../styles/UserSettings.css';

const UserSettings = () => {
    return (
        <div className={styles.container}>
            <h2>Account Settings</h2>

            <div className={styles.card}>
                <button>Change Password</button>
                <button>Manage Notifications</button>
            </div>
        </div>
    );
};

export default UserSettings;
