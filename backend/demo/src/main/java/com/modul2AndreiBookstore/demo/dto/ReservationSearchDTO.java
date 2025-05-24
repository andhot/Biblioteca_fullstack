package com.modul2AndreiBookstore.demo.dto;

import com.modul2AndreiBookstore.demo.dto.validation.AdvancedValidation;
import com.modul2AndreiBookstore.demo.dto.validation.ValidDateOrder;
import com.modul2AndreiBookstore.demo.entities.ReservationStatus;

import java.time.LocalDate;
import java.util.List;

@ValidDateOrder(groups = AdvancedValidation.class)
public class ReservationSearchDTO {
    LocalDate startDate;
    LocalDate endDate;
    private List<ReservationStatus> reservationStatusList;

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public List<ReservationStatus> getReservationStatusList() {
        return reservationStatusList;
    }

    public void setReservationStatusList(List<ReservationStatus> reservationStatusList) {
        this.reservationStatusList = reservationStatusList;
    }
}