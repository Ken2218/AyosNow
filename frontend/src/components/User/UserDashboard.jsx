    import React, { useState } from 'react';
    import { LogOut, User, Wrench, Home, Bell, Search, Calendar } from 'lucide-react';
    import styles from '../../styles/UserDashboard.module.css';
    import { useFetchUserData } from './useFetchUserData';
    import { UserHome } from './tabs/UserHome';
    import { BookingFlow } from './tabs/BookingFlow';
    import { UserProfile } from './tabs/UserProfile';
    import { BookingHistory } from './tabs/BookingHistory';

    const UserDashboard = ({ user, setView, setUser, onLogout }) => {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('userActiveTab') || 'HOME';
    });
    const [notification, setNotification] = useState({ message: '', type: '' }); // type: 'success' | 'error'
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { userData, isLoading, error, setUserData } = useFetchUserData(user);

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000); // Auto-hide after 3 seconds
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('userActiveTab', tab);
    };

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
            showNotification('Booking cancelled successfully!', 'success');
        } else {
            showNotification('Failed to cancel booking', 'error');
        }
        } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to cancel booking', 'error');
        }
    };

    const handleLogout = () => {
        setShowConfirmModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('userActiveTab');
        if (onLogout) {
        onLogout();
        } else {
        setView('LOGIN');
        setUser(null);
        }
        setShowConfirmModal(false);
    };

    const cancelLogout = () => {
        setShowConfirmModal(false);
    };

    const renderContent = () => {
        if (error) {
        return <div className={styles.errorState}>Error: {error}</div>;
        }

        switch (activeTab) {
        case 'HOME':
            return <UserHome 
            data={userData} 
            handleSetTab={handleTabChange} 
            isLoading={isLoading} 
            onDeleteBooking={deleteBooking} 
            />;
        case 'BOOKING':
            return <BookingFlow 
            handleSetTab={handleTabChange} 
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
            handleSetTab={handleTabChange} 
            isLoading={isLoading} 
            onDeleteBooking={deleteBooking} 
            />;
        }
    };

    return (
        <div className={styles.dashboardContainer}>
        {/* Styled Notification */}
        {notification.message && (
            <div className={`${styles.notification} ${notification.type === 'success' ? styles.success : styles.error}`}>
            {notification.message}
            </div>
        )}

        {/* Logout Confirmation Modal */}
        {showConfirmModal && (
            <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h4>Confirm Logout</h4>
                <p>Are you sure you want to logout?</p>
                <div className={styles.modalActions}>
                <button className={styles.modalButton} onClick={confirmLogout}>
                    Yes, Logout
                </button>
                <button className={styles.modalButton} onClick={cancelLogout}>
                    No, Stay
                </button>
                </div>
            </div>
            </div>
        )}

        <nav className={styles.navbar}>
            <div className={styles.navContent}>
            <div className={styles.logoSection} onClick={() => handleTabChange('HOME')}>
                <div className={styles.logoIcon}><Wrench size={24} color="white" /></div> 
                <h1 className={styles.appName}>AyosNow</h1>
            </div>
            <div className={styles.navLinks}>
                <button 
                className={activeTab === 'HOME' ? styles.navLinkActive : styles.navLink} 
                onClick={() => handleTabChange('HOME')}
                >
                <Home size={20} /> Home
                </button>
                <button 
                className={activeTab === 'BOOKING' ? styles.navLinkActive : styles.navLink} 
                onClick={() => handleTabChange('BOOKING')}
                >
                <Search size={20} /> Find Pro
                </button>
                <button 
                className={activeTab === 'HISTORY' ? styles.navLinkActive : styles.navLink} 
                onClick={() => handleTabChange('HISTORY')}
                >
                <Calendar size={20} /> Bookings
                </button>
                <button 
                className={activeTab === 'PROFILE' ? styles.navLinkActive : styles.navLink} 
                onClick={() => handleTabChange('PROFILE')}
                >
                <User size={20} /> Profile
                </button>
            </div>
            <div className={styles.userActions}>
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
        