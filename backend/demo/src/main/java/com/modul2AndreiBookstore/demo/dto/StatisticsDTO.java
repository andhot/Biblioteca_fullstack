package com.modul2AndreiBookstore.demo.dto;

import java.util.Map;

public class StatisticsDTO {
    private Long totalBooks;
    private Long totalReservations;
    private Long totalUsers;
    private Long totalLibraries;
    private Long activeReservations;
    private Long completedReservations;
    private Long pendingReservations;
    private Long canceledReservations;
    private Map<String, Long> booksByCategory;
    private Map<String, Long> reservationsByMonth;
    private Map<String, Long> topLibrariesByBooks;
    private Map<String, Long> reservationsByStatus;
    private Double averageReservationDuration;
    private Long totalExemplaries;
    private Long totalReviews;

    public StatisticsDTO() {}

    // Getters and Setters
    public Long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(Long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public Long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(Long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalLibraries() {
        return totalLibraries;
    }

    public void setTotalLibraries(Long totalLibraries) {
        this.totalLibraries = totalLibraries;
    }

    public Long getActiveReservations() {
        return activeReservations;
    }

    public void setActiveReservations(Long activeReservations) {
        this.activeReservations = activeReservations;
    }

    public Long getCompletedReservations() {
        return completedReservations;
    }

    public void setCompletedReservations(Long completedReservations) {
        this.completedReservations = completedReservations;
    }

    public Long getPendingReservations() {
        return pendingReservations;
    }

    public void setPendingReservations(Long pendingReservations) {
        this.pendingReservations = pendingReservations;
    }

    public Long getCanceledReservations() {
        return canceledReservations;
    }

    public void setCanceledReservations(Long canceledReservations) {
        this.canceledReservations = canceledReservations;
    }

    public Map<String, Long> getBooksByCategory() {
        return booksByCategory;
    }

    public void setBooksByCategory(Map<String, Long> booksByCategory) {
        this.booksByCategory = booksByCategory;
    }

    public Map<String, Long> getReservationsByMonth() {
        return reservationsByMonth;
    }

    public void setReservationsByMonth(Map<String, Long> reservationsByMonth) {
        this.reservationsByMonth = reservationsByMonth;
    }

    public Map<String, Long> getTopLibrariesByBooks() {
        return topLibrariesByBooks;
    }

    public void setTopLibrariesByBooks(Map<String, Long> topLibrariesByBooks) {
        this.topLibrariesByBooks = topLibrariesByBooks;
    }

    public Map<String, Long> getReservationsByStatus() {
        return reservationsByStatus;
    }

    public void setReservationsByStatus(Map<String, Long> reservationsByStatus) {
        this.reservationsByStatus = reservationsByStatus;
    }

    public Double getAverageReservationDuration() {
        return averageReservationDuration;
    }

    public void setAverageReservationDuration(Double averageReservationDuration) {
        this.averageReservationDuration = averageReservationDuration;
    }

    public Long getTotalExemplaries() {
        return totalExemplaries;
    }

    public void setTotalExemplaries(Long totalExemplaries) {
        this.totalExemplaries = totalExemplaries;
    }

    public Long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }
} 