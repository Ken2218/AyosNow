import React, { useState, useEffect } from 'react';
import { 
    LogOut, Search, Settings, User, Wrench, Home, Bell, 
    ChevronRight, Calendar, Clock, MapPin, Star, ListOrdered, DollarSign, Briefcase, FileText, Activity, Layers, Loader
} from 'lucide-react';

// NOTE: We import the UserDashboard styles to reuse the theme
import styles from '../styles/UserDashboard.module.css'; 

// --- Custom Hook for Worker Data Fetching (Adapted from User Hook) ---
const useFetchWorkerData = (initialWorkerName) => {
    const [workerData, setWorkerData] = useState({ 
        name: initialWorkerName || 'AyosNow Pro', 
        stats: [], 
        activeJobs: [], 
        recentJobs: [],
        rating: 4.5,
        skill: 'Loading Skill...',
        location: 'Loading Location...',
        email: 'Loading Email...'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulated Fetching of all worker dashboard data
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        const simulateFetch = setTimeout(() => {
            try {
                // *** SIMULATED DYNAMIC WORKER DATA ***
                const fetchedData = {
                    id: 201,
                    name: initialWorkerName || "Pro Account", 
                    email: initialWorkerName ? initialWorkerName.toLowerCase().replace(/\s/g, '.') + "@ayosnow.pro" : "pro@ayosnow.pro",
                    phone: "(555) 555-1111",
                    location: "Central District, City", 
                    skill: "Certified Plumber", 
                    rating: 4.9, 
                    
                    stats: [ // Dynamic Worker Stats
                        { label: "Active Jobs", value: 1, icon: <Activity size={16} /> }, 
                        { label: "Jobs Completed (30d)", value: 12, icon: <Briefcase size={16} /> },
                        { label: "Avg. Rating", value: 4.9, icon: <Star size={16} fill="#fcd34d" color="#fcd34d" /> }, 
                        { label: "Monthly Earnings", value: "₱15K", icon: <DollarSign size={16} /> }, 
                    ],
                    activeJobs: [ // Currently accepted jobs
                        { 
                            id: 301, 
                            title: "Leaky Faucet Repair", 
                            client: "John Smith", 
                            time: "Today, 4:00 PM", 
                            status: 'En Route', 
                            color: styles.statusIndigo,
                            address: "123 Main St"
                        }
                    ], 
                    recentJobs: [ // Completed jobs
                        { id: 302, title: "Toilet Installation", date: "Nov 15, 2025", rating: 5, status: 'Completed', color: styles.statusGreen },
                        { id: 303, title: "Drain Unclogging", date: "Nov 10, 2025", rating: 4, status: 'Completed', color: styles.statusGreen },
                    ]
                };
                
                // Update active stats value based on the simulated data
                const activeCount = fetchedData.activeJobs.length;
                fetchedData.stats[0].value = activeCount;

                setWorkerData(fetchedData);

            } catch (err) {
                setError("Failed to load worker data: " + err.message);
            } finally {
                setIsLoading(false);
            }
        }, 1500); // 1.5 second loading delay

        return () => clearTimeout(simulateFetch); // Cleanup
    }, [initialWorkerName]);

    return { workerData, isLoading, error, setWorkerData };
};
// --- END Custom Hook ---


// --- Skeleton Component for Loading State (Reusing User Styles) ---
const LoadingSkeleton = () => (
    <div className={styles.loadingContainer}>
        <Loader size={48} className={styles.spinner} />
        <p className={styles.loadingText}>Loading your professional dashboard...</p>
    </div>
);


// --- Sub-Components for Tabbed Content (Worker Focused) ---

const WorkerHome = ({ data, handleSetTab, isLoading }) => (
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
                            <button className={styles.link} onClick={() => handleSetTab('PERFORMANCE')}>View Full Report</button>
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

const JobRequests = ({ handleSetTab, workerData, updateActiveJobs }) => {
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
                            <div className={styles.historyIcon}><Briefcase size={20} /></div>
                            <div className={styles.historyInfo}>
                                <p className={styles.historyTitle}>**{job.title}** ({job.category})</p>
                                <p className={styles.historyDate}>Client: {job.client} | Due: {job.date}</p>
                            </div>
                            <span className={styles.statusBadge} style={{ backgroundColor: '#2563eb', color: 'white' }}>
                                {job.price}
                            </span>
                            <button 
                                className={styles.proceedButton} 
                                onClick={() => handleAcceptJob(job)}
                                style={{ padding: '8px 15px', fontSize: '14px', marginLeft: '10px' }}
                            >
                                Accept Job
                            </button>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <p>No new job requests at the moment.</p>
                        <p className={styles.iconGray}>Check back later!</p>
                    </div>
                )}
            </div>
            <p className={styles.iconGray} style={{ marginTop: '20px', textAlign: 'center' }}>
                You also have {workerData.activeJobs.length} active job(s) in your pipeline.
            </p>
        </div>
    );
};

// Reusing UserProfile styling for Worker Profile
const WorkerProfile = ({ data }) => (
    <div className={styles.profileContainer}>
        <h2 className={styles.profileHeader}>My Professional Profile 💼</h2>
        <div className={styles.profileCard}>
            <div className={styles.profileDetail}>
                <label>Full Name</label>
                <p>{data.name || 'Loading...'}</p>
            </div>
            <div className={styles.profileDetail}>
                <label>Professional Title / Skill</label>
                <p>**{data.skill || 'Loading...'}**</p>
            </div>
            <div className={styles.profileDetail}>
                <label>Primary Service Area</label>
                <p>{data.location || 'Loading...'}</p>
            </div>
            <div className={styles.profileDetail}>
                <label>Email</label>
                <p>{data.email || 'Loading...'}</p>
            </div>
            <button className={styles.editButton}>Edit Profile Details</button>
        </div>
        <div className={styles.membershipCard}>
            <h4>Performance Rating: **{data.rating}** Stars</h4>
            <p className={styles.statusDetail}>High rating ensures priority matching with premium clients.</p>
            <button className={styles.upgradeButton}>View Reviews</button>
        </div>
    </div>
);

