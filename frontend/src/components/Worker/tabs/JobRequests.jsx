import React, { useState } from 'react';
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import styles from '../../../styles/workerdashboard.module.css';

export const JobRequests = ({ handleSetTab, workerData }) => {
    const [processingId, setProcessingId] = useState(null);

    const handleCompleteJob = async (job) => {
        if (!window.confirm(`Mark job "${job.title}" as COMPLETED?`)) {
            return;
        }

        setProcessingId(job.id);
        try {
            const response = await fetch(`http://localhost:8080/api/bookings/${job.id}/complete`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                alert('✅ Job marked as completed!');
                window.location.reload(); // Refresh to update the list
            } else {
                const error = await response.text();
                alert('❌ Failed to complete job: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error: ' + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleCancelJob = async (job) => {
        if (!window.confirm(`Cancel job "${job.title}"? This action cannot be undone.`)) {
            return;
        }

        setProcessingId(job.id);
        try {
            const response = await fetch(`http://localhost:8080/api/bookings/${job.id}/cancel`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                alert('✅ Job cancelled!');
                window.location.reload(); // Refresh to update the list
            } else {
                const error = await response.text();
                alert('❌ Failed to cancel job: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error: ' + error.message);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className={styles.historyMainContainer}>
            <h2 className={styles.profileHeader}>My Accepted Jobs</h2>

            <div className={styles.bookingsList}>
                {workerData.activeJobs.length > 0 ? (
                    workerData.activeJobs.map((job) => (
                        <div key={job.id} className={styles.bookingCard}>
                            <div className={styles.cardTop}>
                                <div>
                                    <h4 className={styles.serviceTitle}>{job.title}</h4>
                                    <p className={styles.providerName}>Client: <strong>{job.client}</strong></p>
                                </div>
                                <span className={`${styles.statusBadge} ${
                                    job.status === 'COMPLETED' ? styles.statusGreen :
                                    job.status === 'CANCELLED' ? styles.statusRed :
                                    styles.statusYellow
                                }`}>
                                    {job.status}
                                </span>
                            </div>

                            {job.description && (
                                <p style={{ 
                                    color: '#6b7280', 
                                    fontSize: '0.875rem', 
                                    marginTop: '0.5rem',
                                    fontStyle: 'italic'
                                }}>
                                    "{job.description}"
                                </p>
                            )}

                            <div className={styles.divider}></div>

                            <div className={styles.cardBottom}>
                                <div className={styles.infoItem}>
                                    <Clock size={16} className={styles.iconGray} />
                                    <span>{job.time}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <MapPin size={16} className={styles.iconGray} />
                                    <span>{job.address}</span>
                                </div>
                            </div>

                            {/* Action Buttons - Only show if job is ACCEPTED */}
                            {job.status === 'ACCEPTED' && (
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '0.5rem', 
                                    marginTop: '1rem' 
                                }}>
                                    <button
                                        className={styles.completeButton}
                                        onClick={() => handleCompleteJob(job)}
                                        disabled={processingId === job.id}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: processingId === job.id ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            opacity: processingId === job.id ? 0.6 : 1
                                        }}
                                    >
                                        <CheckCircle size={18} />
                                        {processingId === job.id ? 'Processing...' : 'Mark Complete'}
                                    </button>

                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => handleCancelJob(job)}
                                        disabled={processingId === job.id}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: processingId === job.id ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            opacity: processingId === job.id ? 0.6 : 1
                                        }}
                                    >
                                        <XCircle size={18} />
                                        {processingId === job.id ? 'Processing...' : 'Cancel Job'}
                                    </button>
                                </div>
                            )}

                            {/* Show completion message */}
                            {job.status === 'COMPLETED' && (
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
                                    ✅ Job Completed Successfully
                                </div>
                            )}

                            {job.status === 'CANCELLED' && (
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
                                    ❌ Job Cancelled
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <p>No accepted jobs yet.</p>
                        <p className={styles.iconGray}>Accept jobs from the home page!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
