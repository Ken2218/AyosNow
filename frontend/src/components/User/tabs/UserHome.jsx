import React, { useState } from 'react';
import { RefreshCw, Clock, MapPin, Phone, Trash2, Calendar } from 'lucide-react';
import styles from '../../../styles/UserHome.module.css';
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

  const getStatusMessage = (status) => {
    switch(status) {
      case 'COMPLETED':
        return { text: 'Service Completed Successfully!', class: styles.messageCompleted };
      case 'CANCELLED':
        return { text: 'Booking Cancelled', class: styles.messageCancelled };
      case 'ACCEPTED':
        return { text: 'Worker Accepted - Service In Progress', class: styles.messageAccepted };
      case 'IN_PROGRESS':
        return { text: 'Work In Progress', class: styles.messageInProgress };
      case 'EN_ROUTE':
        return { text: 'Worker is on the way', class: styles.messageEnRoute };
      default:
        return null;
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
              Your Bookings ({data.activeBookings?.length || 0})
            </h3>
            <div className={styles.headerActions}>
              <button 
                className={styles.refreshButton}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={isRefreshing ? styles.spinning : ''} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {data.activeBookings?.length > 0 ? (
            <div className={styles.bookingsGrid}>
              {data.activeBookings.map((booking) => {
                const statusMessage = getStatusMessage(booking.status);
                
                return (
                  <div key={booking.id} className={styles.bookingCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.serviceInfo}>
                        <h4>{booking.service}</h4>
                        <span className={styles.providerTag}>
                          <Calendar size={14} />
                          <strong>{booking.provider}</strong>
                        </span>
                      </div>
                      <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>

                    {booking.description && (
                      <p className={styles.description}>"{booking.description}"</p>
                    )}

                    <div className={styles.divider}></div>

                    <div className={styles.detailsSection}>
                      <div className={styles.detailRow}>
                        <div className={styles.detailIcon}>
                          <Clock size={18} />
                        </div>
                        <span className={styles.detailText}>
                          {booking.time || 'Time Not Set'}
                        </span>
                      </div>

                      <div className={styles.detailRow}>
                        <div className={styles.detailIcon}>
                          <MapPin size={18} />
                        </div>
                        <span className={styles.detailText}>
                          {booking.location || 'Location not set'}
                        </span>
                      </div>

                      {data.phoneNumber && (
                        <div className={styles.detailRow}>
                          <div className={styles.detailIcon}>
                            <Phone size={18} />
                          </div>
                          <span className={styles.detailText}>
                            {data.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {statusMessage && (
                      <div className={`${styles.statusMessage} ${statusMessage.class}`}>
                        {statusMessage.text}
                      </div>
                    )}

                    {booking.status === 'PENDING' && (
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
                );
              })}
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
    </>
  );
};
