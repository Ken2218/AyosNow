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
        // Safety check for null/undefined/empty string
        if (amount === null || amount === undefined || amount === '') return 'Price TBD';
        
        // Convert to number
        const num = Number(amount);
        
        // Check if it's a valid finite number
        if (isNaN(num) || !isFinite(num)) return 'Price TBD';
        
        // Return formatted currency (e.g., ₱1,200)
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
                        .filter(booking => {
                            return !workerSkill || booking.service === workerSkill;
                        })
                        .map(booking => {
                            // Debug: Check what the backend is actually sending
                            // console.log(`Job ${booking.id} Price:`, booking.price); 

                            return {
                                id: booking.id,
                                title: booking.service,
                                category: booking.service,
                                client: booking.customerName || 'Valued Customer',
                                date: booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString('en-US', {
                                    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                                }) : 'Flexible',
                                location: booking.location || 'Location provided upon acceptance',
                                
                                // ✅ FIX: Use robust helper function
                                price: booking.price,
                                
                                description: booking.description || 'No description provided',
                                isMatchingSkill: true 
                            };
                        });
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
                        time: booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                        }) : 'N/A',
                        status: booking.status, 
                        address: booking.location,
                        description: booking.description,
                        
                        // ✅ FIX: Use helper function here too
                        price: formatPrice(booking.price)
                    }));
                }

                setWorkerData(prev => ({
                    ...prev,
                    activeJobs,
                    jobRequests
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