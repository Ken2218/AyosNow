package com.ayosnow.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ayosnow.backend.dto.RegisterRequest;
import com.ayosnow.backend.entity.JobType;
import com.ayosnow.backend.entity.User;
import com.ayosnow.backend.entity.Worker;
import com.ayosnow.backend.repository.JobTypeRepository;
import com.ayosnow.backend.repository.UserRepository;
import com.ayosnow.backend.repository.WorkerRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private JobTypeRepository jobTypeRepository;

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // 1. Logic for WORKER Registration
            if ("WORKER".equalsIgnoreCase(request.getRole())) {
                
                if (workerRepository.findByEmail(request.getEmail()).isPresent()) {
                    return ResponseEntity.badRequest().body("Email already registered as a Worker");
                }

                Worker worker = new Worker();
                worker.setName(request.getName());
                worker.setEmail(request.getEmail());
                
                // ✅ FIX: Password is now set correctly
                worker.setPassword(request.getPassword()); 
                
                worker.setPhoneNumber(request.getPhoneNumber());
                worker.setAddress(request.getLocation());
                worker.setExperienceYears(request.getExperienceYears());
                worker.setHourlyRate(request.getHourlyRate());
                worker.setAvailabilityStatus("AVAILABLE");
                worker.setRating(5.0); 

                // Handle JobType Relationship
                if (request.getJobTypeId() != null) {
                    JobType jobType = jobTypeRepository.findById(request.getJobTypeId())
                            .orElseThrow(() -> new RuntimeException("JobType not found"));
                    worker.setJobType(jobType);
                }

                Worker savedWorker = workerRepository.save(worker);
                return ResponseEntity.ok(createLoginResponse(null, savedWorker));

            } else {
                // 2. Logic for CUSTOMER (User) Registration
                
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                    return ResponseEntity.badRequest().body("Email already registered as a User");
                }

                User user = new User();
                user.setName(request.getName());
                user.setEmail(request.getEmail());
                user.setPassword(request.getPassword());
                user.setPhoneNumber(request.getPhoneNumber());
                user.setAddress(request.getLocation());

                User savedUser = userRepository.save(user);
                return ResponseEntity.ok(createLoginResponse(savedUser, null));
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // 1. Try to find a Customer first
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return ResponseEntity.ok(createLoginResponse(user, null));
            } else {
                return ResponseEntity.status(401).body("Invalid password");
            }
        }

        // 2. If not a Customer, try to find a Worker
        // ✅ FIX: Worker login is now enabled
        Optional<Worker> workerOpt = workerRepository.findByEmail(email);
        
        if (workerOpt.isPresent()) {
             Worker worker = workerOpt.get();
             if (worker.getPassword() != null && worker.getPassword().equals(password)) {
                 return ResponseEntity.ok(createLoginResponse(null, worker));
             } else {
                 return ResponseEntity.status(401).body("Invalid password");
             }
        }

        return ResponseEntity.status(401).body("User not found or invalid credentials");
    }

    // ==========================================
    // PROFILE MANAGEMENT
    // ==========================================

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(createLoginResponse(user, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/profile")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @RequestBody Map<String, String> updates) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (updates.containsKey("name")) user.setName(updates.get("name"));
            if (updates.containsKey("phoneNumber")) user.setPhoneNumber(updates.get("phoneNumber"));
            if (updates.containsKey("address")) user.setAddress(updates.get("address"));
            
            userRepository.save(user);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update profile: " + e.getMessage());
        }
    }

    // Helper method
    private Map<String, Object> createLoginResponse(User user, Worker worker) {
        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            response.put("id", user.getUserId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", "CUSTOMER");
            response.put("phoneNumber", user.getPhoneNumber());
            response.put("address", user.getAddress());
        } else if (worker != null) {
            response.put("id", worker.getWorkerId());
            response.put("name", worker.getName());
            response.put("email", worker.getEmail());
            response.put("role", "WORKER");
            response.put("phoneNumber", worker.getPhoneNumber());
            response.put("address", worker.getAddress());
            if (worker.getJobType() != null) {
                response.put("skill", worker.getJobType().getName());
            }
        }
        return response;
    }
}