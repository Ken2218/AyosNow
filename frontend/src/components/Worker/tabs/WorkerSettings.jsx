import React from 'react';
import '../../../styles/workerSettings.css';

export const WorkerSettings = () => (
    <div className="settingsContainer">
        <h2 className="profileHeader">Settings</h2>

        <div className="settingsGroup">
            <h4>Account Settings</h4>
            <div className="settingsButtons">
                <button className="settingsButton">Change Password</button>
                <button className="settingsButton">Notification Preferences</button>
            </div>
        </div>

        <div className="settingsGroup">
            <h4>Availability</h4>
            <div className="settingsButtons">
                <button className="settingsButton">Set Working Hours</button>
                <button className="settingsButton">Vacation Mode</button>
            </div>
        </div>
    </div>
);
