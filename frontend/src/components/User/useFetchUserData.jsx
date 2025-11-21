import { useState, useEffect } from 'react';

export const useFetchUserData = (initialUserName) => {
    const [userData, setUserData] = useState({ 
        name: initialUserName || 'AyosNow User', 
        stats: [], 
        activeBookings: [], 
        recentHistory: [],
        memberStatus: 'Bronze',
        address: 'Loading Address...',
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
                    id: 1,
                    name: initialUserName || "Customer Account", 
                    email: initialUserName ? initialUserName.toLowerCase().replace(/\s/g, '.') + "@ayosnow.com" : "default@ayosnow.com",
                    phone: "(555) 555-0000",
                    address: "123 Main Street, City", 
                    memberStatus: "Gold", 
                    
                    stats: [
                        { label: "Active", value: 0, icon: 'Clock' }, 
                        { label: "Total Jobs", value: 8, icon: 'ListOrdered' },
                        { label: "Rating Avg.", value: 4.7, icon: 'Star' }, 
                    ],
                    activeBookings: [],
                    recentHistory: [ 
                        { id: 101, title: "Deep Cleaning", date: "Oct 25, 2024", rating: 5, status: 'Completed' },
                        { id: 102, title: "Wall Painting", date: "Sep 01, 2024", rating: 4, status: 'Completed' },
                    ]
                };
                
                const activeCount = fetchedData.activeBookings.length;
                fetchedData.stats[0].value = activeCount;

                setUserData(fetchedData);

            } catch (err) {
                setError("Failed to load user data: " + err.message);
            } finally {
                setIsLoading(false);
            }
        }, 1500);

        return () => clearTimeout(simulateFetch);
    }, [initialUserName]);

    return { userData, isLoading, error, setUserData };
};