import { useState, useEffect } from 'react';

export const useFetchWorkerData = (initialWorkerName, workerId, skill) => {
    const [workerData, setWorkerData] = useState({ 
        name: initialWorkerName || 'AyosNow', 
        activeJobs: [], 
        jobRequests: [],
        rating: 4.5,
        skill: skill || 'Loading Skill...',
        location: 'Loading Location...',
        email: 'Loading Email...'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log('==========================================');
            console.log('WORKER DATA FETCH STARTED');
            console.log('Worker ID:', workerId);
            console.log('Worker Skill:', skill);
            console.log('==========================================');

            if (!workerId) {
                console.log('Missing workerId');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // FETCH ALL PENDING BOOKINGS
                const url = `http://localhost:8080/api/bookings/pending`;
                console.log('\n📋 Fetching ALL pending bookings from:', url);
                
                const pendingResponse = await fetch(url);
                let jobRequests = [];

                if (pendingResponse.ok) {
                    const pendingBookings = await pendingResponse.json();
                    console.log('✅ Pending bookings received:', pendingBookings);
                    console.log('Total available jobs:', pendingBookings.length);
                    
                    jobRequests = pendingBookings.map(booking => {
                        console.log(`📦 Job ${booking.id}:`, {
                            service: booking.service,
                            customer: booking.customerName,
                            location: booking.location,
                            time: booking.scheduledTime
                        });
                        
                        return {
                            id: booking.id,
                            title: booking.service,
                            category: booking.service,
                            client: booking.customerName || 'Customer',
                            date: booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                            }) : 'Not specified',
                            location: booking.location || 'Location not set',
                            price: '₱500',
                            description: booking.description || '',
                            isMatchingSkill: booking.service.toLowerCase() === skill?.toLowerCase()
                        };
                    });
                    
                    console.log('Transformed job requests:', jobRequests);
                } else {
                    console.error('Failed to fetch pending bookings:', pendingResponse.status);
                }

                // Get worker's accepted jobs
                console.log('\n✅ Fetching worker accepted jobs...');
                const acceptedResponse = await fetch(`http://localhost:8080/api/bookings/worker/${workerId}`);
                let activeJobs = [];

                if (acceptedResponse.ok) {
                    const acceptedBookings = await acceptedResponse.json();
                    console.log('Accepted jobs:', acceptedBookings);
                    
                    activeJobs = acceptedBookings.map(booking => ({
                        id: booking.id,
                        title: booking.service,
                        client: booking.customerName,
                        time: booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                        }) : 'Not specified',
                        status: booking.status,
                        color: 'statusGreen',
                        address: booking.location || 'Location not set',
                        description: booking.description
                    }));
                }

                console.log('\n==========================================');
                console.log('FINAL RESULTS:');
                console.log('Job Requests (Available):', jobRequests.length);
                console.log('Active Jobs (Accepted):', activeJobs.length);
                console.log('==========================================\n');

                setWorkerData({
                    name: initialWorkerName || 'Pro Account',
                    email: initialWorkerName ? initialWorkerName.toLowerCase().replace(/\s/g, '.') + '@ayosnow.pro' : 'pro@ayosnow.pro',
                    location: 'Central District, City',
                    skill: skill,
                    rating: 4.9,
                    activeJobs,
                    jobRequests
                });

            } catch (err) {
                console.error('ERROR fetching worker data:', err);
                setError('Failed to load worker data: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [initialWorkerName, workerId, skill]);

    return { workerData, isLoading, error, setWorkerData };
};
