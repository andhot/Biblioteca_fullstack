package com.modul2AndreiBookstore.demo.dto.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {
    @Override
    public void initialize(ValidPassword validPassword) {
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        return password.length() >= 6;
    }
}
