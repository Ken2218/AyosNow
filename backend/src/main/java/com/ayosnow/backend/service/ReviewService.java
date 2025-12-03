package com.ayosnow.backend.service;

import com.ayosnow.backend.dto.ReviewRequest;
import com.ayosnow.backend.entity.*;
import com.ayosnow.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Transactional
    public void submitReview(ReviewRequest request) {
        // 1. Validate the Booking
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("You can only review completed bookings.");
        }

        // 2. Create and Save the Review
        Review review = new Review();
        review.setUser(booking.getCustomer());
        review.setWorker(booking.getWorker());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        reviewRepository.save(review);

        // 3. AUTOMATICALLY Recalculate Worker's Average Rating
        updateWorkerRating(booking.getWorker());
    }

    private void updateWorkerRating(Worker worker) {
        List<Review> reviews = reviewRepository.findByWorker_WorkerId(worker.getWorkerId());
        
        if (reviews.isEmpty()) return;

        double sum = 0;
        for (Review r : reviews) {
            sum += r.getRating();
        }
        
        double average = sum / reviews.size();
        
        // Update the worker entity
        worker.setRating(average);
        workerRepository.save(worker);
    }
}