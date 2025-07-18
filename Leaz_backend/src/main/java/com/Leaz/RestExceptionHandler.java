package com.Leaz;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Global exception handler to translate custom exceptions into appropriate HTTP responses.
 */
@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = { DuplicateNameException.class, IllegalArgumentException.class, NotFoundException.class })
    protected ResponseEntity<Object> handleConflict(RuntimeException ex, WebRequest request) {
        HttpStatus status;
        if (ex instanceof DuplicateNameException) {
            status = HttpStatus.CONFLICT; // 409
        } else if (ex instanceof IllegalArgumentException) {
            status = HttpStatus.BAD_REQUEST; // 400
        } else {
            status = HttpStatus.NOT_FOUND; // 404
        }
        return handleExceptionInternal(ex, ex.getMessage(),
          null, status, request);
    }
}
