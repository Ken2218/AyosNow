import React from 'react';
import { Search, ChevronRight, Clock, MapPin, Star, Calendar, Wrench, ListOrdered } from 'lucide-react';
import styles from '../../../styles/UserDashboard.module.css';
import { LoadingSkeleton } from '../LoadingSkeleton';

export const UserHome = ({ data, handleSetTab, isLoading }) => (
    <>
        <section className={styles.heroSection}>
            <h2 className={styles.heroTitle}>
                Hello, **{data.name || 'Customer'}**! Let's get things fixed.
            </h2>
            <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input 
                    type="text" 
                    placeholder="What needs fixing? Try 'Leaky faucet', 'Electrician'..." 
                    className={styles.searchInput}
                />
                <button onClick={() => handleSetTab('BOOKING')} className={styles.searchButton}>Find Pro</button>
            </div>
        </section>

        {isLoading ? (
            <LoadingSkeleton />
        ) : (
            <div className={styles.gridContainer}>
                <div className={styles.leftColumn}>
                    <div className={styles.sectionHeader}>
                        <h3>Current & Upcoming Bookings ({data.activeBookings.length})</h3>
                        <button className={styles.viewAllLink} onClick={() => handleSetTab('HISTORY')}>
                            View All <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className={styles.bookingsList}>
                        {data.activeBookings.length > 0 ? (
                            data.activeBookings.map((booking) => (
                                <div key={booking.id} className={styles.bookingCard}>
                                    <div className={styles.cardTop}>
                                        <div>
                                            <h4 className={styles.serviceTitle}>{booking.service}</h4>
                                            <p className={styles.providerName}>Provider: **{booking.provider}**</p>
                                        </div>
                                        <span className={`${styles.statusBadge} ${
                                            booking.status === 'En Route' ? styles.statusIndigo : 
                                            booking.status === 'Accepted' ? styles.statusGreen :
                                            styles.statusYellow
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className={styles.divider}></div>
                                    <div className={styles.cardBottom}>
                                        <div className={styles.infoItem}>
                                            <Clock size={16} className={styles.iconGray} />
                                            <span>{booking.time || 'Time Not Set'}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <MapPin size={16} className={styles.iconGray} />
                                            <span>{data.address.split(',')[0]}</span>
                                        </div>
                                        <button className={styles.detailsBtn}>Track Pro</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <p>No **active or upcoming bookings** found.</p>
                                <p className={styles.iconGray}>Ready to schedule your next service?</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.statsCard}>
                        {/* Dynamic Avatar: First letter of the name */}
                        <div className={styles.avatarCircle}>{data.name.charAt(0)}</div> 
                        <p className={styles.profileName}>{data.name}</p>

                        
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
                            <h3>Past Bookings (Recent)</h3>
                            <button className={styles.link} onClick={() => handleSetTab('HISTORY')}>View All</button>
                        </div>
                        <ul className={styles.historyList}>
                            {data.recentHistory.map((item) => (
                                <li key={item.id} className={styles.historyItem}>
                                    <div className={styles.historyIcon}><Calendar size={18} /></div>
                                    <div className={styles.historyInfo}>
                                        <p className={styles.historyTitle}>{item.title}</p>
                                        <p className={styles.historyDate}>{item.date}</p>
                                    </div>
                                    <div className={styles.ratingWrapper}>
                                        <span>{item.rating}</span>
                                        <Star size={14} fill="#fcd34d" color="#fcd34d" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Primary CTA button, ensuring it looks full-width and prominent */}
                    <button className={`${styles.primaryCta} ${styles.fullWidthCta}`} onClick={() => handleSetTab('BOOKING')}>
                        <Wrench size={20} />
                        Schedule a New Service Now
                    </button>
                </div>
            </div>
        )}
    </>
);
