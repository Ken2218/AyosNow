package com.ayosnow.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ayosnow.backend.entity.Booking;
import com.ayosnow.backend.entity.Booking.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByWorkerId(Long workerId);
    List<Booking> findByStatus(BookingStatus status);
    
    // FIXED: Case-insensitive search
    @Query("SELECT b FROM Booking b WHERE LOWER(TRIM(b.service)) = LOWER(TRIM(:service)) AND b.status = :status")
    List<Booking> findByServiceAndStatus(@Param("service") String service, @Param("status") BookingStatus status);
}
