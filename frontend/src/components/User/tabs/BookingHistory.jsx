import React from 'react';
import { Calendar } from 'lucide-react';
import styles from '../../../styles/UserDashboard.module.css';

export const BookingHistory = ({ data }) => (
    <div className={styles.historyMainContainer}>
        <h2 className={styles.profileHeader}>Booking History 🗓️</h2>
        <ul className={styles.fullHistoryList}>
            {[
                ...data.activeBookings.map(b => ({
                    id: b.id,
                    service: b.service,
                    date: b.time || 'N/A',
                    status: b.status,
                    statusClass: b.status === 'En Route' ? styles.statusIndigo : 
                                b.status === 'Accepted' ? styles.statusGreen : 
                                styles.statusYellow
                })),
                ...data.recentHistory.map(h => ({
                    id: h.id, 
                    service: h.title, 
                    date: h.date, 
                    status: 'Completed', 
                    statusClass: styles.statusGreen
                }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => (
                <li key={index} className={styles.fullHistoryItem}>
                    <div className={styles.historyIcon}>
                        <Calendar size={20} />
                    </div>
                    <div className={styles.historyInfo}>
                        <p className={styles.historyTitle}>{item.service}</p>
                        <p className={styles.historyDate}>{item.date}</p>
                    </div>
                    <span className={`${styles.statusBadge} ${item.statusClass}`}>
                        {item.status}
                    </span>
                    <button className={styles.detailsBtn}>Details</button>
                </li>
            ))}
        </ul>
    </div>
);