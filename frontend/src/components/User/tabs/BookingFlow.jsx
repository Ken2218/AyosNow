import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import styles from '../../../styles/UserBookingFlow.module.css';

// 1. MAP SKILLS TO DATABASE IDs (Must match SignupRole map)
const JOB_TYPE_MAP = {
  Plumbing: 1,
  Electrical: 2,
  Cleaning: 3,
  Landscaping: 4,
  'Appliance Repair': 5,
  Painting: 6,
};

export const BookingFlow = ({ handleSetTab, updateActiveBookings, userId, userData }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' }); // type: 'success' | 'error'

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000); // Auto-hide after 3 seconds
  };

  const handleSubmit = async () => {
    if (!selectedCategory || taskDescription.length < 10 || !selectedDateTime || !price) {
      showNotification('Please complete all fields, including price', 'error');
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      showNotification('Please enter a valid price greater than 0', 'error');
      return;
    }

    setIsSubmitting(true);

    const customerAddress = userData?.address || 'Address not provided';

    try {
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: userId,
          jobTypeId: JOB_TYPE_MAP[selectedCategory],
          description: taskDescription,
          scheduledTime: selectedDateTime + ':00',
          location: customerAddress,
          price: numericPrice,
        }),
      });

      if (response.ok) {
        const savedBooking = await response.json();
        console.log('Booking created:', savedBooking);

        const newBooking = {
          id: savedBooking.id,
          service: savedBooking.service,
          provider: savedBooking.workerName || 'Searching for worker...',
          status: savedBooking.status,
          phone: savedBooking.workerPhone,
          time: new Date(savedBooking.scheduledTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }),
          description: savedBooking.description,
          price: savedBooking.price ?? numericPrice,
        };

        updateActiveBookings(newBooking);
        showNotification('Booking created successfully!', 'success');
        // Delay switching to home tab until notification is shown
        setTimeout(() => handleSetTab('HOME'), 3000);
      } else {
        const error = await response.text();
        showNotification('Failed to create booking: ' + error, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Something went wrong', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.bookingFlowContainer}>
      {/* Styled Notification */}
      {notification.message && (
        <div className={`${styles.notification} ${notification.type === 'success' ? styles.success : styles.error}`}>
          {notification.message}
        </div>
      )}

      <h2 className={styles.profileHeader}>Schedule a New Service</h2>

      <div className={styles.bookingStepCard}>
        <h3>Select Service Category</h3>
        <div className={styles.categoryGrid}>
          {Object.keys(JOB_TYPE_MAP).map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryItem} ${
                selectedCategory === cat ? styles.selected : ''
              }`}
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
        <h3>Date, Time & Price</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <input
            type="datetime-local"
            className={styles.dateTimeInput}
            value={selectedDateTime}
            onChange={(e) => setSelectedDateTime(e.target.value)}
            min={getMinDateTime()}
          />
          <input
            type="number"
            min="0"
            step="50"
            className={styles.dateTimeInput}
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <p className={styles.helperText}>
          Set the expected date, time, and total price for this service.
        </p>
      </div>

      <button
        className={styles.proceedButton}
        onClick={handleSubmit}
        disabled={
          isSubmitting ||
          !selectedCategory ||
          taskDescription.length < 10 ||
          !selectedDateTime ||
          !price
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
