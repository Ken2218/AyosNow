import React from 'react';
import { 
    ChevronRight, Clock, MapPin, Star, 
    Briefcase, Layers, Bell, Activity, DollarSign
} from 'lucide-react';
import styles from '../../../styles/workerdashboard.module.css';
import { LoadingSkeleton } from '../LoadingSkeleton';

export const WorkerHome = ({ data, handleSetTab, isLoading }) => (
    <>
        <section className={styles.heroSection}>
            <h2 className={styles.heroTitle}>
                Welcome back, **{data.name || 'Pro'}**! Ready for new jobs?
            </h2>
            <div className={styles.searchWrapper}>
                <Layers className={styles.searchIcon} size={20} />
                <input 
                    type="text" 
                    placeholder="Search active jobs or past clients..." 
                    className={styles.searchInput}
                />
                <button onClick={() => handleSetTab('JOBS')} className={styles.searchButton}>View Requests</button>
            </div>
        </section>

        {isLoading ? (
            <LoadingSkeleton />
        ) : (
            <div className={styles.gridContainer}>
                <div className={styles.leftColumn}>
                    <div className={styles.sectionHeader}>
                        <h3>Current & Upcoming Jobs ({data.activeJobs.length})</h3>
                        <button className={styles.viewAllLink} onClick={() => handleSetTab('JOBS')}>
                            View All <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className={styles.bookingsList}>
                        {data.activeJobs.length > 0 ? (
                            data.activeJobs.map((job) => (
                                <div key={job.id} className={styles.bookingCard}>
                                    <div className={styles.cardTop}>
                                        <div>
                                            <h4 className={styles.serviceTitle}>{job.title}</h4>
                                            <p className={styles.providerName}>Client: **{job.client}**</p>
                                        </div>
                                        <span className={`${styles.statusBadge} ${
                                            job.status === 'En Route' ? styles.statusIndigo : 
                                            job.status === 'Accepted' ? styles.statusGreen :
                                            styles.statusYellow
                                        }`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <div className={styles.divider}></div>
                                    <div className={styles.cardBottom}>
                                        <div className={styles.infoItem}>
                                            <Clock size={16} className={styles.iconGray} />
                                            <span>{job.time}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <MapPin size={16} className={styles.iconGray} />
                                            <span>{job.address.split(',')[0]}</span>
                                        </div>
                                        <button className={styles.detailsBtn} onClick={() => handleSetTab('JOBS')}>View Details</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <p>No **active or upcoming jobs** found.</p>
                                <p className={styles.iconGray}>Check the Job Requests tab for new opportunities.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.statsCard}>
                        {/* Dynamic Avatar: First letter of the name */}
                        <div className={styles.avatarCircle}>{data.name.charAt(0)}</div> 
                        <p className={styles.profileName}>{data.name}</p>
                        <p className={styles.memberStatus}>Specialty: **{data.skill}**</p>
                        
                        <div className={styles.statsGrid}>
                            {data.stats.map((stat, idx) => (
                                <div key={idx} className={styles.statItem}>
                                    <div className={styles.statTop}>
                                        {stat.icon}
                                        <span className={styles.statValue}>{stat.value}</span>
                                    </div>
                                    <span className={styles.statLabel}>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.historyCard}>
                        <div className={styles.cardHeaderSimple}>
                            <h3>Performance Summary</h3>
                        </div>
                        <ul className={styles.historyList}>
                            <li className={styles.historyItem}>
                                <div className={styles.historyIcon}><Star size={18} fill="#fcd34d" color="#fcd34d" /></div>
                                <div className={styles.historyInfo}>
                                    <p className={styles.historyTitle}>Overall Rating</p>
                                    <p className={styles.historyDate}>Based on 125 Reviews</p>
                                </div>
                                <div className={styles.ratingWrapper}>
                                    <span>{data.rating}</span>
                                    <Star size={14} fill="#fcd34d" color="#fcd34d" />
                                </div>
                            </li>
                            {data.recentJobs.map((item) => (
                                <li key={item.id} className={styles.historyItem}>
                                    <div className={styles.historyIcon}><Briefcase size={18} /></div>
                                    <div className={styles.historyInfo}>
                                        <p className={styles.historyTitle}>{item.title}</p>
                                        <p className={styles.historyDate}>{item.date}</p>
                                    </div>
                                    <div className={styles.ratingWrapper}>
                                        <span className={styles.statusGreen}>{item.status}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Primary CTA button */}
                    <button className={`${styles.primaryCta} ${styles.fullWidthCta}`} onClick={() => handleSetTab('JOBS')}>
                        <Bell size={20} />
                        View New Job Requests
                    </button>
                </div>
            </div>
        )}
    </>
);