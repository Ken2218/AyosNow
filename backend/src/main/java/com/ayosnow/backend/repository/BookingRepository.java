package com.ayosnow.backend.repository;

import com.ayosnow.backend.entity.Booking;
import com.ayosnow.backend.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Finds bookings where booking.customer.userId matches the parameter
    List<Booking> findByCustomer_UserId(Long userId);
    
    // Finds bookings where booking.worker.workerId matches the parameter
    List<Booking> findByWorker_WorkerId(Long workerId);

    // Finds bookings by status (e.g., PENDING)
    List<Booking> findByStatus(BookingStatus status);

    // Finds bookings by JobType name AND status
    // Note: This assumes your JobType entity has a field named "name"
    List<Booking> findByJobType_NameAndStatus(String serviceName, BookingStatus status);
}