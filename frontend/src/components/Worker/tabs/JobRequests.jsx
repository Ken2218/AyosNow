import React, { useState } from 'react';
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import styles from '../../../styles/JobRequests.module.css';

// Confirmation Modal
const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className={styles.modalTitle}>Confirm Action</h4>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.modalButtonYes}>
            Yes
          </button>
          <button onClick={onCancel} className={styles.modalButtonNo}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export const JobRequests = ({ handleSetTab, workerData }) => {
  const [processingId, setProcessingId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const showConfirmModal = (message, onConfirm, onCancel) => {
    setConfirmModal({ isOpen: true, message, onConfirm, onCancel });
  };

  const handleCompleteJob = async (job) => {
    showConfirmModal(
      `Mark job "${job.title}" as COMPLETED?`,
      async () => {
        setProcessingId(job.id);
        try {
          const response = await fetch(
            `http://localhost:8080/api/bookings/${job.id}/complete`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (response.ok) {
            showNotification('Job marked as completed!', 'success');
            window.location.reload();
          } else {
            const error = await response.text();
            showNotification('Failed to complete job: ' + error, 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          showNotification('Error: ' + error.message, 'error');
        } finally {
          setProcessingId(null);
          setConfirmModal({
            isOpen: false,
            message: '',
            onConfirm: null,
            onCancel: null,
          });
        }
      },
      () =>
        setConfirmModal({
          isOpen: false,
          message: '',
          onConfirm: null,
          onCancel: null,
        })
    );
  };

  const handleCancelJob = async (job) => {
    showConfirmModal(
      `Cancel job "${job.title}"? This action cannot be undone.`,
      async () => {
        setProcessingId(job.id);
        try {
          const response = await fetch(
            `http://localhost:8080/api/bookings/${job.id}/cancel`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (response.ok) {
            showNotification('Job cancelled!', 'success');
            window.location.reload();
          } else {
            const error = await response.text();
            showNotification('Failed to cancel job: ' + error, 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          showNotification('Error: ' + error.message, 'error');
        } finally {
          setProcessingId(null);
          setConfirmModal({
            isOpen: false,
            message: '',
            onConfirm: null,
            onCancel: null,
          });
        }
      },
      () =>
        setConfirmModal({
          isOpen: false,
          message: '',
          onConfirm: null,
          onCancel: null,
        })
    );
  };

  const renderStatusBadge = (status) => {
    let statusClass = styles.statusPillPending;
    let label = status;

    if (status === 'COMPLETED') {
      statusClass = styles.statusPillCompleted;
      label = 'Completed';
    } else if (status === 'CANCELLED') {
      statusClass = styles.statusPillCancelled;
      label = 'Cancelled';
    } else if (status === 'ACCEPTED') {
      statusClass = styles.statusPillAccepted;
      label = 'In progress';
    }

    return (
      <span className={`${styles.statusPill} ${statusClass}`}>
        <span className={styles.statusDot} />
        {label}
      </span>
    );
  };

  return (
    <div className={styles.historyMainContainer}>
      {notification.message && (
        <div
          className={`${styles.notification} ${
            notification.type === 'success' ? styles.success : styles.error
          }`}
        >
          {notification.message}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
        message={confirmModal.message}
      />

      <h2 className={styles.profileHeader}>My Accepted Jobs</h2>

      <div className={styles.bookingsList}>
        {workerData.activeJobs.length > 0 ? (
          workerData.activeJobs.map((job) => (
            <div key={job.id} className={styles.bookingCard}>
              <div className={styles.cardTop}>
                <div>
                  <h4 className={styles.serviceTitle}>{job.title}</h4>
                  <p className={styles.providerName}>
                    Client: <strong>{job.client}</strong>
                  </p>
                </div>
                {renderStatusBadge(job.status)}
              </div>

              {job.description && (
                <p className={styles.jobDescription}>
                  "{job.description}"
                </p>
              )}

              <div className={styles.divider}></div>

              <div className={styles.cardBottom}>
                <div className={styles.infoItem}>
                  <Clock size={16} className={styles.iconGray} />
                  <span>{job.time}</span>
                </div>
                <div className={styles.infoItem}>
                  <MapPin size={16} className={styles.iconGray} />
                  <span>{job.address}</span>
                </div>
              </div>

              {job.status === 'ACCEPTED' && (
                <div className={styles.actionsRow}>
                  <button
                    className={`${styles.actionButton} ${styles.completeAction}`}
                    onClick={() => handleCompleteJob(job)}
                    disabled={processingId === job.id}
                  >
                    <CheckCircle size={18} />
                    {processingId === job.id
                      ? 'Processing...'
                      : 'Mark as Complete'}
                  </button>

                  <button
                    className={`${styles.actionButton} ${styles.cancelAction}`}
                    onClick={() => handleCancelJob(job)}
                    disabled={processingId === job.id}
                  >
                    <XCircle size={18} />
                    {processingId === job.id ? 'Processing...' : 'Cancel Job'}
                  </button>
                </div>
              )}

              {job.status === 'COMPLETED' && (
                <div className={styles.infoBannerSuccess}>
                  Job completed successfully
                </div>
              )}

              {job.status === 'CANCELLED' && (
                <div className={styles.infoBannerDanger}>
                  Job has been cancelled
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No accepted jobs yet.</p>
            <p className={styles.iconGray}>
              Accept jobs from the home page!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
