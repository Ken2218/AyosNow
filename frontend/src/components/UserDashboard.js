import React, { useState, useEffect } from 'react';
import { 
    LogOut, Search, Settings, User, Wrench, Home, Bell, 
    ChevronRight, Calendar, Clock, MapPin, Star, ListOrdered, Loader
} from 'lucide-react';
import styles from '../styles/UserDashboard.module.css';

// --- Custom Hook for Data Fetching ---
const useFetchUserData = (initialUserName) => {
    const [userData, setUserData] = useState({ 
        name: initialUserName || 'AyosNow User', 
        stats: [], 
        activeBookings: [], 
        recentHistory: [],
        memberStatus: 'Bronze',
        address: 'Loading Address...',
        email: 'Loading Email...'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulated Fetching of all dashboard data
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        const simulateFetch = setTimeout(() => {
            try {
                // *** SIMULATED DYNAMIC DATA ***
                const fetchedData = {
                    id: 1,
                    name: initialUserName || "Customer Account", 
                    email: initialUserName ? initialUserName.toLowerCase().replace(/\s/g, '.') + "@ayosnow.com" : "default@ayosnow.com",
                    phone: "(555) 555-0000",
                    address: "123 Main Street, City", 
                    memberStatus: "Gold", 
                    
                    stats: [ // Dynamic Stats
                        { label: "Active", value: 0, icon: <Clock size={16} /> }, 
                        { label: "Total Jobs", value: 8, icon: <ListOrdered size={16} /> },
                        // Changed fill color to a proper hex for amber/gold consistent with the search button
                        { label: "Rating Avg.", value: 4.7, icon: <Star size={16} fill="#fcd34d" color="#fcd34d" /> }, 
                    ],
                    activeBookings: [], // Start empty
                    recentHistory: [ 
                        { id: 101, title: "Deep Cleaning", date: "Oct 25, 2024", rating: 5, status: 'Completed', color: styles.statusGreen },
                        { id: 102, title: "Wall Painting", date: "Sep 01, 2024", rating: 4, status: 'Completed', color: styles.statusGreen },
                    ]
                };
                
                // Update active stats value based on the simulated data
                const activeCount = fetchedData.activeBookings.length;
                fetchedData.stats[0].value = activeCount;

                setUserData(fetchedData);

            } catch (err) {
                setError("Failed to load user data: " + err.message);
            } finally {
                setIsLoading(false);
            }
        }, 1500); // 1.5 second loading delay for demonstration

        return () => clearTimeout(simulateFetch); // Cleanup
    }, [initialUserName]);

    return { userData, isLoading, error, setUserData };
};
// --- END Custom Hook ---

// --- Skeleton Component for Loading State ---
const LoadingSkeleton = () => (
    <div className={styles.loadingContainer}>
        <Loader size={48} className={styles.spinner} />
        <p className={styles.loadingText}>Loading your personalized dashboard...</p>
    </div>
);

// --- Sub-Components for Tabbed Content ---


