import { useState, useEffect } from 'react';

export const useFetchWorkerData = (initialWorkerName) => {
    const [workerData, setWorkerData] = useState({ 
        name: initialWorkerName || 'AyosNow', 
        stats: [], 
        activeJobs: [], 
        recentJobs: [],
        rating: 4.5,
        skill: 'Loading Skill...',
        location: 'Loading Location...',
        email: 'Loading Email...'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        const simulateFetch = setTimeout(() => {
            try {
                const fetchedData = {
                    id: 201,
                    name: initialWorkerName || "Pro Account", 
                    email: initialWorkerName ? initialWorkerName.toLowerCase().replace(/\s/g, '.') + "@ayosnow.pro" : "pro@ayosnow.pro",
                    phone: "(555) 555-1111",
                    location: "Central District, City", 
                    skill: "Certified Plumber", 
                    rating: 4.9, 
                    
                    stats: [
                        { label: "Active Jobs", value: 1, icon: 'Activity' }, 
                        { label: "Jobs Completed (30d)", value: 12, icon: 'Briefcase' },
                        { label: "Avg. Rating", value: 4.9, icon: 'Star' }, 
                        { label: "Monthly Earnings", value: "₱15K", icon: 'DollarSign' }, 
                    ],
                    activeJobs: [
                        { 
                            id: 301, 
                            title: "Leaky Faucet Repair", 
                            client: "John Smith", 
                            time: "Today, 4:00 PM", 
                            status: 'En Route', 
                            address: "123 Main St"
                        }
                    ], 
                    recentJobs: [
                        { id: 302, title: "Toilet Installation", date: "Nov 15, 2025", rating: 5, status: 'Completed' },
                        { id: 303, title: "Drain Unclogging", date: "Nov 10, 2025", rating: 4, status: 'Completed' },
                    ]
                };
                
                const activeCount = fetchedData.activeJobs.length;
                fetchedData.stats[0].value = activeCount;

                setWorkerData(fetchedData);

            } catch (err) {
                setError("Failed to load worker data: " + err.message);
            } finally {
                setIsLoading(false);
            }
        }, 1500);

        return () => clearTimeout(simulateFetch);
    }, [initialWorkerName]);

    return { workerData, isLoading, error, setWorkerData };
};