// New component for Performance/Earnings, reusing existing styles
const PerformanceAndEarnings = ({ data }) => (
    <div className={styles.settingsContainer}>
        <h2 className={styles.profileHeader}>Performance & Earnings 📈</h2>
        <div className={styles.settingsGroup}>
            <h4>Financial Summary (Last 30 Days)</h4>
            <div className={styles.settingItem}>
                <p>Total Revenue</p>
                <p className={styles.statValue} style={{ color: styles.statusGreen }}>{data.stats.find(s => s.label === 'Monthly Earnings')?.value || 'N/A'}</p>
            </div>
            <div className={styles.settingItem}>
                <p>Jobs Completed</p>
                <p className={styles.statValue}>{data.stats.find(s => s.label === 'Jobs Completed (30d)')?.value || 'N/A'}</p>
            </div>
            <button className={styles.securityButton}>View Detailed Payouts</button>
        </div>
        <div className={styles.settingsGroup}>
            <h4>Performance Metrics</h4>
            <div className={styles.settingItem}>
                <p>Cancellation Rate</p>
                <p className={styles.statValue} style={{ color: '#ef4444' }}>1%</p>
            </div>
            <div className={styles.settingItem}>
                <p>Job Acceptance Rate</p>
                <p className={styles.statValue}>95%</p>
            </div>
            <button className={styles.securityButton}>View Client Feedback</button>
        </div>
    </div>
);

const WorkerSettings = () => (
    <div className={styles.settingsContainer}>
        <h2 className={styles.profileHeader}>Account Settings ⚙️</h2>
        <div className={styles.settingsGroup}>
            <h4>Service Preferences</h4>
            <div className={styles.settingItem}>
                <p>Service Radius (km)</p>
                <input type="number" defaultValue="10" min="1" max="50" className={styles.taskInput} style={{ width: '80px', textAlign: 'center' }} />
            </div>
            <div className={styles.settingItem}>
                <p>Auto-Accept Jobs (beta)</p>
                <input type="checkbox" />
            </div>
        </div>
        <div className={styles.settingsGroup}>
            <h4>Security & Access</h4>
            <button className={styles.securityButton}>Change Password</button>
            <button className={styles.securityButton}>Update Payout Method</button>
        </div>
    </div>
);


// --- Main WorkerDashboard Component ---

const WorkerDashboard = ({ setView, userName, user, setUser }) => {
    const [activeTab, setActiveTab] = useState('HOME');
    
    // Custom hook to handle loading and fetching worker data
    const { workerData, isLoading, error, setWorkerData } = useFetchWorkerData(userName || user?.name);

    const updateActiveJobs = (newJob) => {
        setWorkerData(prevData => {
            const newActiveJobs = [newJob, ...prevData.activeJobs];
            // Update the 'Active Jobs' stat value immediately
            const updatedStats = prevData.stats.map(stat => 
                stat.label === 'Active Jobs' ? { ...stat, value: newActiveJobs.length } : stat
            );

            return {
                ...prevData,
                activeJobs: newActiveJobs,
                stats: updatedStats
            };
        });
    };
    
    const handleLogout = () => {
        setView('LOGIN');
        setUser(null);
    };
    
    const renderContent = () => {
        if (error) {
            return <div className={styles.errorState}>Error: {error}</div>;
        }

        switch (activeTab) {
            case 'HOME':
                return <WorkerHome data={workerData} handleSetTab={setActiveTab} isLoading={isLoading} />;
            case 'JOBS':
                return <JobRequests handleSetTab={setActiveTab} workerData={workerData} updateActiveJobs={updateActiveJobs} />;
            case 'PROFILE':
                return <WorkerProfile data={workerData} />;
            case 'PERFORMANCE':
                return <PerformanceAndEarnings data={workerData} />;
            case 'SETTINGS':
                return <WorkerSettings />;
            default:
                return <WorkerHome data={workerData} handleSetTab={setActiveTab} isLoading={isLoading} />;
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                    <div className={styles.logoSection} onClick={() => setActiveTab('HOME')}>
                        <div className={styles.logoIcon}><Wrench size={24} color="white" /></div> 
                        <h1 className={styles.appName}>AyosNow Pro</h1>
                    </div>
                    <div className={styles.navLinks}>
                        <button className={activeTab === 'HOME' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('HOME')}><Home size={20} /> Home</button>
                        <button className={activeTab === 'JOBS' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('JOBS')}><FileText size={20} /> Job Requests</button>
                        <button className={activeTab === 'PERFORMANCE' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('PERFORMANCE')}><Activity size={20} /> Performance</button>
                        <button className={activeTab === 'PROFILE' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('PROFILE')}><User size={20} /> Profile</button>
                        <button className={activeTab === 'SETTINGS' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('SETTINGS')}><Settings size={20} /> Settings</button>
                    </div>
                    <div className={styles.userActions}>
                        <button className={styles.iconButton} aria-label="Notifications"><Bell size={20} /></button>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className={styles.mainContent}>
                {renderContent()}
            </main>
        </div>
    );
};

export default WorkerDashboard;