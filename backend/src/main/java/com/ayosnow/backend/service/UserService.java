package com.ayosnow.backend.service;

import java.util.Optional;
import java.util.UUID; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ayosnow.backend.entity.User;
import com.ayosnow.backend.entity.User.Role;
import com.ayosnow.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Helper to generate a unique String ID (e.g., U-A2B3C4D5)
    private String generateUniqueId() {
        return "U-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // Register
    public User registerUser(User user) throws Exception {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new Exception("Email already exists!");
        }
        
        // Set the unique String ID before saving
        user.setId(generateUniqueId());

        return userRepository.save(user);
    }

    // Login (Note: Password hashing should be implemented here for production!)
    public User loginUser(String email, String password) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt.get();
        }
        throw new Exception("Invalid email or password");
    }

    // Utility to fetch user by ID
    public User getUserById(String id) throws Exception { 
        return userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));
    }

    /**
     * Fetches user data only if the user has the WORKER role.
     */
    public User getWorkerDashboardData(String workerId) throws Exception { 
        User worker = getUserById(workerId);

        if (worker.getRole() != Role.WORKER) {
            throw new Exception("Access Denied: User is not a Worker.");
        }

        return worker;
    }
}