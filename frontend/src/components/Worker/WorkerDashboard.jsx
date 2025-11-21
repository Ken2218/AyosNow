import React, { useState } from 'react';
import { LogOut, Settings, User, Wrench, Home, Bell, FileText, Activity } from 'lucide-react';
import styles from '../../styles/workerdashboard.module.css';
import { useFetchWorkerData } from './useFetchWorkerData';
import { WorkerHome } from './tabs/WorkerHome';
import { JobRequests } from './tabs/JobRequests';
import { WorkerProfile } from './tabs/WorkerProfile';
import { WorkerSettings } from './tabs/WorkerSettings';

const WorkerDashboard = ({ setView, userName, user, setUser }) => {
    const [activeTab, setActiveTab] = useState('HOME');
    
    // Custom hook to handle loading and fetching worker data
    const { workerData, isLoading, error, setWorkerData } = useFetchWorkerData(userName || user?.name);

    const updateActiveJobs = (newJob) => {
        setWorkerData(prevData => {
            const newActiveJobs = [newJob, ...prevData.activeJobs];
            // Update the 'Active Jobs' stat value immediately
            const updatedStats = prevData.stats.map(stat => 
                stat.label === 'Active Jobs' ? { ...stat, value: newActiveJobs.length } : stat
            );

            return {
                ...prevData,
                activeJobs: newActiveJobs,
                stats: updatedStats
            };
        });
    };
    
    const handleLogout = () => {
        setView('LOGIN');
        setUser(null);
    };
    
    const renderContent = () => {
        if (error) {
            return <div className={styles.errorState}>Error: {error}</div>;
        }

        switch (activeTab) {
            case 'HOME':
                return <WorkerHome data={workerData} handleSetTab={setActiveTab} isLoading={isLoading} />;
            case 'JOBS':
                return <JobRequests handleSetTab={setActiveTab} workerData={workerData} updateActiveJobs={updateActiveJobs} />;
            case 'PROFILE':
                return <WorkerProfile data={workerData} />;
            case 'SETTINGS':
                return <WorkerSettings />;
            default:
                return <WorkerHome data={workerData} handleSetTab={setActiveTab} isLoading={isLoading} />;
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                    <div className={styles.logoSection} onClick={() => setActiveTab('HOME')}>
                        <div className={styles.logoIcon}><Wrench size={24} color="white" /></div> 
                        <h1 className={styles.appName}>AyosNow</h1>
                    </div>
                    <div className={styles.navLinks}>
                        <button className={activeTab === 'HOME' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('HOME')}><Home size={20} /> Home</button>
                        <button className={activeTab === 'JOBS' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('JOBS')}><FileText size={20} /> Job Requests</button>
                        <button className={activeTab === 'PROFILE' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('PROFILE')}><User size={20} /> Profile</button>
                        <button className={activeTab === 'SETTINGS' ? styles.navLinkActive : styles.navLink} onClick={() => setActiveTab('SETTINGS')}><Settings size={20} /> Settings</button>
                    </div>
                    <div className={styles.userActions}>
                        <button className={styles.iconButton} aria-label="Notifications"><Bell size={20} /></button>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className={styles.mainContent}>
                {renderContent()}
            </main>
        </div>
    );
};

export default WorkerDashboard;