import React, { useState } from 'react';
import { LogOut, Settings, User, Wrench, Home, Bell, FileText } from 'lucide-react';
import styles from '../../styles/workerdashboard.module.css';
import { useFetchWorkerData } from './useFetchWorkerData';
import { WorkerHome } from './tabs/WorkerHome';
import { JobRequests } from './tabs/JobRequests';
import { WorkerProfile } from './tabs/WorkerProfile';
import { WorkerSettings } from './tabs/WorkerSettings';

const WorkerDashboard = ({ user, setView, setUser }) => {
    const [activeTab, setActiveTab] = useState('HOME');
    
    const { workerData, isLoading, error, setWorkerData } = useFetchWorkerData(user?.name, user?.id, user?.skill);

    const updateActiveJobs = (newJob) => {
        setWorkerData(prevData => ({
            ...prevData,
            activeJobs: [newJob, ...prevData.activeJobs],
            jobRequests: prevData.jobRequests.filter(j => j.id !== newJob.id)
        }));
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
                return <WorkerHome 
                    data={workerData} 
                    handleSetTab={setActiveTab} 
                    isLoading={isLoading}
                    updateActiveJobs={updateActiveJobs}
                    workerId={user?.id}
                />;
            case 'JOBS':
                return <JobRequests handleSetTab={setActiveTab} workerData={workerData} />;
            case 'PROFILE':
                return <WorkerProfile data={user} />;
            case 'SETTINGS':
                return <WorkerSettings />;
            default:
                return <WorkerHome 
                    data={workerData} 
                    handleSetTab={setActiveTab} 
                    isLoading={isLoading}
                    updateActiveJobs={updateActiveJobs}
                    workerId={user?.id}
                />;
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
                        <button 
                            className={activeTab === 'HOME' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => setActiveTab('HOME')}
                        >
                            <Home size={20} /> Home
                        </button>
                        <button 
                            className={activeTab === 'JOBS' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => setActiveTab('JOBS')}
                        >
                            <FileText size={20} /> My Jobs
                        </button>
                        <button 
                            className={activeTab === 'PROFILE' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => setActiveTab('PROFILE')}
                        >
                            <User size={20} /> Profile
                        </button>
                        <button 
                            className={activeTab === 'SETTINGS' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => setActiveTab('SETTINGS')}
                        >
                            <Settings size={20} /> Settings
                        </button>
                    </div>
                    <div className={styles.userActions}>
                        <button className={styles.iconButton} aria-label="Notifications">
                            <Bell size={20} />
                        </button>
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
