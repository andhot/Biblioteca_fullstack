package com.modul2AndreiBookstore.demo.exceptions;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.InputMismatchException;
import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(InputMismatchException.class)
    public ResponseEntity<?> handleInputMismatchException(InputMismatchException inputMismatchException) {
        ErrorDetail error = new ErrorDetail(inputMismatchException.getMessage());
        return new ResponseEntity<>(error, BAD_REQUEST);
        //return ResponseEntity.badRequest().build();
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleIllegalStateException(IllegalStateException illegalStateException) {
        ErrorDetail error = new ErrorDetail(illegalStateException.getMessage());
        return new ResponseEntity<>(error, BAD_REQUEST);
    }

    @ExceptionHandler(UnsupportedOperationException.class)
    public ResponseEntity<?> handleUnsupportedOperationException(UnsupportedOperationException unsupportedOperationException) {
        ErrorDetail error = new ErrorDetail(unsupportedOperationException.getMessage());
        return new ResponseEntity<>(error, BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleEntityNotFoundException(EntityNotFoundException entityNotFoundException) {
        ErrorDetail error = new ErrorDetail(entityNotFoundException.getMessage());
        return new ResponseEntity<>(error, BAD_REQUEST);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String property = getProperty(error);
            String message = error.getDefaultMessage();
            errors.put(property, message);
        });
        return new ResponseEntity<>(errors, BAD_REQUEST);
    }

    private String getProperty(ObjectError objectError) {
        if (objectError instanceof FieldError) {
            return ((FieldError) objectError).getField();
        }
        return objectError.getObjectName();
    }
}
