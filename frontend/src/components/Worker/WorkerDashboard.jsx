    import React, { useState } from 'react';
    import { LogOut, Settings, User, Wrench, Home, Bell, FileText } from 'lucide-react';
    import styles from '../../styles/workerdashboard.module.css';
    import { useFetchWorkerData } from './useFetchWorkerData';
    import { WorkerHome } from './tabs/WorkerHome';
    import { JobRequests } from './tabs/JobRequests';
    import { WorkerProfile } from './tabs/WorkerProfile';

    // Reusable confirmation modal (same style as other modals)
    const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
        <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
        >
            <div className={styles.modalHeader}>
            <h3>{title}</h3>
            </div>
            <div className={styles.modalBody}>
            <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
                {message}
            </p>
            <div className={styles.modalActions}>
                <button
                className={styles.updateButton}
                onClick={onConfirm}
                >
                Yes, logout
                </button>
                <button
                className={styles.cancelButton}
                onClick={onCancel}
                >
                Cancel
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    };

    const WorkerDashboard = ({ user, setView, setUser, onLogout }) => {
    // Initialize activeTab from localStorage
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('workerActiveTab') || 'HOME';
    });

    const { workerData, isLoading, error, setWorkerData } = useFetchWorkerData(
        user?.name,
        user?.id,
        user?.skill
    );

    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    // activeTab and save to localStorage
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('workerActiveTab', tab);
    };

    const updateActiveJobs = (newJob) => {
        setWorkerData((prevData) => ({
        ...prevData,
        activeJobs: [newJob, ...prevData.activeJobs],
        jobRequests: prevData.jobRequests.filter((j) => j.id !== newJob.id),
        }));
    };

    // Actual logout logic
    const doLogout = () => {
        localStorage.removeItem('workerActiveTab');
        if (onLogout) {
        onLogout();
        } else {
        setView('LOGIN');
        setUser(null);
        }
    };

    const renderContent = () => {
        if (error) {
        return <div className={styles.errorState}>Error: {error}</div>;
        }

        switch (activeTab) {
        case 'HOME':
            return (
            <WorkerHome
                data={workerData}
                handleSetTab={handleTabChange}
                isLoading={isLoading}
                updateActiveJobs={updateActiveJobs}
                workerId={user?.id}
            />
            );
        case 'JOBS':
            return (
            <JobRequests
                handleSetTab={handleTabChange}
                workerData={workerData}
            />
            );
        case 'PROFILE':
            return <WorkerProfile data={user} />;
        default:
            return (
            <WorkerHome
                data={workerData}
                handleSetTab={handleTabChange}
                isLoading={isLoading}
                updateActiveJobs={updateActiveJobs}
                workerId={user?.id}
            />
            );
        }
    };

    return (
        <div className={styles.dashboardContainer}>
        {/* Logout confirmation modal */}
        <ConfirmModal
            isOpen={logoutModalOpen}
            title="Confirm Logout"
            message="Are you sure you want to logout from your worker account?"
            onConfirm={doLogout}
            onCancel={() => setLogoutModalOpen(false)}
        />

        <nav className={styles.navbar}>
            <div className={styles.navContent}>
            <div
                className={styles.logoSection}
                onClick={() => handleTabChange('HOME')}
            >
                <div className={styles.logoIcon}>
                <Wrench size={24} color="white" />
                </div>
                <h1 className={styles.appName}>AyosNow</h1>
            </div>
            <div className={styles.navLinks}>
                <button
                className={
                    activeTab === 'HOME' ? styles.navLinkActive : styles.navLink
                }
                onClick={() => handleTabChange('HOME')}
                >
                <Home size={20} /> Home
                </button>
                <button
                className={
                    activeTab === 'JOBS' ? styles.navLinkActive : styles.navLink
                }
                onClick={() => handleTabChange('JOBS')}
                >
                <FileText size={20} /> My Jobs
                </button>

                <button
                className={
                    activeTab === 'PROFILE' ? styles.navLinkActive : styles.navLink
                }
                onClick={() => handleTabChange('PROFILE')}
                >
                <User size={20} /> Profile
                </button>
            </div>
            <div className={styles.userActions}>
                <button onClick={() => setLogoutModalOpen(true)} className={styles.logoutButton}>
                    <LogOut size={18} />
                <span>Logout</span>
                </button>
            </div>
            </div>
        </nav>

        <main className={styles.mainContent}>{renderContent()}</main>
        </div>
    );
    };

    export default WorkerDashboard;
