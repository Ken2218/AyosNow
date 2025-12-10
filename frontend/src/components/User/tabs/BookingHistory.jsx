import React, { useState } from 'react';
import { Clock, Star } from 'lucide-react';
// Ensure this path matches where you placed the CSS file above
import styles from '../../../styles/UserBookingHistory.module.css';

export const BookingHistory = ({ data }) => {
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Combine and sort bookings
    const allBookings = [
        ...data.activeBookings.map(b => ({
            ...b,
            dateObj: new Date(b.time)
        })),
        ...data.recentHistory.map(h => ({
            ...h,
            service: h.title, // Normalize field name
            dateObj: new Date(h.date)
        }))
    ];
    
    const sortedBookings = allBookings.sort((a, b) => b.dateObj - a.dateObj);

    const getStatusStyle = (status) => {
        switch(status) {
            case 'COMPLETED': return styles.statusGreen;
            case 'CANCELLED': return styles.statusRed;
            case 'ACCEPTED': return styles.statusBlue;
            case 'IN_PROGRESS': return styles.statusPurple;
            case 'PENDING': return styles.statusYellow;
            default: return styles.statusGray;
        }
    };

    const handleOpenReview = (booking) => {
        setSelectedBooking(booking);
        setRating(5);
        setComment('');
        setIsModalOpen(true);
    };

    const handleSubmitReview = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: selectedBooking.id,
                    rating: rating,
                    comment: comment
                })
            });

            if (response.ok) {
                alert('Review submitted successfully! Thank you.');
                setIsModalOpen(false);
                window.location.reload(); // Refresh to show updated status
            } else {
                const error = await response.text();
                alert('Failed to submit review: ' + error);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setIsSubmitting(false);
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
                                    {booking.status.replace('_', ' ')}
                                </span>
                            </div>
                            
                            <div className={styles.cardDetails}>
                                <div className={styles.detailItem}>
                                    <Clock size={16} className={styles.iconGray} />
                                    <span>{booking.date || booking.time}</span>
                                </div>
                                {booking.rating ? (
                                    <div className={styles.detailItem}>
                                        <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                                        <span>{booking.rating} / 5</span>
                                    </div>
                                ) : (
                                    // ONLY show button if status is COMPLETED and NO RATING exists
                                    booking.status === 'COMPLETED' && (
                                        <button 
                                            className={styles.rateButton}
                                            onClick={() => handleOpenReview(booking)}
                                        >
                                            <Star size={14} /> Rate Service
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <p>No booking history yet</p>
                </div>
            )}

            {/* Review Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold' }}>Rate Service</h3>
                        <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
                            How was your {selectedBooking?.service} service with {selectedBooking?.provider}?
                        </p>
                        
                        {/* Star Selection */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', justifyContent: 'center' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star}
                                    size={32}
                                    fill={star <= rating ? "#fbbf24" : "none"}
                                    stroke={star <= rating ? "#fbbf24" : "#d1d5db"}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>

                        <textarea
                            placeholder="Write a comment (optional)..."
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '1.5rem' }}
                        />

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={handleSubmitReview}
                                disabled={isSubmitting}
                                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#e5e7eb', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

