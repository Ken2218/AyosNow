package com.ayosnow.backend.dto;

public class ReviewRequest {
    private Long bookingId; // We use bookingId to find the user and worker automatically
    private Integer rating;
    private String comment;

    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}