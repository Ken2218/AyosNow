import React, { useState } from 'react';
import { LogOut, Settings, User, Wrench, Home, Bell, FileText } from 'lucide-react';
import styles from '../../styles/workerdashboard.module.css';
import { useFetchWorkerData } from './useFetchWorkerData';
import { WorkerHome } from './tabs/WorkerHome';
import { JobRequests } from './tabs/JobRequests';
import { WorkerProfile } from './tabs/WorkerProfile';


const WorkerDashboard = ({ user, setView, setUser, onLogout }) => {
    // ✅ Initialize activeTab from localStorage
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('workerActiveTab') || 'HOME';
    });
    
    const { workerData, isLoading, error, setWorkerData } = useFetchWorkerData(user?.name, user?.id, user?.skill);

    // ✅ Update activeTab and save to localStorage
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('workerActiveTab', tab);
    };

    const updateActiveJobs = (newJob) => {
        setWorkerData(prevData => ({
            ...prevData,
            activeJobs: [newJob, ...prevData.activeJobs],
            jobRequests: prevData.jobRequests.filter(j => j.id !== newJob.id)
        }));
    };
    
    // ✅ Use onLogout from props and clear localStorage
    const handleLogout = () => {
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
                return <WorkerHome 
                    data={workerData} 
                    handleSetTab={handleTabChange} 
                    isLoading={isLoading}
                    updateActiveJobs={updateActiveJobs}
                    workerId={user?.id}
                />;
            case 'JOBS':
                return <JobRequests handleSetTab={handleTabChange} workerData={workerData} />;
            case 'PROFILE':
                return <WorkerProfile data={user} />;
            default:
                return <WorkerHome 
                    data={workerData} 
                    handleSetTab={handleTabChange} 
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
                    <div className={styles.logoSection} onClick={() => handleTabChange('HOME')}>
                        <div className={styles.logoIcon}><Wrench size={24} color="white" /></div> 
                        <h1 className={styles.appName}>AyosNow</h1>
                    </div>
                    <div className={styles.navLinks}>
                        <button 
                            className={activeTab === 'HOME' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => handleTabChange('HOME')}
                        >
                            <Home size={20} /> Home
                        </button>
                        <button 
                            className={activeTab === 'JOBS' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => handleTabChange('JOBS')}
                        >
                            <FileText size={20} /> My Jobs
                        </button>
                        <button 
                            className={activeTab === 'PROFILE' ? styles.navLinkActive : styles.navLink} 
                            onClick={() => handleTabChange('PROFILE')}
                        >
                            <User size={20} /> Profile
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
