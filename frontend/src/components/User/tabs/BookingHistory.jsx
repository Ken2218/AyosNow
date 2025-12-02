import React from 'react';
import { Calendar, Clock, Star, CheckCircle, XCircle, MapPin, Phone } from 'lucide-react';
import styles from '../../../styles/UserBookingHistory.module.css';

export const BookingHistory = ({ data }) => {
    const allBookings = [
        ...data.activeBookings.map(b => ({
            id: b.id,
            service: b.service,
            provider: b.provider || 'Searching for worker...',
            date: b.time || 'N/A',
            status: b.status,
            rating: null,
            description: b.description || '',
            location: b.location || 'Location not set'
        })),
        ...data.recentHistory.map(h => ({
            id: h.id,
            service: h.title,
            provider: h.provider || 'Service Completed',
            date: h.date,
            status: h.status || 'COMPLETED',
            rating: h.rating || null,
            description: '',
            location: h.location || 'Location not set'
        }))
    ];

    const sortedBookings = allBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

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

    const getStatusIcon = (status) => {
        switch(status) {
            case 'COMPLETED': return <CheckCircle size={18} />;
            case 'CANCELLED': return <XCircle size={18} />;
            default: return null;
        }
    };

    return (
        <div className={styles.historyMainContainer}>
            <h2 className={styles.profileHeader}>Booking History</h2>

            {sortedBookings.length > 0 ? (
                <div className={styles.bookingsList}>
                    {sortedBookings.map((booking) => (
                        <div key={booking.id} className={styles.bookingCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h3 className={styles.serviceTitle}>{booking.service}</h3>
                                    <p className={styles.providerName}>
                                        Worker: <strong>{booking.provider}</strong>
                                    </p>
                                </div>
                                <span className={`${styles.statusBadge} ${getStatusStyle(booking.status)}`}>
                                    {getStatusIcon(booking.status)}
                                    {booking.status.replace('_', ' ')}
                                </span>
                            </div>

                            {booking.description && (
                                <p className={styles.bookingDescription}>"{booking.description}"</p>
                            )}

                            <div className={styles.cardDetails}>
                                <div className={styles.detailItem}>
                                    <Clock size={16} className={styles.iconGray} />
                                    <span>{booking.date}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <MapPin size={16} className={styles.iconGray} />
                                    <span>{booking.location}</span>
                                </div>
                                {data.phoneNumber && (
                                    <div className={styles.detailItem}>
                                        <Phone size={16} className={styles.iconGray} />
                                        <span>{data.phoneNumber}</span>
                                    </div>
                                )}
                                {booking.rating && (
                                    <div className={styles.detailItem}>
                                        <Star size={16} className={styles.iconYellow} />
                                        <span>{booking.rating} / 5</span>
                                    </div>
                                )}
                            </div>

                            {booking.status === 'ACCEPTED' && (
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '0.75rem',
                                    backgroundColor: '#dbeafe',
                                    color: '#1e40af',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    textAlign: 'center'
                                }}>
                                    🔄 Worker Accepted - Service In Progress
                                </div>
                            )}

                            {booking.status === 'PENDING' && (
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '0.75rem',
                                    backgroundColor: '#fef3c7',
                                    color: '#92400e',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    textAlign: 'center'
                                }}>
                                    ⏳ Waiting for worker to accept
                                </div>
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
