import { useState, useEffect } from 'react';
import styles from '../../../styles/UserDashboard.css';
import { Clock, ListOrdered } from 'lucide-react';

const useFetchUserData = (initialUserName) => {
    const [userData, setUserData] = useState({
        name: initialUserName || "AyosNow User",
        stats: [],
        activeBookings: [],
        recentHistory: [],
        address: "Loading Address...",
        email: "Loading Email...",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);

        const timeout = setTimeout(() => {
            const fetchedData = {
                id: 1,
                name: initialUserName || "Customer",
                email: "test@ayosnow.com",
                phone: "(555) 555-000",
                address: "123 Main Street",

                stats: [
                    { label: "Active", value: 0, icon: <Clock size={16} /> },
                    { label: "Total Jobs", value: 8, icon: <ListOrdered size={16} /> },
                ],

                activeBookings: [],

                recentHistory: [
                    {
                        id: 101,
                        title: "Deep Cleaning",
                        date: "Oct 25, 2024",
                        rating: 5,
                        status: "Completed",
                        color: styles.statusGreen
                    },
                ],
            };

            fetchedData.stats[0].value = fetchedData.activeBookings.length;

            setUserData(fetchedData);
            setIsLoading(false);

        }, 1500);

        return () => clearTimeout(timeout);
    }, []);

    return { userData, isLoading, error, setUserData };
};

export default useFetchUserData;
