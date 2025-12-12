package com.ayosnow.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


    
    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            System.out.println("📥 Registration Request: " + request.getName() + ", Role: " + request.getRole());
            
            if ("WORKER".equalsIgnoreCase(request.getRole())) {
                
                if (workerRepository.findByEmail(request.getEmail()).isPresent()) {
                    return ResponseEntity.badRequest().body("Email already registered as a Worker");
                }

                Worker worker = new Worker();
                worker.setName(request.getName());
                worker.setEmail(request.getEmail());
                worker.setPassword(request.getPassword()); 
                worker.setPhoneNumber(request.getPhoneNumber());
                worker.setAddress(request.getLocation());
                
                // ✅ FIX: Properly handle experience years
                Integer expYears = request.getExperienceYears();
                worker.setExperienceYears(expYears != null ? expYears : 0);
                System.out.println("✅ Setting experience years: " + worker.getExperienceYears());
                
                worker.setAvailabilityStatus("AVAILABLE");
                worker.setRating(5.0); 

                if (request.getJobTypeId() != null) {
                    JobType jobType = jobTypeRepository.findById(request.getJobTypeId())
                            .orElseThrow(() -> new RuntimeException("JobType not found"));
                    worker.setJobType(jobType);
                    System.out.println("✅ Set JobType: " + jobType.getName());
                }

                Worker savedWorker = workerRepository.save(worker);
                System.out.println("✅ Worker saved with ID: " + savedWorker.getWorkerId());
                
                Map<String, Object> response = createWorkerResponse(savedWorker);
                System.out.println("📤 Sending response: " + response);
                return ResponseEntity.ok(response);

            } else {
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
                return ResponseEntity.ok(createUserResponse(savedUser));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return ResponseEntity.ok(createUserResponse(user));
            } else {
                return ResponseEntity.status(401).body("Invalid password");
            }
        }

        Optional<Worker> workerOpt = workerRepository.findByEmail(email);
        
        if (workerOpt.isPresent()) {
            Worker worker = workerOpt.get();
            if (worker.getPassword() != null && worker.getPassword().equals(password)) {
                return ResponseEntity.ok(createWorkerResponse(worker));
            } else {
                return ResponseEntity.status(401).body("Invalid password");
            }
        }

        return ResponseEntity.status(401).body("User not found or invalid credentials");
    }



    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(createUserResponse(user));
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

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(createUserResponse(savedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update profile: " + e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long userId, @RequestBody Map<String, String> passwordData) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            if (!user.getPassword().equals(currentPassword)) {
                return ResponseEntity.status(401).body("Current password is incorrect");
            }

            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest().body("New password must be at least 6 characters");
            }

            user.setPassword(newPassword);
            userRepository.save(user);
            
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update password: " + e.getMessage());
        }
    }

    // Helper methods
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getUserId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", "CUSTOMER");
        response.put("phoneNumber", user.getPhoneNumber());
        response.put("address", user.getAddress());
        return response;
    }

    private Map<String, Object> createWorkerResponse(Worker worker) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", worker.getWorkerId());
        response.put("name", worker.getName());
        response.put("email", worker.getEmail());
        response.put("role", "WORKER");
        response.put("phoneNumber", worker.getPhoneNumber());
        response.put("address", worker.getAddress());
        response.put("experienceYears", worker.getExperienceYears() != null ? worker.getExperienceYears() : 0);
        response.put("availabilityStatus", worker.getAvailabilityStatus());
        response.put("rating", worker.getRating());
        if (worker.getJobType() != null) {
            response.put("skill", worker.getJobType().getName());
            response.put("jobTypeId", worker.getJobType().getJobTypeId());
        }
        return response;
    }
}