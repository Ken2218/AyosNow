package com.ayosnow.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ayosnow.backend.dto.BookingRequest;
import com.ayosnow.backend.dto.BookingResponse;
import com.ayosnow.backend.entity.Booking;
import com.ayosnow.backend.entity.Booking.BookingStatus;
import com.ayosnow.backend.entity.User;
import com.ayosnow.backend.repository.BookingRepository;
import com.ayosnow.backend.repository.UserRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (customer.getRole() != User.Role.CUSTOMER) {
            throw new RuntimeException("Only customers can create bookings");
        }

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setService(request.getService());
        booking.setDescription(request.getDescription());
        booking.setScheduledTime(request.getScheduledTime());
        booking.setLocation(request.getLocation());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);
        return convertToResponse(savedBooking);
    }

    public List<BookingResponse> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerId(customerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getWorkerBookings(Long workerId) {
        return bookingRepository.findByWorkerId(workerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getPendingBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getPendingBookingsByService(String service) {
        return bookingRepository.findByServiceAndStatus(service, BookingStatus.PENDING)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse acceptBooking(Long bookingId, Long workerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        if (worker.getRole() != User.Role.WORKER) {
            throw new RuntimeException("Only workers can accept bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in PENDING status");
        }

        booking.setWorker(worker);
        booking.setStatus(BookingStatus.ACCEPTED);

        Booking updatedBooking = bookingRepository.save(booking);
        return convertToResponse(updatedBooking);
    }

    @Transactional
    public BookingResponse completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.ACCEPTED && 
            booking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new RuntimeException("Only accepted or in-progress bookings can be completed");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        Booking updatedBooking = bookingRepository.save(booking);
        return convertToResponse(updatedBooking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        return convertToResponse(updatedBooking);
    }

    @Transactional
    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.PENDING && 
            booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new RuntimeException("Cannot delete booking in current status");
        }
        
        bookingRepository.delete(booking);
    }

    public BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setCustomerId(booking.getCustomer().getId());
        response.setCustomerName(booking.getCustomer().getName());
        
        if (booking.getWorker() != null) {
            response.setWorkerId(booking.getWorker().getId());
            response.setWorkerName(booking.getWorker().getName());
        }
        
        response.setService(booking.getService());
        response.setDescription(booking.getDescription());
        response.setScheduledTime(booking.getScheduledTime());
        response.setStatus(booking.getStatus().name());
        response.setLocation(booking.getLocation());
        response.setRating(booking.getRating());
        
        return response;
    }
}
