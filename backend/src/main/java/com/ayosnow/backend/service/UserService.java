package com.ayosnow.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ayosnow.backend.entity.User;
import com.ayosnow.backend.entity.User.Role;
import com.ayosnow.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register
    public User registerUser(User user) throws Exception {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new Exception("Email already exists!");
        }
        return userRepository.save(user);
    }

    // Login
    public User loginUser(String email, String password) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt.get();
        }
        throw new Exception("Invalid email or password");
    }

    // Utility to fetch user by ID (used internally)
    public User getUserById(Long id) throws Exception {
        return userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));
    }

    /**
     * Fetches user data only if the user has the WORKER role. This is used by
     * the WorkerController for dashboard access.
     */
    public User getWorkerDashboardData(Long workerId) throws Exception {
        User worker = getUserById(workerId);

        // CRUCIAL: Check if the user is authorized for this dashboard
        if (worker.getRole() != Role.WORKER) {
            throw new Exception("Access Denied: User is not a Worker.");
        }

        // Returns the worker entity, including skill, location, and rating.
        return worker;
    }
}
