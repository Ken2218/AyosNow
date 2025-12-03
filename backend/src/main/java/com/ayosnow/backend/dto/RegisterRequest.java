package com.ayosnow.backend.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // "CUSTOMER" or "WORKER"
    
    private String phoneNumber;
    private String location; // Address
    
    // Worker Specific Fields (Can be null if registering a customer)
    private Long jobTypeId; // Replaces 'skill' string
    private Double hourlyRate;
    private Integer experienceYears;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Long getJobTypeId() { return jobTypeId; }
    public void setJobTypeId(Long jobTypeId) { this.jobTypeId = jobTypeId; }

    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
}