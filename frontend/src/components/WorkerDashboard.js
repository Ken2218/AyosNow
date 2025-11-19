import React from 'react';
import styles from '../styles/workerdashboard.module.css';

// Dashboard Card Component
const DashboardCard = ({ title, children }) => (
  <div className={styles.card}>
    <h2 className={styles.cardTitle}>{title}</h2>
    {children}
  </div>
);

// Stat Pill Component
const StatPill = ({ label, value, color }) => (
  <div className={`${styles.statPill} ${color}`}>
    <p className={styles.statValue}>{value}</p>
    <p className={styles.statLabel}>{label}</p>
  </div>
);

// Job Item Component
const JobItem = ({ title, client, due, status, color }) => (
  <div className={`${styles.jobItem} ${color}`}>
    <div className={styles.jobHeader}>
      <p className={styles.jobTitle}>{title}</p>
      <span className={styles.jobStatus}>{status}</span>
    </div>
    <p className={styles.jobDetails}>Client: {client} | Due: {due}</p>
  </div>
);

const WorkerDashboard = ({ setView, setUser, user }) => {
  const handleLogout = () => {
    setView('LOGIN');
    setUser(null);
  };

  // Use actual user data or provide defaults
  const workerProfile = {
    name: user?.name || "Worker Name",
    role: user?.skill || "Skilled Worker",
    location: user?.location || "Location Not Set",
    status: "Available",
    rating: user?.rating || 0,
    // Mock data for stats - you can extend backend to provide these
    stats: [
      { label: "Jobs Completed", value: 0, color: styles.statBlue },
      { label: "5-Star Rating", value: user?.rating || 0, color: styles.statYellow },
      { label: "Active Requests", value: 0, color: styles.statGreen },
    ],
    // Skills based on profession
    skills: user?.skill ? [user.skill] : [],
    // Mock jobs - replace with actual job requests from backend later
    jobs: []
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>Professional Dashboard</h1>
            <p className={styles.headerSubtitle}>Manage your profile, performance, and job pipeline.</p>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <DashboardCard title="My Profile">
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>{workerProfile.name.charAt(0).toUpperCase()}</div>
              <div className={styles.profileInfo}>
                <h3 className={styles.name}>{workerProfile.name}</h3>
                <p className={styles.role}>{workerProfile.role}</p>
                <p className={styles.location}>{workerProfile.location}</p>
              </div>
              <div className={styles.statusWrapper}>
                <span className={`${styles.status} ${workerProfile.status === 'Available' ? styles.statusGreen : styles.statusRed}`}>
                  {workerProfile.status}
                </span>
              </div>
            </div>
            <button className={styles.updateButton}>Update Profile Settings</button>
          </DashboardCard>

          <div className={styles.statsGrid}>
            {workerProfile.stats.map((stat, idx) => <StatPill key={idx} {...stat} />)}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <DashboardCard title="My Service Tags">
            <p className={styles.cardSubtitle}>Use these tags to match with clients:</p>
            <div className={styles.skillGrid}>
              {workerProfile.skills.length > 0 ? (
                workerProfile.skills.map((skill, idx) => (
                  <span key={idx} className={styles.skillTag}>{skill}</span>
                ))
              ) : (
                <p style={{ color: '#666', fontSize: '14px' }}>No skills added yet</p>
              )}
            </div>
            <button className={styles.updateButton}>Update Tags</button>
          </DashboardCard>

          <DashboardCard title="Upcoming Job Pipeline">
            <div className={styles.jobsList}>
              {workerProfile.jobs.length > 0 ? (
                workerProfile.jobs.map(job => <JobItem key={job.id} {...job} />)
              ) : (
                <p style={{ color: '#666', fontSize: '14px', padding: '20px', textAlign: 'center' }}>
                  No job requests yet. Your requests will appear here.
                </p>
              )}
            </div>
            <button className={styles.viewAllButton}>View All Job Requests</button>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;