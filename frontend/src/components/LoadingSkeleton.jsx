import React from 'react';
import styles from '../styles/UserDashboard.module.css';

export const LoadingSkeleton = () => (
    <div className={styles.gridContainer}>
        <div className={styles.leftColumn}>
            <div className={styles.skeletonCard}></div>
            <div className={styles.skeletonCard}></div>
        </div>
    </div>
);
