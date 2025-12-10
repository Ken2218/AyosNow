package com.ayosnow.backend.dto;

import java.time.LocalDateTime;

public class BookingResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long workerId;
    private String workerName;
    
    private String service; // This will hold the JobType Name (e.g. "Cleaning")
    
    private String description;
    private LocalDateTime scheduledTime;
    private String status;
    private String location;
    private Integer rating;
    private Double totalCost; // Added to match Entity
    private Double price;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public Long getWorkerId() { return workerId; }
    public void setWorkerId(Long workerId) { this.workerId = workerId; }
    
    public String getWorkerName() { return workerName; }
    public void setWorkerName(String workerName) { this.workerName = workerName; }
    
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
}
