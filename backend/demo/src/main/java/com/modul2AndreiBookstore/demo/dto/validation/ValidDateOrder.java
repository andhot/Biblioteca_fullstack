package com.modul2AndreiBookstore.demo.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Constraint(validatedBy = {DateOrderValidator.class})
@Target(ElementType.TYPE)
@Retention(RUNTIME)
public @interface ValidDateOrder {
    String message() default "The start date must be before the end date";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
