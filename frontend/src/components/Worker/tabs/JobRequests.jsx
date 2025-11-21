import React from 'react';
import { Briefcase } from 'lucide-react';
import styles from '../../../styles/workerdashboard.module.css';

export const JobRequests = ({ handleSetTab, workerData, updateActiveJobs }) => {
    // Simulated new job requests
    const newJobRequests = [
        { id: 401, title: 'Bathroom Sink Leak', category: 'Plumbing', client: 'Alice Johnson', date: '5:00 PM Today', location: '456 Oak Ave', price: '₱1,500' },
        { id: 402, title: 'Install Ceiling Fan', category: 'Electrical', client: 'Bob Williams', date: 'Tomorrow Morning', location: '789 Pine Ln', price: '₱2,500' },
        { id: 403, title: 'Clean A/C Unit', category: 'Cleaning/HVAC', client: 'Eve Davis', date: 'Mon, Dec 2', location: '101 Elm Blvd', price: '₱1,200' },
    ];

    const handleAcceptJob = (job) => {
        // --- API CALL TO ACCEPT JOB (WorkerJobController) ---
        // ... simulate successful API call ...

        const newActiveJob = {
            id: job.id, 
            title: job.title, 
            client: job.client, 
            time: job.date, 
            status: "Accepted", 
            color: styles.statusGreen,
            address: job.location,
        };
        
        updateActiveJobs(newActiveJob); 
        alert(`Job ${job.title} accepted! It is now in your Active Jobs list.`);
        handleSetTab('HOME'); 
    };

    return (
    <div className={styles.historyMainContainer}>
        <h2 className={styles.profileHeader}>New Job Requests 🔔</h2>

        <div className={styles.jobsList}>
            {newJobRequests.length > 0 ? (
                newJobRequests.map((job) => (
                    <div key={job.id} className={styles.fullHistoryItem}>
                        
                        {/* Icon */}
                        <div className={styles.historyIcon}>
                            <Briefcase size={20} />
                        </div>

                        {/* Text Info - Expanded with Flex: 1 in CSS */}
                        <div className={styles.historyInfo}>
                            <p className={styles.historyTitle}>
                                {job.title}
                                <span className={styles.categorySpan}> ({job.category})</span>
                            </p>
                            <p className={styles.historyDate}>
                                Client: {job.client} • Due: {job.date}
                            </p>
                        </div>

                        {/* Action Group - Keeps Price and Button together and right-aligned */}
                        <div className={styles.actionGroup}>
                            <span className={styles.statusBadge}>
                                {job.price}
                            </span>
                            <button 
                                className={styles.proceedButton} 
                                onClick={() => handleAcceptJob(job)}
                            >
                                Accept Job
                            </button>
                        </div>

                    </div>
                ))
            ) : (
                <div className={styles.emptyState}>
                    <p>No new job requests at the moment.</p>
                    <p className={styles.iconGray}>Check back later!</p>
                </div>
            )}
        </div>
    </div>
);
};
