import React from 'react';
import styles from '../../styles/DashboardHome.css';
import { Search, Wrench } from 'lucide-react';

const DashboardHome = ({ data, isLoading, handleSetTab }) => {
    return (
        <div className={styles.container}>
            <h2>Hello, {data.name} 👋</h2>

            <div className={styles.searchBar}>
                <Search size={18} />
                <input placeholder="What do you need fixed?" />
                <button onClick={() => handleSetTab("BOOKING")}>Find Pro</button>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h3>Active Bookings</h3>
                    {data.activeBookings.length === 0 ? (
                        <p>No active bookings</p>
                    ) : (
                        data.activeBookings.map(b => (
                            <div className={styles.card} key={b.id}>
                                <h4>{b.service}</h4>
                                <p>Status: {b.status}</p>
                            </div>
                        ))
                    )}
                </>
            )}

            <button className={styles.cta} onClick={() => handleSetTab("BOOKING")}>
                <Wrench /> Schedule Service
            </button>
        </div>
    );
};

export default DashboardHome;
