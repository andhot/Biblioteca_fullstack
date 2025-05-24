package com.modul2AndreiBookstore.demo.dto;

import java.time.LocalDateTime;

public class ErrorResponse {
    private String errorMessage;
    private LocalDateTime time;

    public ErrorResponse(String errorMessage) {
        this.errorMessage = errorMessage;
        this.time = LocalDateTime.now();
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }
} 