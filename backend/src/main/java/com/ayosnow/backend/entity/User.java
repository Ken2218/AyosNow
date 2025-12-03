package com.ayosnow.backend.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password; 

    private String phoneNumber;

    private String address;

    @Column(updatable = false)
    private LocalDateTime dateRegistered;

    // --- FIX IS HERE ---
    // Changed mappedBy="user" to mappedBy="customer"
    // This must match "private User customer;" inside Booking.java
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Review> reviewsWritten = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        dateRegistered = LocalDateTime.now();
    }

    // --- Getters and Setters ---
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDateTime getDateRegistered() { return dateRegistered; }

    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
    
    public List<Review> getReviewsWritten() { return reviewsWritten; }
    public void setReviewsWritten(List<Review> reviewsWritten) { this.reviewsWritten = reviewsWritten; }
}