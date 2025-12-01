package com.ayosnow.backend.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    public enum Role {
        CUSTOMER,
        WORKER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String password;
    
    private String phoneNumber;

    private String address;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    private String skill;
    
    private String location;
    
    private Double rating;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Booking> customerBookings = new ArrayList<>();
    
    @OneToMany(mappedBy = "worker", cascade = CascadeType.ALL)
    private List<Booking> workerBookings = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (role == Role.WORKER && rating == null) {
            rating = 4.5;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    
    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    public List<Booking> getCustomerBookings() { return customerBookings; }
    public void setCustomerBookings(List<Booking> customerBookings) { this.customerBookings = customerBookings; }
    
    public List<Booking> getWorkerBookings() { return workerBookings; }
    public void setWorkerBookings(List<Booking> workerBookings) { this.workerBookings = workerBookings; }
}
