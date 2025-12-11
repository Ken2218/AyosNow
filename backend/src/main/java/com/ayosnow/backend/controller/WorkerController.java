package com.ayosnow.backend.controller;

import com.ayosnow.backend.entity.Review;
import com.ayosnow.backend.entity.Worker;
import com.ayosnow.backend.repository.ReviewRepository;
import com.ayosnow.backend.repository.WorkerRepository;
import com.ayosnow.backend.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    @Autowired
    private WorkerService workerService;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public List<Worker> getAllWorkers() {
        return workerService.getAllWorkers();
    }

    @PostMapping
    public Worker createWorker(@RequestBody Worker worker) {
        return workerService.saveWorker(worker);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkerById(@PathVariable Long id) {
        try {
            Worker worker = workerRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Worker not found"));
            return ResponseEntity.ok(createWorkerResponse(worker, false));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{workerId}/profile")
    public ResponseEntity<?> getWorkerProfile(@PathVariable Long workerId) {
        try {
            Worker worker = workerRepository.findById(workerId)
                    .orElseThrow(() -> new RuntimeException("Worker not found"));
            
            // Include reviews in profile response
            return ResponseEntity.ok(createWorkerResponse(worker, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{workerId}/profile")
    public ResponseEntity<?> updateWorkerProfile(@PathVariable Long workerId, @RequestBody Map<String, String> updates) {
        try {
            Worker worker = workerRepository.findById(workerId)
                    .orElseThrow(() -> new RuntimeException("Worker not found"));

            if (updates.containsKey("name")) worker.setName(updates.get("name"));
            if (updates.containsKey("phoneNumber")) worker.setPhoneNumber(updates.get("phoneNumber"));
            if (updates.containsKey("address")) worker.setAddress(updates.get("address"));
            if (updates.containsKey("experienceYears")) {
                try {
                    worker.setExperienceYears(Integer.parseInt(updates.get("experienceYears")));
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("Invalid experience years format");
                }
            }

            Worker savedWorker = workerRepository.save(worker);
            return ResponseEntity.ok(createWorkerResponse(savedWorker, true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update profile: " + e.getMessage());
        }
    }

    @PutMapping("/{workerId}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long workerId, @RequestBody Map<String, String> passwordData) {
        try {
            Worker worker = workerRepository.findById(workerId)
                    .orElseThrow(() -> new RuntimeException("Worker not found"));

            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            if (!worker.getPassword().equals(currentPassword)) {
                return ResponseEntity.status(401).body("Current password is incorrect");
            }

            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest().body("New password must be at least 6 characters");
            }

            worker.setPassword(newPassword);
            workerRepository.save(worker);
            
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update password: " + e.getMessage());
        }
    }

    // Helper method to create worker response with optional reviews
    private Map<String, Object> createWorkerResponse(Worker worker, boolean includeReviews) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", worker.getWorkerId());
        response.put("name", worker.getName());
        response.put("email", worker.getEmail());
        response.put("role", "WORKER");
        response.put("phoneNumber", worker.getPhoneNumber());
        response.put("address", worker.getAddress());
        response.put("experienceYears", worker.getExperienceYears() != null ? worker.getExperienceYears() : 0);
        response.put("availabilityStatus", worker.getAvailabilityStatus());
        response.put("rating", worker.getRating() != null ? worker.getRating() : 0.0);
        
        if (worker.getJobType() != null) {
            response.put("skill", worker.getJobType().getName());
            response.put("jobTypeId", worker.getJobType().getJobTypeId());
        }
        
        // Add reviews if requested
        if (includeReviews) {
            List<Review> reviews = reviewRepository.findByWorker_WorkerId(worker.getWorkerId());
            List<Map<String, Object>> reviewList = new ArrayList<>();
            
            for (Review review : reviews) {
                Map<String, Object> reviewData = new HashMap<>();
                reviewData.put("id", review.getReviewId());
                reviewData.put("rating", review.getRating());
                reviewData.put("comment", review.getComment());
                reviewData.put("date", review.getReviewDate().toString());
                reviewData.put("customerName", review.getUser().getName());
                reviewList.add(reviewData);
            }
            
            response.put("reviews", reviewList);
            response.put("totalReviews", reviewList.size());
        }
        
        return response;
    }
}