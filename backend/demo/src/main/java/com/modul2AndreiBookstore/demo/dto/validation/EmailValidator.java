package com.modul2AndreiBookstore.demo.dto.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class EmailValidator implements ConstraintValidator<ValidEmail, String> {
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    @Override
    public void initialize(ValidEmail validEmail) {
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return EMAIL_PATTERN.matcher(email).matches();
    }
}
