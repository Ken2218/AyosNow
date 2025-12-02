import React, { useState } from 'react';
import { Loader, MapPin } from 'lucide-react';
import styles from '../../../styles/UserBookingFlow.module.css';

export const BookingFlow = ({ handleSetTab, updateActiveBookings, userId, userData }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [location, setLocation] = useState('Enter location');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const handleSubmit = async () => {
        if (!selectedCategory || taskDescription.length < 10 || !selectedDateTime || !location || location === 'Enter location') {
            alert('Please complete all fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: userId,
                    service: selectedCategory,
                    description: taskDescription,
                    scheduledTime: selectedDateTime,
                    location: location,
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
                    description: savedBooking.description,
                    location: location
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

            {/* Step 1: Category */}
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

            {/* Step 2: Task Description */}
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

            {/* Step 3: Date/Time & Location */}
            <div className={styles.bookingStepCard}>
                <h3>Select Date & Time</h3>
                <input
                    type="datetime-local"
                    className={styles.dateTimeInput}
                    value={selectedDateTime}
                    onChange={(e) => setSelectedDateTime(e.target.value)}
                    min={getMinDateTime()}
                />

                <div className={styles.locationWrapper}>
                    <label className={styles.locationLabel}>
                        <MapPin size={16} /> Location
                    </label>
                    <input
                        type="text"
                        className={styles.locationInput}
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                className={styles.proceedButton}
                onClick={handleSubmit}
                disabled={
                    isSubmitting ||
                    !selectedCategory ||
                    taskDescription.length < 10 ||
                    !selectedDateTime ||
                    !location ||
                    location === 'Enter location'
                }
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
