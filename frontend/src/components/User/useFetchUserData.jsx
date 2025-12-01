import { useState, useEffect } from 'react';

export const useFetchUserData = (user) => {
    const [userData, setUserData] = useState({ 
        name: user?.name || 'AyosNow User', 
        email: user?.email || 'default@ayosnow.com',
        phoneNumber: user?.phoneNumber || 'Not provided',
        address: user?.address || 'Not provided',  // ✅ Use user.address
        activeBookings: [], 
        recentHistory: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            // ✅ FIX: Check if activeBookings exists and has length
            if (!userData.activeBookings || userData.activeBookings.length === 0) {
                setIsLoading(true);
            }
            setError(null);

            try {
                const response = await fetch(`http://localhost:8080/api/bookings/customer/${user.id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }

                const bookings = await response.json();
                console.log('📦 Fetched bookings:', bookings);
                
                const activeBookings = bookings
                    .filter(b => ['PENDING', 'ACCEPTED', 'EN_ROUTE', 'IN_PROGRESS'].includes(b.status))
                    .map(b => ({
                        id: b.id,
                        service: b.service,
                        provider: b.workerName || 'Searching for worker...',
                        status: b.status,
                        time: b.scheduledTime ? new Date(b.scheduledTime).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                        }) : 'Time Not Set',
                        description: b.description,
                        location: b.location || 'Location not set'  // ✅ Include location
                    }));
                
                const recentHistory = bookings
                    .filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED')
                    .map(b => ({
                        id: b.id,
                        title: b.service,
                        date: b.scheduledTime ? new Date(b.scheduledTime).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }) : 'N/A',
                        rating: b.rating || null,
                        status: b.status,
                        provider: b.workerName || 'Unknown'
                    }));

                setUserData(prevData => ({
                    ...prevData,
                    activeBookings,
                    recentHistory
                }));

            } catch (err) {
                console.error('❌ Error fetching bookings:', err);
                setError('Failed to load bookings');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();

        const intervalId = setInterval(() => {
            console.log('🔄 Auto-refreshing bookings...');
            fetchBookings();
        }, 10000);

        return () => clearInterval(intervalId);

    }, [user?.id]); 

    return { userData, isLoading, error, setUserData };
};
