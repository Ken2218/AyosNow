import React, { useState } from 'react';
import { RefreshCw, Clock, MapPin, Phone, Trash2, Calendar, User } from 'lucide-react';
import styles from '../../../styles/UserHome.module.css';
import { LoadingSkeleton } from '../../LoadingSkeleton';

    export const UserHome = ({ data, handleSetTab, isLoading, onDeleteBooking }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    const handleRefresh = () => {
        setIsRefreshing(true);
        window.location.reload();
    };

    const handleDelete = (bookingId) => {
        setBookingToDelete(bookingId);
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        if (bookingToDelete) {
        onDeleteBooking(bookingToDelete);
        }
        setShowConfirmModal(false);
        setBookingToDelete(null);
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setBookingToDelete(null);
    };

    const getStatusClass = (status) => {
        switch(status) {
        case 'COMPLETED': return styles.statusCompleted;
        case 'CANCELLED': return styles.statusCancelled;
        case 'EN_ROUTE': return styles.statusEnRoute;
        case 'ACCEPTED': return styles.statusAccepted;
        case 'IN_PROGRESS': return styles.statusInProgress;
        case 'PENDING': return styles.statusPending;
        default: return styles.statusPending;
        }
    };

    return (
        <>
        <section className={styles.heroSection}>
            <h2 className={styles.heroTitle}>Hello, {data.name}!</h2>
            <p className={styles.heroSubtitle}>Let's get things fixed and done right.</p>
        </section>

        {isLoading ? (
            <LoadingSkeleton />
        ) : (
            <>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                Your Bookings ({data.activeBookings.length})
                </h3>
                <button 
                className={styles.refreshButton}
                onClick={handleRefresh}
                disabled={isRefreshing}
                >
                <RefreshCw size={16} className={isRefreshing ? styles.spinning : ''} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {data.activeBookings.length > 0 ? (
                <div className={styles.bookingsGrid}>
                {data.activeBookings.map((booking) => (
                    <div key={booking.id} className={styles.bookingCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.serviceInfo}>
                        <h4>{booking.service}</h4>
                        <span className={styles.providerTag}>
                            <User size={14} />
                            <strong>{booking.provider}</strong>
                        </span>
                        </div>
                        <div className={styles.statusPriceWrapper}>
                        <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                        </span>
                        <span className={styles.bookingPrice}>
                            ₱{booking.price || '0'}
                        </span>
                        </div>
                    </div>

                    {booking.description && (
                        <p className={styles.description}>"{booking.description}"</p>
                    )}

                    <div className={styles.divider}></div>

                    <div className={styles.detailsSection}>
                        <div className={styles.detailRow}>
                        <Clock size={18} className={styles.detailIcon} />
                        <span className={styles.detailText}>
                            {booking.time || 'Time Not Set'}
                        </span>
                        </div>

                        <div className={styles.detailRow}>
                        <MapPin size={18} className={styles.detailIcon} />
                        <span className={styles.detailText}>
                            {booking.location || data.address || 'Location not set'}
                        </span>
                        </div>
                    </div>

                    {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
                        <div className={styles.actionButtons}>
                        <button 
                            className={styles.cancelButton}
                            onClick={() => handleDelete(booking.id)}
                        >
                            <Trash2 size={16} />
                            Cancel Booking
                        </button>
                        </div>
                    )}
                    </div>
                ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <Calendar size={40} color="#9ca3af" />
                </div>
                <p>No active bookings</p>
                <span className={styles.emptyHint}>
                    Ready to schedule your next service?
                </span>
                <button 
                    className={styles.ctaButton}
                    onClick={() => handleSetTab('BOOKING')}
                >
                    Book a Service
                </button>
                </div>
            )}
            </>
        )}

        {/* Popup Confirmation Modal */}
        {showConfirmModal && (
            <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h4>Confirm Cancellation</h4>
                <p>Are you sure you want to cancel this booking?</p>
                <div className={styles.modalActions}>
                <button className={styles.modalButton} onClick={confirmDelete}>
                    Yes, Cancel
                </button>
                <button className={styles.modalButton} onClick={cancelDelete}>
                    No, Keep
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    );
    };
