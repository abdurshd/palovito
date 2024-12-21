package com.rgt.restaurant.exception;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ErrorResponse {
    private String message;
    private String details;
    private String errorCode;
    private String path;
    private LocalDateTime timestamp;

    public ErrorResponse(String message, String details, String errorCode, String path) {
        this.message = message;
        this.details = details;
        this.errorCode = errorCode;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }

    // Constructor for backward compatibility
    public ErrorResponse(String message) {
        this(message, null, "UNKNOWN_ERROR", null);
    }
} 