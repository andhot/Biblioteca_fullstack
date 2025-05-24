package com.modul2AndreiBookstore.demo.dto;

import com.modul2AndreiBookstore.demo.dto.validation.BasicValidation;
import com.modul2AndreiBookstore.demo.dto.validation.ValidDateOrder;

import java.time.LocalDate;

@ValidDateOrder(groups = BasicValidation.class)
public class UserSearchDTO {

    LocalDate startDate;
    LocalDate endDate;
    int nrOfPages;


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

    public int getNrOfPages() {
        return nrOfPages;
    }

    public void setNrOfPages(int nrOfPages) {
        this.nrOfPages = nrOfPages;
    }
}
