import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import styles from '../../../styles/UserBookingFlow.module.css';

export const BookingFlow = ({ handleSetTab, updateActiveBookings, userId, userData }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const handleSubmit = async () => {
        if (!selectedCategory || taskDescription.length < 10 || !selectedDateTime) {
            alert('Please complete all fields');
            return;
        }

        setIsSubmitting(true);

        const customerAddress = userData?.address || "Address not provided";

        try {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: userId,
                    service: selectedCategory,
                    description: taskDescription,
                    scheduledTime: selectedDateTime,
                    location: customerAddress,
                })
            });

            if (response.ok) {
                const savedBooking = await response.json();
                console.log('Booking created:', savedBooking);
                
                const newBooking = {
                    id: savedBooking.id,
                    service: savedBooking.service,
                    provider: savedBooking.workerName || "Searching for worker...",
                    status: savedBooking.status,
                    time: new Date(savedBooking.scheduledTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                    }),
                    description: savedBooking.description
                };

                updateActiveBookings(newBooking);
                alert('Booking created successfully!');
                handleSetTab('HOME');
            } else {
                const error = await response.text();
                alert('Failed to create booking: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.bookingFlowContainer}>
            <h2 className={styles.profileHeader}>Schedule a New Service</h2>

            <div className={styles.bookingStepCard}>
                <h3>Select Service Category</h3>
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
                <h3>Describe the Task</h3>
                <textarea
                    placeholder="Describe what needs to be done (minimum 10 characters)..."
                    rows="4"
                    className={styles.taskInput}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                />
            </div>

            <div className={styles.bookingStepCard}>
                <h3>Select Date & Time</h3>
                <input
                    type="datetime-local"
                    className={styles.dateTimeInput}
                    value={selectedDateTime}
                    onChange={(e) => setSelectedDateTime(e.target.value)}
                    min={getMinDateTime()}
                />
            </div>

            <button
                className={styles.proceedButton}
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedCategory || taskDescription.length < 10 || !selectedDateTime}
            >
                {isSubmitting ? (
                    <>
                        <Loader size={20} className={styles.spinnerWhite} />
                        Creating...
                    </>
                ) : (
                    'Create Booking'
                )}
            </button>
        </div>
    );
};
