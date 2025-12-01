package com.ayosnow.backend.controller;

import com.ayosnow.backend.dto.BookingRequest;
import com.ayosnow.backend.dto.BookingResponse;
import com.ayosnow.backend.entity.Booking;
import com.ayosnow.backend.repository.BookingRepository;
import com.ayosnow.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            System.out.println("Creating booking: " + request.getService());
            BookingResponse booking = bookingService.createBooking(request);
            System.out.println("Booking created with ID: " + booking.getId());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(customerId));
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<BookingResponse>> getWorkerBookings(@PathVariable Long workerId) {
        return ResponseEntity.ok(bookingService.getWorkerBookings(workerId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<BookingResponse>> getAllPendingBookings() {
        System.out.println("Fetching all pending bookings");
        List<BookingResponse> bookings = bookingService.getPendingBookings();
        System.out.println("Found " + bookings.size() + " pending bookings");
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/pending/service/{service}")
    public ResponseEntity<List<BookingResponse>> getPendingBookingsByService(@PathVariable String service) {
        System.out.println("Fetching pending bookings for service: " + service);
        List<BookingResponse> bookings = bookingService.getPendingBookingsByService(service);
        System.out.println("Found " + bookings.size() + " pending bookings for " + service);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{bookingId}/accept")
    public ResponseEntity<?> acceptBooking(@PathVariable Long bookingId, @RequestBody Map<String, Long> payload) {
        try {
            Long workerId = payload.get("workerId");
            System.out.println("Worker " + workerId + " accepting booking " + bookingId);
            BookingResponse booking = bookingService.acceptBooking(bookingId, workerId);
            System.out.println("Booking " + bookingId + " accepted successfully");
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Worker marks job as COMPLETED
     */
    @PutMapping("/{bookingId}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable Long bookingId) {
        try {
            System.out.println("Completing booking " + bookingId);
            BookingResponse booking = bookingService.completeBooking(bookingId);
            System.out.println("Booking " + bookingId + " marked as completed");
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Worker or Customer cancels booking
     */
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        try {
            System.out.println("Cancelling booking " + bookingId);
            BookingResponse booking = bookingService.cancelBooking(bookingId);
            System.out.println("Booking " + bookingId + " cancelled");
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long bookingId) {
        try {
            System.out.println("Deleting booking: " + bookingId);
            bookingService.deleteBooking(bookingId);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/debug/all")
    public ResponseEntity<?> getAllBookingsDebug() {
        List<Booking> allBookings = bookingRepository.findAll();
        List<Map<String, Object>> debugInfo = allBookings.stream()
            .map(b -> {
                Map<String, Object> info = new HashMap<>();
                info.put("id", b.getId());
                info.put("service", b.getService());
                info.put("status", b.getStatus().name());
                info.put("customerName", b.getCustomer().getName());
                info.put("customerId", b.getCustomer().getId());
                info.put("workerName", b.getWorker() != null ? b.getWorker().getName() : null);
                info.put("workerId", b.getWorker() != null ? b.getWorker().getId() : null);
                info.put("scheduledTime", b.getScheduledTime());
                info.put("location", b.getLocation());
                info.put("description", b.getDescription());
                return info;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalBookings", allBookings.size());
        response.put("bookings", debugInfo);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/debug/service/{service}")
    public ResponseEntity<?> getBookingsByServiceDebug(@PathVariable String service) {
        List<Booking> allPending = bookingRepository.findByStatus(Booking.BookingStatus.PENDING);
        List<Booking> matchingBookings = bookingRepository.findByServiceAndStatus(
            service, 
            Booking.BookingStatus.PENDING
        );
        
        Map<String, Object> debug = new HashMap<>();
        debug.put("searchingFor", service);
        debug.put("totalPending", allPending.size());
        debug.put("matchingService", matchingBookings.size());
        debug.put("allPendingServices", allPending.stream()
            .map(Booking::getService)
            .collect(Collectors.toList()));
        debug.put("matchingBookings", matchingBookings.stream()
            .map(b -> Map.of(
                "id", b.getId(),
                "service", b.getService(),
                "status", b.getStatus().name(),
                "customer", b.getCustomer().getName()
            ))
            .collect(Collectors.toList()));
        
        return ResponseEntity.ok(debug);
    }
}
