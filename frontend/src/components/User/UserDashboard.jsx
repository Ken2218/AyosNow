import React, { useState } from 'react';
import { LogOut, User, Wrench, Home, Bell, Search, Calendar } from 'lucide-react';
import styles from '../../styles/UserDashboard.module.css';
import { useFetchUserData } from './useFetchUserData';
import { UserHome } from './tabs/UserHome';
import { BookingFlow } from './tabs/BookingFlow';
import { UserProfile } from './tabs/UserProfile';
import { BookingHistory } from './tabs/BookingHistory';

const UserDashboard = ({ user, setView, setUser }) => {
    const [activeTab, setActiveTab] = useState('HOME');
    
    // Pass entire user object - it contains name, email, phoneNumber from signup/login
    const { userData, isLoading, error, setUserData } = useFetchUserData(user);

    const updateActiveBookings = (newBooking) => {
        setUserData(prevData => ({
            ...prevData,
            activeBookings: [newBooking, ...prevData.activeBookings]
        }));
    };

    const deleteBooking = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setUserData(prevData => ({
                    ...prevData,
                    activeBookings: prevData.activeBookings.filter(b => b.id !== bookingId)
                }));
                alert('Booking cancelled successfully!');
            } else {
                alert('Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to cancel booking');
        }
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
                return <UserHome 
                    data={userData} 
                    handleSetTab={setActiveTab} 
                    isLoading={isLoading} 
                    onDeleteBooking={deleteBooking} 
                />;
            case 'BOOKING':
                return <BookingFlow 
                    handleSetTab={setActiveTab} 
                    updateActiveBookings={updateActiveBookings} 
                    userId={user?.id}
                    userData={userData}
                />;
            case 'HISTORY':
                return <BookingHistory data={userData} />;
            case 'PROFILE':
                return <UserProfile data={{ ...userData, id: user?.id }} />;
            default:
                return <UserHome 
                    data={userData} 
                    handleSetTab={setActiveTab} 
                    isLoading={isLoading} 
                    onDeleteBooking={deleteBooking} 
                />;
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                    <div className={styles.logoSection} onClick={() => setActiveTab('HOME')}>
                        <div className={styles.logoIcon}><Wrench size={24} color="white" /></div> 
                        <h1 className={styles.appName}>AyosNow</h1>
                    </div>
                    <div className={styles.navLinks}>
                        <button 
                            className={activeTab === 'HOME' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => setActiveTab('HOME')}
                        >
                            <Home size={20} /> Home
                        </button>
                        <button 
                            className={activeTab === 'BOOKING' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => setActiveTab('BOOKING')}
                        >
                            <Search size={20} /> Find Pro
                        </button>
                        <button 
                            className={activeTab === 'HISTORY' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => setActiveTab('HISTORY')}
                        >
                            <Calendar size={20} /> Bookings
                        </button>
                        <button 
                            className={activeTab === 'PROFILE' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => setActiveTab('PROFILE')}
                        >
                            <User size={20} /> Profile
                        </button>
                    </div>
                    <div className={styles.userActions}>
                        <button className={styles.iconButton} aria-label="Notifications">
                            <Bell size={20} />
                        </button>
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
