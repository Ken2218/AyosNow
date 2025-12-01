package com.ayosnow.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table; // Added to handle potential reserved keyword conflict

@Entity
@Table(name = "User") // Explicitly mapping to the 'User' table
public class User {

    public enum Role {
        CUSTOMER,
        WORKER
    }

    // Maps the Java field 'id' (String) to the DB column 'UserID' (VARCHAR)
    @Id
    @Column(name = "UserID")
    private String id; 

    private String name;
    private String email;

@Column(name = "password_hash") // <-- Must be lowercase and underscore
private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String skill; // For WORKERs

    // --- Getters and Setters ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }
}