package com.ayosnow.backend.controller;

import java.util.HashMap;
import java.util.Map;

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
import com.ayosnow.backend.entity.User;
import com.ayosnow.backend.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already registered");
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            
            if (request.getRole().equalsIgnoreCase("CUSTOMER")) {
                user.setPhoneNumber(request.getPhoneNumber());
            } else if (request.getRole().equalsIgnoreCase("WORKER")) {
                user.setSkill(request.getSkill());
                user.setLocation(request.getLocation());
            }

            User savedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedUser.getId());
            response.put("name", savedUser.getName());
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getRole().name());
            response.put("phoneNumber", savedUser.getPhoneNumber());
            response.put("address", savedUser.getAddress());
            response.put("skill", savedUser.getSkill());
            response.put("location", savedUser.getLocation());
            response.put("rating", savedUser.getRating());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("phoneNumber", user.getPhoneNumber());
        response.put("address", user.getAddress());
        response.put("skill", user.getSkill());
        response.put("location", user.getLocation());
        response.put("rating", user.getRating());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());
            response.put("phoneNumber", user.getPhoneNumber());
            response.put("address", user.getAddress());
            response.put("skill", user.getSkill());
            response.put("location", user.getLocation());
            response.put("rating", user.getRating());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/profile")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @RequestBody Map<String, String> updates) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (updates.containsKey("name") && !updates.get("name").trim().isEmpty()) {
                user.setName(updates.get("name").trim());
            }
            if (updates.containsKey("phoneNumber") && !updates.get("phoneNumber").trim().isEmpty()) {
                user.setPhoneNumber(updates.get("phoneNumber").trim());
            }
            
            if (updates.containsKey("address") && !updates.get("address").trim().isEmpty()) {
                user.setAddress(updates.get("address").trim());
            }
            
            if (updates.containsKey("location") && !updates.get("location").trim().isEmpty()) {
                user.setLocation(updates.get("location").trim());
            }

            User updatedUser = userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedUser.getId());
            response.put("name", updatedUser.getName());
            response.put("email", updatedUser.getEmail());
            response.put("phoneNumber", updatedUser.getPhoneNumber());
            response.put("address", updatedUser.getAddress());
            response.put("location", updatedUser.getLocation());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to update profile: " + e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long userId, @RequestBody Map<String, String> passwordData) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            if (!user.getPassword().equals(currentPassword)) {
                return ResponseEntity.badRequest().body("Current password is incorrect");
            }

            if (newPassword == null || newPassword.trim().length() < 6) {
                return ResponseEntity.badRequest().body("New password must be at least 6 characters");
            }

            user.setPassword(newPassword.trim());
            userRepository.save(user);

            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to change password: " + e.getMessage());
        }
    }
}
