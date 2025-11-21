import React, { useState } from 'react';
import styles from '../../styles/UserDashboard.css';

import { Home, Search, Calendar, User, Settings, LogOut } from 'lucide-react';

import DashboardHome from './DashboardHome';
import BookingFlow from './BookingFlow';
import BookingHistory from './BookingHistory';
import UserProfile from './UserProfile';
import UserSettings from './UserSettings';

import useFetchUserData from './hooks/useFetchUserData';

const UserDashboard = ({ setView, userName, setUser }) => {
    const [tab, setTab] = useState("HOME");

    const { userData, isLoading, error, setUserData } = useFetchUserData(userName);

    const updateActiveBookings = (booking) => {
        setUserData(prev => ({
            ...prev,
            activeBookings: [booking, ...prev.activeBookings],
        }));
    };

    const logout = () => {
        setUser(null);
        setView("LOGIN");
    };

    return (
        <div className={styles.wrapper}>
            <nav className={styles.sidebar}>
                <button onClick={() => setTab("HOME")}><Home /> Home</button>
                <button onClick={() => setTab("BOOKING")}><Search /> Find Pro</button>
                <button onClick={() => setTab("HISTORY")}><Calendar /> History</button>
                <button onClick={() => setTab("PROFILE")}><User /> Profile</button>
                <button onClick={() => setTab("SETTINGS")}><Settings /> Settings</button>
                <button onClick={logout}><LogOut /> Logout</button>
            </nav>

            <main className={styles.content}>
                {tab === "HOME" && (
                    <DashboardHome
                        data={userData}
                        handleSetTab={setTab}
                        isLoading={isLoading}
                    />
                )}

                {tab === "BOOKING" && (
                    <BookingFlow
                        handleSetTab={setTab}
                        updateActiveBookings={updateActiveBookings}
                    />
                )}

                {tab === "HISTORY" && <BookingHistory data={userData} />}
                {tab === "PROFILE" && <UserProfile data={userData} />}
                {tab === "SETTINGS" && <UserSettings />}
            </main>
        </div>
    );
};

export default UserDashboard;
