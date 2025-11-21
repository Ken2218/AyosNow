import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import styles from '../../../styles/UserDashboard.module.css';

export const BookingFlow = ({ handleSetTab, updateActiveBookings }) => {
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
                {isSubmitting ? (
                    <Loader size={20} className={styles.spinnerWhite} />
                ) : (
                    'Proceed to Scheduling & Worker Search'
                )}
            </button>
        </div>
    );
};