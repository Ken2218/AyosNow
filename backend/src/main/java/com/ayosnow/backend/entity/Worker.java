package com.ayosnow.backend.entity;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "workers")
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workerId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    // ✅ ADDED: Password field for worker login
    private String password;

    private String phoneNumber;

    private String address;

    private Integer experienceYears;

    private Double hourlyRate;

    private String availabilityStatus; // e.g., "AVAILABLE", "BUSY"

    private Double rating;

    // Relationship to JobType ("specializes in")
    @ManyToOne
    @JoinColumn(name = "job_type_id")
    private JobType jobType;

    // A Worker "performs" bookings
    @OneToMany(mappedBy = "worker", cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();

    // Worker receives reviews
    @OneToMany(mappedBy = "worker")
    private List<Review> reviewsReceived = new ArrayList<>();

    // --- Getters and Setters ---
    public Long getWorkerId() { return workerId; }
    public void setWorkerId(Long workerId) { this.workerId = workerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    // ✅ ADDED: Getters and Setters for password
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
    
    public List<Review> getReviewsReceived() { return reviewsReceived; }
    public void setReviewsReceived(List<Review> reviewsReceived) { this.reviewsReceived = reviewsReceived; }
}