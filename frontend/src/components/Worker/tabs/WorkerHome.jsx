import React from 'react';
import { ChevronRight, Briefcase, Clock, MapPin } from 'lucide-react';
import styles from '../../../styles/workerdashboard.module.css';
import { LoadingSkeleton } from '../../LoadingSkeleton';

export const WorkerHome = ({ data, handleSetTab, isLoading, updateActiveJobs, workerId }) => {
    const newJobRequests = data.jobRequests || [];

    const handleAcceptJob = async (job) => {
        if (!window.confirm(`Accept job: ${job.title} from ${job.client}?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/bookings/${job.id}/accept`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workerId })
            });

            if (response.ok) {
                const updatedBooking = await response.json();
                console.log('Job accepted:', updatedBooking);
                
                const newActiveJob = {
                    id: updatedBooking.id,
                    title: updatedBooking.service,
                    client: updatedBooking.customerName,
                    time: new Date(updatedBooking.scheduledTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                    }),
                    status: "ACCEPTED",
                    color: styles.statusGreen,
                    address: updatedBooking.location,
                    description: updatedBooking.description
                };
                
                updateActiveJobs(newActiveJob);
                alert(`✅ Job "${job.title}" accepted successfully!`);
            } else {
                const errorText = await response.text();
                alert('❌ Failed to accept job: ' + errorText);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Something went wrong: ' + error.message);
        }
    };

    return (
        <>
            <section className={styles.heroSection}>
                <h2 className={styles.heroTitle}>
                    Welcome back, {data.name}! Ready for new jobs?
                </h2>
                <div className={styles.searchWrapper}>
                    <input 
                        type="text" 
                        placeholder="Search available jobs..." 
                        className={styles.searchInput}
                    />
                    <button onClick={() => handleSetTab('JOBS')} className={styles.searchButton}>
                        View My Jobs
                    </button>
                </div>
            </section>

            {isLoading ? (
                <LoadingSkeleton />
            ) : (
                <div className={styles.gridContainer}>
                    <div className={styles.leftColumn}>
                        <div className={styles.sectionHeader}>
                            <h3>Available Job Requests ({newJobRequests.length})</h3>
                            <button className={styles.viewAllLink} onClick={() => handleSetTab('JOBS')}>
                                View My Jobs <ChevronRight size={14} />
                            </button>
                        </div>

                        {newJobRequests.length > 0 ? (
                            <div className={styles.bookingsList}>
                                {newJobRequests.map((job) => (
                                    <div 
                                        key={job.id} 
                                        className={styles.bookingCard}
                                        style={{
                                            border: job.isMatchingSkill ? '2px solid #10b981' : undefined,
                                            backgroundColor: job.isMatchingSkill ? '#f0fdf4' : undefined
                                        }}
                                    >
                                        <div className={styles.cardHeader}>
                                            <div>
                                                <h3 className={styles.serviceTitle}>
                                                    {job.title}
                                                    {job.isMatchingSkill && (
                                                        <span style={{ 
                                                            marginLeft: '8px', 
                                                            color: '#10b981', 
                                                            fontSize: '0.875rem',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            ⭐ Matches Your Skill
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className={styles.providerName}>
                                                    Client: <strong>{job.client}</strong>
                                                </p>
                                            </div>
                                            <span className={styles.statusBadge}>
                                                {job.price}
                                            </span>
                                        </div>
                                        
                                        {job.description && (
                                            <p style={{ 
                                                color: '#6b7280', 
                                                fontSize: '0.875rem', 
                                                marginBottom: '1rem',
                                                fontStyle: 'italic'
                                            }}>
                                                "{job.description}"
                                            </p>
                                        )}
                                        
                                        <div className={styles.cardDetails}>
                                            <div className={styles.detailItem}>
                                                <Clock size={16} className={styles.iconGray} />
                                                <span>{job.date}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <MapPin size={16} className={styles.iconGray} />
                                                <span>{job.location}</span>
                                            </div>
                                        </div>

                                        <button 
                                            className={styles.acceptButton} 
                                            onClick={() => handleAcceptJob(job)}
                                        >
                                            Accept Job
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <Briefcase size={48} className={styles.emptyIcon} />
                                <p>No job requests available at the moment.</p>
                                <p className={styles.emptyHint}>New jobs will appear here when customers book services!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
