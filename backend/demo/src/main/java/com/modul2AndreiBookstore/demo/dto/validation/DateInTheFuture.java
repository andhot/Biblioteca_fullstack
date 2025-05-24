package com.modul2AndreiBookstore.demo.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Constraint(validatedBy = {DateInTheFutureValidator.class})
@Target(ElementType.FIELD)
@Retention(RUNTIME)
public @interface DateInTheFuture {
    String message() default "The date must be today or in the future";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
