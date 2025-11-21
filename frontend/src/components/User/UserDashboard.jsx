import React, { useState } from 'react';
import { LogOut, Settings, User, Wrench, Home, Bell, Search, Calendar } from 'lucide-react';
import styles from '../../styles/UserDashboard.module.css';
import { useFetchUserData } from './useFetchUserData';
import { UserHome } from './tabs/UserHome';
import { BookingFlow } from './tabs/BookingFlow';
import { UserProfile } from './tabs/UserProfile';
import { UserSettings } from './tabs/UserSettings';
import { BookingHistory } from './tabs/BookingHistory';

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
                return <UserHome data={userData} handleSetTab={setActiveTab} isLoading={isLoading} />;
            case 'BOOKING':
                return <BookingFlow handleSetTab={setActiveTab} updateActiveBookings={updateActiveBookings} />;
            case 'HISTORY':
                return <BookingHistory data={userData} />;
            case 'PROFILE':
                return <UserProfile data={userData} />;
            case 'SETTINGS':
                return <UserSettings />;
            default:
                return <UserHome data={userData} handleSetTab={setActiveTab} isLoading={isLoading} />;
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