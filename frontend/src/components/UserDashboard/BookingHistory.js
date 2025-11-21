import React from "react";
import styles from "../../styles/BookingHistory.css";
import { Calendar } from "lucide-react";

const BookingHistory = ({ data }) => {
    const entries = [
        ...data.activeBookings,
        ...data.recentHistory,
    ];

    return (
        <div className={styles.container}>
            <h2>Booking History</h2>

            <ul className={styles.list}>
                {entries.map((item) => (
                    <li key={item.id} className={styles.item}>
                        <Calendar size={20} />
                        <div>
                            <p>{item.service || item.title}</p>
                            <span>{item.date}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookingHistory;