const DashboardHome = ({ data, handleSetTab, isLoading }) => (
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
                        <p className={styles.memberStatus}>Status: **{data.memberStatus}**</p>
                        
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

const BookingFlow = ({ handleSetTab, updateActiveBookings }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [taskDescription, setTaskDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleProceed = async () => {
        if (!selectedCategory || taskDescription.length < 10) {
            alert('Please select a category and provide a detailed description (min 10 characters).');
            return;
        }

        setIsSubmitting(true);
        const bookingData = {
            serviceCategory: selectedCategory,
            taskDescription: taskDescription,
            preferredTime: new Date().toISOString(), 
        };

        try {
            // --- API CALL TO SPRING BOOT (UserBookingController) ---
            const response = await fetch('/api/user/bookings/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // IMPORTANT: Include your Authorization/JWT token here
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || `API Submission Failed: ${response.statusText}`);
            }

            const newBooking = await response.json();
            
            const newActiveBooking = {
                id: newBooking.id, 
                service: newBooking.serviceCategory, 
                provider: "Searching...", 
                status: "Pending", 
                time: new Date(newBooking.preferredTime).toLocaleString(), 
                color: styles.statusYellow 
            };
            
            updateActiveBookings(newActiveBooking); 
            
            alert(`Booking for ${newBooking.serviceCategory} submitted successfully! A worker will confirm soon.`);
            handleSetTab('HOME'); 

        } catch (error) {
            console.error('Booking Submission Error:', error);
            alert(`Failed to submit booking: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.bookingFlowContainer}>
            <h2 className={styles.profileHeader}>Schedule a New Service ✨</h2>
            
            <div className={styles.bookingStepCard}>
                <h3>Step 1: Select Service Category</h3>
                <div className={styles.categoryGrid}>
                    {['Plumbing', 'Electrical', 'Cleaning', 'Landscaping', 'Appliance Repair', 'Painting'].map(cat => (
                        <button 
                            key={cat}
                            className={`${styles.categoryItem} ${selectedCategory === cat ? styles.selected : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className={styles.bookingStepCard}>
                <h3>Step 2: Describe the Task</h3>
                <textarea 
                    placeholder="e.g., 'Leaky kitchen faucet needs replacement'..." 
                    rows="4" 
                    className={styles.taskInput}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                ></textarea>
            </div>
            
            <button 
                className={styles.proceedButton} 
                onClick={handleProceed}
                disabled={isSubmitting || !selectedCategory || taskDescription.length < 10} 
            >
                {isSubmitting ? <Loader size={20} className={styles.spinnerWhite} /> : 'Proceed to Scheduling & Worker Search'}
            </button>
        </div>
    );
};


const UserProfile = ({ data }) => (
    <div className={styles.profileContainer}>
        <h2 className={styles.profileHeader}>My Profile 👤</h2>
        <div className={styles.profileCard}>
            <div className={styles.profileDetail}>
                <label>Full Name</label>
                <p>{data.name || 'Loading...'}</p>
            </div>
            <div className={styles.profileDetail}>
                <label>Email</label>
                <p>{data.email || 'Loading...'}</p>
            </div>
            <div className={styles.profileDetail}>
                <label>Primary Address</label>
                <p>{data.address || 'Loading...'}</p>
            </div>
            <button className={styles.editButton}>Edit Profile</button>
        </div>
        <div className={styles.membershipCard}>
            <h4>Your **{data.memberStatus || 'Base'}** Status</h4>
            <p className={styles.statusDetail}>Enjoy priority scheduling and discounted service fees.</p>
            <button className={styles.upgradeButton}>Manage Membership</button>
        </div>
    </div>
);

const UserSettings = () => (
    <div className={styles.settingsContainer}>
        <h2 className={styles.profileHeader}>Account Settings ⚙️</h2>
        <div className={styles.settingsGroup}>
            <h4>Notification Preferences</h4>
            <div className={styles.settingItem}>
                <p>Email Notifications for Job Updates</p>
                <input type="checkbox" defaultChecked />
            </div>
            <div className={styles.settingItem}>
                <p>SMS Alerts for Worker Arrival</p>
                <input type="checkbox" defaultChecked />
            </div>
        </div>
        <div className={styles.settingsGroup}>
            <h4>Security & Access</h4>
            <button className={styles.securityButton}>Change Password</button>
            <button className={styles.securityButton}>Manage Payment Methods</button>
        </div>
    </div>
);

const BookingHistory = ({ data }) => (
    <div className={styles.historyMainContainer}>
        <h2 className={styles.profileHeader}>Booking History 🗓️</h2>
        <ul className={styles.fullHistoryList}>
            {[
                // Map Active Bookings
                ...data.activeBookings.map(b => ({
                    id: b.id,
                    service: b.service,
                    date: b.time || 'N/A',
                    status: b.status,
                    color: b.color 
                })),
                // Map Recent History
                ...data.recentHistory.map(h => ({
                    id: h.id, 
                    service: h.title, 
                    date: h.date, 
                    status: 'Completed', 
                    color: styles.statusGreen
                }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => (
                <li key={index} className={styles.fullHistoryItem}>
                    <div className={styles.historyIcon}><Calendar size={20} /></div>
                    <div className={styles.historyInfo}>
                        <p className={styles.historyTitle}>{item.service}</p>
                        <p className={styles.historyDate}>{item.date}</p>
                    </div>
                    <span className={`${styles.statusBadge} ${item.color}`}>
                        {item.status}
                    </span>
                    <button className={styles.detailsBtn}>Details</button>
                </li>
            ))}
        </ul>
    </div>
);


// --- Main UserDashboard Component ---

const UserDashboard = ({ setView, userName, setUser }) => {
    const [activeTab, setActiveTab] = useState('HOME');
    
    // Custom hook to handle loading and fetching
    const { userData, isLoading, error, setUserData } = useFetchUserData(userName);

    const updateActiveBookings = (newBooking) => {
        setUserData(prevData => {
            const newActiveBookings = [newBooking, ...prevData.activeBookings];
            // Update the 'Active' stat value immediately
            const updatedStats = prevData.stats.map(stat => 
                stat.label === 'Active' ? { ...stat, value: newActiveBookings.length } : stat
            );

            return {
                ...prevData,
                activeBookings: newActiveBookings,
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
                return <DashboardHome data={userData} handleSetTab={setActiveTab} isLoading={isLoading} />;
            case 'BOOKING':
                return <BookingFlow handleSetTab={setActiveTab} updateActiveBookings={updateActiveBookings} />;
            case 'HISTORY':
                return <BookingHistory data={userData} />;
            case 'PROFILE':
                return <UserProfile data={userData} />;
            case 'SETTINGS':
                return <UserSettings />;
            default:
                return <DashboardHome data={userData} handleSetTab={setActiveTab} isLoading={isLoading} />;
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                    <div className={styles.logoSection} onClick={() => setActiveTab('HOME')}>
                        {/* FIX: Set Wrench color to white for better contrast on indigo background */}
                        <div className={styles.logoIcon}><Wrench size={24} color="white" /></div> 
                        <h1 className={styles.appName}>AyosNow</h1>
                    </div>
                    <div className={styles.navLinks}>
                        <button className={activeTab === 'HOME' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('HOME')}><Home size={20} /> Home</button>
                        <button className={activeTab === 'BOOKING' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('BOOKING')}><Search size={20} /> Find Pro</button>
                        <button className={activeTab === 'HISTORY' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('HISTORY')}><Calendar size={20} /> Bookings</button>
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

export default UserDashboard;