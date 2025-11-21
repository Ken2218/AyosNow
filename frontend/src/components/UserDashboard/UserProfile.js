import React from 'react';
import styles from '../../styles/UserProfile.css';

const UserProfile = ({ data }) => {
    return (
        <div className={styles.container}>
            <h2>My Profile</h2>

            <div className={styles.card}>
                <label>Name</label>
                <p>{data.name}</p>

                <label>Email</label>
                <p>{data.email}</p>

                <label>Address</label>
                <p>{data.address}</p>
            </div>
        </div>
    );
};

export default UserProfile;
