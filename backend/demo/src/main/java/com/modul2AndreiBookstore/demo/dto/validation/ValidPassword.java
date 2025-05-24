package com.modul2AndreiBookstore.demo.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Constraint(validatedBy = {PasswordValidator.class})
@Target(ElementType.FIELD)
@Retention(RUNTIME)
public @interface ValidPassword {
    String message() default "Not enough characters, minimum required 6";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
