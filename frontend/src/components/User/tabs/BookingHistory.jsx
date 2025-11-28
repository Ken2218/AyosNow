import React from 'react';
import { Calendar, Clock, Star } from 'lucide-react';
import styles from '../../../styles/UserBookingHistory.module.css';

export const BookingHistory = ({ data }) => {
    const allBookings = [
        ...data.activeBookings.map(b => ({
            id: b.id,
            service: b.service,
            provider: b.provider || 'Searching...',
            date: b.time || 'N/A',
            status: b.status,
            rating: null,
            description: b.description || ''
        })),
        ...data.recentHistory.map(h => ({
            id: h.id,
            service: h.title,
            provider: 'Service Pro',
            date: h.date,
            status: 'COMPLETED',
            rating: h.rating || null,
            description: ''
        }))
    ];
    
    const sortedBookings = allBookings.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
    
    const getStatusStyle = (status) => {
        switch(status) {
            case 'COMPLETED': return styles.statusGreen;
            case 'EN_ROUTE': return styles.statusIndigo;
            case 'ACCEPTED': return styles.statusBlue;
            case 'IN_PROGRESS': return styles.statusPurple;
            case 'PENDING': return styles.statusYellow;
            case 'CANCELLED': return styles.statusRed;
            default: return styles.statusGray;
        }
    };
    
    return (
        <div className={styles.historyMainContainer}>
            <h2 className={styles.profileHeader}>Booking History 📋</h2>
            
            {sortedBookings.length > 0 ? (
                <div className={styles.bookingsList}>
                    {sortedBookings.map((booking) => (
                        <div key={booking.id} className={styles.bookingCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h3 className={styles.serviceTitle}>{booking.service}</h3>
                                    <p className={styles.providerName}>Provider: <strong>{booking.provider}</strong></p>
                                </div>
                                <span className={`${styles.statusBadge} ${getStatusStyle(booking.status)}`}>
                                    {booking.status.replace('_', ' ')}
                                </span>
                            </div>
                            
                            <div className={styles.cardDetails}>
                                <div className={styles.detailItem}>
                                    <Clock size={16} className={styles.iconGray} />
                                    <span>{booking.date}</span>
                                </div>
                                {booking.rating && (
                                    <div className={styles.detailItem}>
                                        <Star size={16} className={styles.iconYellow} />
                                        <span>{booking.rating} / 5</span>
                                    </div>
                                )}
                            </div>
                            
                            {booking.description && (
                                <p className={styles.bookingDescription}>{booking.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <Calendar size={48} className={styles.emptyIcon} />
                    <p>No bookings found</p>
                    <p className={styles.emptyHint}>Your booking history will appear here</p>
                </div>
            )}
        </div>
    );
};
