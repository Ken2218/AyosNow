package com.ayosnow.backend.dto;

import java.time.LocalDateTime;

public class BookingRequest {
    private Long customerId;
    private String service;
    private String description;
    private LocalDateTime scheduledTime;
    private String location;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
