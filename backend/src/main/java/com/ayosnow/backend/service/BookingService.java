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
import com.ayosnow.backend.entity.JobType;
import com.ayosnow.backend.entity.User;
import com.ayosnow.backend.entity.Worker;
import com.ayosnow.backend.repository.BookingRepository;
import com.ayosnow.backend.repository.JobTypeRepository;
import com.ayosnow.backend.repository.UserRepository;
import com.ayosnow.backend.repository.WorkerRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WorkerRepository workerRepository;
    
    @Autowired
    private JobTypeRepository jobTypeRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // 1. Fetch the Customer (User entity)
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // 2. Fetch the JobType
        JobType jobType = jobTypeRepository.findById(request.getJobTypeId())
                .orElseThrow(() -> new RuntimeException("JobType not found"));

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setJobType(jobType);
        booking.setDescription(request.getDescription());
        booking.setStartTime(request.getScheduledTime());
        booking.setLocation(request.getLocation());
        
        // FIX 1: Set price using the new field name
        booking.setPrice(request.getPrice());
        
        booking.setStatus(BookingStatus.PENDING);
        
        // Note: Worker is null initially until accepted

        Booking savedBooking = bookingRepository.save(booking);
        return convertToResponse(savedBooking);
    }

    public List<BookingResponse> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomer_UserId(customerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getWorkerBookings(Long workerId) {
        return bookingRepository.findByWorker_WorkerId(workerId)
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

    public List<BookingResponse> getPendingBookingsByService(String serviceName) {
        return bookingRepository.findByJobType_NameAndStatus(serviceName, BookingStatus.PENDING)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse acceptBooking(Long bookingId, Long workerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

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
        
        bookingRepository.delete(booking);
    }

    // Helper to convert Entity -> DTO
    public BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getBookingId());
        response.setCustomerId(booking.getCustomer().getUserId());
        response.setCustomerName(booking.getCustomer().getName());
        
        if (booking.getWorker() != null) {
            response.setWorkerId(booking.getWorker().getWorkerId());
            response.setWorkerName(booking.getWorker().getName());
            response.setWorkerPhone(booking.getWorker().getPhoneNumber());
        }
        
        if (booking.getJobType() != null) {
            response.setService(booking.getJobType().getName());
        }
        
        response.setDescription(booking.getDescription());
        response.setScheduledTime(booking.getStartTime());
        response.setStatus(booking.getStatus().name());
        response.setLocation(booking.getLocation());
        
        // ✅ FIX 2: Use getPrice() and setPrice()
        // Ensure your BookingResponse.java has setPrice(Double price)
        response.setPrice(booking.getPrice()); 
        
        return response;
    }
}