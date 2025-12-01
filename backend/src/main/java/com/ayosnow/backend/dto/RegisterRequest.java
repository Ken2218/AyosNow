package com.ayosnow.backend.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String skill;
    private String phoneNumber;
    private String location;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
