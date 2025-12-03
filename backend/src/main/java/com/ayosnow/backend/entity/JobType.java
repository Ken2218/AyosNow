package com.ayosnow.backend.entity;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "job_types")
public class JobType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobTypeId;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "Plumbing", "Cleaning"

    @Column(length = 500)
    private String description;

    // A JobType has many Workers who specialize in it
    @OneToMany(mappedBy = "jobType")
    private List<Worker> workers = new ArrayList<>();

    // --- Getters and Setters ---
    public Long getJobTypeId() { return jobTypeId; }
    public void setJobTypeId(Long jobTypeId) { this.jobTypeId = jobTypeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    // Ideally, we don't need a getter for the full list of workers in the API response 
    // to prevent infinite recursion, usually we use @JsonIgnore here if using Jackson.
    public List<Worker> getWorkers() { return workers; }
    public void setWorkers(List<Worker> workers) { this.workers = workers; }
}