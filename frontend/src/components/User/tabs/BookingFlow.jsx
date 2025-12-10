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
  const [price, setPrice] = useState('');              // NEW: price state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = async () => {
    if (!selectedCategory || taskDescription.length < 10 || !selectedDateTime || !price) {
      alert('Please complete all fields, including price');
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      alert('Please enter a valid price greater than 0');
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
          price: numericPrice,                 // NEW: send price to backend
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
          time: new Date(savedBooking.scheduledTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }),
          description: savedBooking.description,
          price: savedBooking.price ?? numericPrice,   // NEW: keep price on frontend
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

        {/* Date & Time + Price side by side */}
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
            className={styles.dateTimeInput} // reuse same style for consistency
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

