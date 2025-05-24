package com.modul2AndreiBookstore.demo.dto.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class PhoneNumberValidator implements ConstraintValidator<ValidPhoneNumber, String> {
    private static final String PHONE_REGEX = "^(07\\d{8}|\\+407\\d{8}|00407\\d{8})$";
    private static final Pattern PHONE_PATTERN = Pattern.compile(PHONE_REGEX);

    @Override
    public void initialize(ValidPhoneNumber validPhoneNumber) {
    }

    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext context) {
        return PHONE_PATTERN.matcher(phoneNumber).matches();
    }
}