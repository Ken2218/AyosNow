package com.ayosnow.backend.repository;

import com.ayosnow.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Find all reviews for a specific worker to calculate average
    List<Review> findByWorker_WorkerId(Long workerId);
}