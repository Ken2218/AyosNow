package com.ayosnow.backend.dto;

import java.time.LocalDateTime;

public class BookingRequest {
    private Long customerId;
    
    // CHANGED: We now link to a JobType ID, not a string name
    private Long jobTypeId; 
    
    private String description;
    private LocalDateTime scheduledTime;
    private String location;

    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public Long getJobTypeId() { return jobTypeId; }
    public void setJobTypeId(Long jobTypeId) { this.jobTypeId = jobTypeId; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}