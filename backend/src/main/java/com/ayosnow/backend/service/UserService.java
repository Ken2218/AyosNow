package com.ayosnow.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ayosnow.backend.entity.User;
import com.ayosnow.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register Customer
    public User registerUser(User user) throws Exception {
        // CORRECTION HERE: We use Optional<User> because the repo returns Optional
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        
        // Check if the Optional contains a value
        if (existingUser.isPresent()) {
            throw new Exception("Email already exists!");
        }
        return userRepository.save(user);
    }

    // Login Customer
    public User loginUser(String email, String password) throws Exception {
        // CORRECTION HERE: We use Optional<User>
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        // Check if user exists AND password matches
        if (userOpt.isPresent()) {
            User user = userOpt.get(); // Unwrap the user object
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        throw new Exception("Invalid email or password");
    }

    public User getUserById(Long id) throws Exception {
        return userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));
    }
}
