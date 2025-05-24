package com.modul2AndreiBookstore.demo.dto.validation;

import com.modul2AndreiBookstore.demo.dto.ReservationDTO;
import com.modul2AndreiBookstore.demo.dto.ReservationSearchDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class DateOrderValidator implements ConstraintValidator<ValidDateOrder, Object> {
    @Override
    public void initialize(ValidDateOrder validDate) {
    }

    @Override
    public boolean isValid(Object object, ConstraintValidatorContext context) {
        if (object instanceof ReservationDTO dto) {
            return isValidDateOrder(dto.getStartDate(), dto.getEndDate());
        }
        if (object instanceof ReservationSearchDTO dto) {
            return isValidDateOrder(dto.getStartDate(), dto.getEndDate());
        }
        return false;
    }

    private boolean isValidDateOrder(LocalDate startDate, LocalDate endDate) {
        return startDate == null ||
                endDate == null ||
                startDate.isBefore(endDate) ||
                startDate.equals(endDate);
    }
}