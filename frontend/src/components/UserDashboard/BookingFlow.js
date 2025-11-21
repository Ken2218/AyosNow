import React, { useState } from 'react';
import styles from '../../styles/BookingFlow.css';

const BookingFlow = ({ handleSetTab, updateActiveBookings }) => {
    const [category, setCategory] = useState(null);
    const [description, setDescription] = useState('');

    const submit = () => {
        if (!category || description.length < 10) {
            return alert("Please complete all fields.");
        }

        const newBooking = {
            id: Date.now(),
            service: category,
            status: "Pending",
            time: new Date().toLocaleString(),
            provider: "Searching..."
        };

        updateActiveBookings(newBooking);
        handleSetTab("HOME");
    };

    return (
        <div className={styles.container}>
            <h2>Book a Service</h2>

            <h3>Select Category</h3>
            <div className={styles.grid}>
                {["Plumbing", "Electrical", "Cleaning", "Painting"].map(item => (
                    <button
                        key={item}
                        onClick={() => setCategory(item)}
                        className={category === item ? styles.active : ""}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <textarea
                placeholder="Describe the problem..."
                value={description}
                onChange={e => setDescription(e.target.value)}
            />

            <button className={styles.submit} onClick={submit}>
                Submit Booking
            </button>
        </div>
    );
};

export default BookingFlow;
