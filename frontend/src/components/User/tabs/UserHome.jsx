import React, { useState } from 'react';
import { Search, ChevronRight, Clock, MapPin, Trash2, RefreshCw } from 'lucide-react';
import styles from '../../../styles/UserDashboard.module.css';
import { LoadingSkeleton } from '../../LoadingSkeleton';

export const UserHome = ({ data, handleSetTab, isLoading, onDeleteBooking }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        window.location.reload();
    };
    
    const handleDelete = (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            onDeleteBooking(bookingId);
        }
    };

    return (
        <>
            <section className={styles.heroSection}>
                <h2 className={styles.heroTitle}>
                    Hello, {data.name}! Let's get things fixed.
                </h2>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input 
                        type="text" 
                        placeholder="What needs fixing? Try 'Leaky faucet', 'Electrician'..." 
                        className={styles.searchInput}
                    />
                    <button onClick={() => handleSetTab('BOOKING')} className={styles.searchButton}>
                        Find Pro
                    </button>
                </div>
            </section>

            {isLoading ? (
                <LoadingSkeleton />
            ) : (
                <div className={styles.gridContainer}>
                    <div className={styles.leftColumn}>
                        <div className={styles.sectionHeader}>
                            <h3>Current Bookings ({data.activeBookings.length})</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    className={styles.viewAllLink} 
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    <RefreshCw size={14} className={isRefreshing ? 'spinning' : ''} />
                                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>
                        </div>
                        <div className={styles.bookingsList}>
                            {data.activeBookings.length > 0 ? (
                                data.activeBookings.map((booking) => (
                                    <div key={booking.id} className={styles.bookingCard}>
                                        <div className={styles.cardTop}>
                                            <div>
                                                <h4 className={styles.serviceTitle}>{booking.service}</h4>
                                                <p className={styles.providerName}>
                                                    Provider: <strong>{booking.provider}</strong>
                                                </p>
                                            </div>
                                            <span className={`${styles.statusBadge} ${
                                                booking.status === 'COMPLETED' ? styles.statusGreen :
                                                booking.status === 'CANCELLED' ? styles.statusRed :
                                                booking.status === 'EN_ROUTE' ? styles.statusIndigo : 
                                                booking.status === 'ACCEPTED' ? styles.statusBlue :
                                                booking.status === 'IN_PROGRESS' ? styles.statusPurple :
                                                styles.statusYellow
                                            }`}>
                                                {booking.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        {booking.description && (
                                            <p style={{ 
                                                color: '#6b7280', 
                                                fontSize: '0.875rem', 
                                                marginTop: '0.5rem',
                                                fontStyle: 'italic'
                                            }}>
                                                "{booking.description}"
                                            </p>
                                        )}

                                        <div className={styles.divider}></div>
                                        
                                        <div className={styles.cardBottom}>
                                            <div className={styles.infoItem}>
                                                <Clock size={16} className={styles.iconGray} />
                                                <span>{booking.time || 'Time Not Set'}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <MapPin size={16} className={styles.iconGray} />
                                                <span>{booking.location || data.address}</span>
                                            </div>
                                            {booking.status === 'PENDING' && (
                                                <button 
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(booking.id)}
                                                    title="Cancel booking"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Contact Info Section */}
                                        {data.phoneNumber && (
                                            <div style={{
                                                marginTop: '0.75rem',
                                                padding: '0.75rem',
                                                backgroundColor: '#f3f4f6',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}>
                                                <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    Contact: <strong style={{ color: '#1f2937' }}>{data.phoneNumber}</strong>
                                                </div>
                                            </div>
                                        )}

                                        {/* Show completion message */}
                                        {booking.status === 'COMPLETED' && (
                                            <div style={{
                                                marginTop: '1rem',
                                                padding: '0.75rem',
                                                backgroundColor: '#d1fae5',
                                                color: '#065f46',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}>
                                                ✅ Service Completed Successfully!
                                            </div>
                                        )}

                                        {booking.status === 'CANCELLED' && (
                                            <div style={{
                                                marginTop: '1rem',
                                                padding: '0.75rem',
                                                backgroundColor: '#fee2e2',
                                                color: '#991b1b',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}>
                                                ❌ Booking Cancelled
                                            </div>
                                        )}

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

                                        {booking.status === 'IN_PROGRESS' && (
                                            <div style={{
                                                marginTop: '1rem',
                                                padding: '0.75rem',
                                                backgroundColor: '#e9d5ff',
                                                color: '#6b21a8',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}>
                                                🔧 Work In Progress
                                            </div>
                                        )}

                                        {booking.status === 'EN_ROUTE' && (
                                            <div style={{
                                                marginTop: '1rem',
                                                padding: '0.75rem',
                                                backgroundColor: '#e0e7ff',
                                                color: '#3730a3',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}>
                                                🚗 Worker is on the way
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <p>No active or upcoming bookings found.</p>
                                    <p className={styles.iconGray}>Ready to schedule your next service?</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
