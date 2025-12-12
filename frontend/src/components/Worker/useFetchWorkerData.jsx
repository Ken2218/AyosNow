    import { useState, useEffect } from 'react';

    export const useFetchWorkerData = (initialWorkerName, workerId, workerSkill) => {
    const [workerData, setWorkerData] = useState({ 
        name: initialWorkerName || 'AyosNow Pro', 
        activeJobs: [], 
        jobRequests: [],
        rating: 5.0,
        skill: workerSkill || 'General',
        location: 'Cebu City',
        email: 'pro@ayosnow.com'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper to safely format price
    const formatPrice = (amount) => {
        if (amount === null || amount === undefined || amount === '') return 'Price TBD';
        const num = Number(amount);
        if (isNaN(num) || !isFinite(num)) return 'Price TBD';
        return `₱${num.toLocaleString()}`;
    };

    useEffect(() => {
        const fetchData = async () => {
        if (!workerId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 1. FETCH ALL PENDING BOOKINGS
            const pendingResponse = await fetch(`http://localhost:8080/api/bookings/pending`);
            let jobRequests = [];

            if (pendingResponse.ok) {
            const pendingBookings = await pendingResponse.json();

            jobRequests = pendingBookings
                .filter(booking => !workerSkill || booking.service === workerSkill)
                .map(booking => ({
                id: booking.id,
                title: booking.service,
                category: booking.service,
                client: booking.customerName || 'Valued Customer',
                date: booking.scheduledTime
                    ? new Date(booking.scheduledTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                    })
                    : 'Flexible',
                location: booking.location || 'Location provided upon acceptance',
                price: booking.price,
                description: booking.description || 'No description provided',
                isMatchingSkill: true,
                customerPhone: booking.customerPhone || null,   // NEW
                }));
            }

            // 2. FETCH WORKER'S ACCEPTED JOBS
            const acceptedResponse = await fetch(`http://localhost:8080/api/bookings/worker/${workerId}`);
            let activeJobs = [];

            if (acceptedResponse.ok) {
            const acceptedBookings = await acceptedResponse.json();

            activeJobs = acceptedBookings.map(booking => ({
                id: booking.id,
                title: booking.service,
                client: booking.customerName,
                time: booking.scheduledTime
                ? new Date(booking.scheduledTime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    })
                : 'N/A',
                status: booking.status,
                address: booking.location,
                description: booking.description,
                customerPhone: booking.customerPhone || null,    // NEW
                price: formatPrice(booking.price),
            }));
            }

            setWorkerData(prev => ({
            ...prev,
            activeJobs,
            jobRequests,
            }));
        } catch (err) {
            console.error('ERROR fetching worker data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
        };

        fetchData();
    }, [initialWorkerName, workerId, workerSkill]);

    return { workerData, isLoading, error, setWorkerData };
    };
