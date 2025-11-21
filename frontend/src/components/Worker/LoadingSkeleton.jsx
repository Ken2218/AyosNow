import React from 'react';
import { Loader } from 'lucide-react';
import styles from '../../styles/workerdashboard.module.css';

export const LoadingSkeleton = () => (
    <div className={styles.loadingContainer}>
        <Loader size={48} className={styles.spinner} />
        <p className={styles.loadingText}>Loading your professional dashboard...</p>
    </div>
);