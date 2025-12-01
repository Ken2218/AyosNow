import React from 'react';
import { ChevronRight, Briefcase, Clock, MapPin, Phone, User } from 'lucide-react';
import styles from '../../../styles/WorkerHome.module.css';
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
                console.log('✅ Job accepted:', updatedBooking);
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
            console.error('❌ Error:', error);
            alert('❌ Something went wrong: ' + error.message);
        }
    };

    return (
        <>
            <section className={styles.heroSection}>
                <h2 className={styles.heroTitle}>Welcome back, {data.name}!</h2>
                <p className={styles.heroSubtitle}>Ready to take on new jobs and grow your business?</p>
            </section>

            {isLoading ? (
                <LoadingSkeleton />
            ) : (
                <>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Available Job Requests ({newJobRequests.length})</h3>
                        <button 
                            className={styles.viewAllButton}
                            onClick={() => handleSetTab('JOBS')}
                        >
                            View My Jobs <ChevronRight size={16} />
                        </button>
                    </div>

                    {newJobRequests.length > 0 ? (
                        <div className={styles.jobsGrid}>
                            {newJobRequests.map((job) => (
                                <div 
                                    key={job.id} 
                                    className={`${styles.jobCard} ${job.isMatchingSkill ? styles.jobCardMatching : ''}`}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.jobInfo}>
                                            <h4>
                                                {job.title}
                                                {job.isMatchingSkill && (
                                                    <span className={styles.matchBadge}>
                                                        ⭐ Your Skill
                                                    </span>
                                                )}
                                            </h4>
                                            <span className={styles.clientTag}>
                                                <User size={14} />
                                                <strong>{job.client}</strong>
                                            </span>
                                        </div>
                                        <span className={styles.priceBadge}>
                                            {job.price}
                                        </span>
                                    </div>
                                    
                                    {job.description && (
                                        <p className={styles.description}>
                                            "{job.description}"
                                        </p>
                                    )}
                                    
                                    <div className={styles.divider}></div>

                                    <div className={styles.detailsSection}>
                                        <div className={styles.detailRow}>
                                            <div className={styles.detailIcon}>
                                                <Clock size={18} />
                                            </div>
                                            <span className={styles.detailText}>{job.date}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <div className={styles.detailIcon}>
                                                <MapPin size={18} />
                                            </div>
                                            <span className={styles.detailText}>
                                                {job.location || 'Location not specified'}
                                            </span>
                                        </div>
                                        {job.customerPhone && (
                                            <div className={styles.detailRow}>
                                                <div className={styles.detailIcon}>
                                                    <Phone size={18} />
                                                </div>
                                                <span className={styles.detailText}>
                                                    {job.customerPhone}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        className={styles.acceptButton} 
                                        onClick={() => handleAcceptJob(job)}
                                    >
                                        <Briefcase size={18} />
                                        Accept Job
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <Briefcase size={40} />
                            </div>
                            <p>No job requests available</p>
                            <span className={styles.emptyHint}>
                                New jobs will appear here when customers book services!
                            </span>
                        </div>
                    )}
                </>
            )}
        </>
    );
};
