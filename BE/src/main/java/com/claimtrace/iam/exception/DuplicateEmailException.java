package com.claimtrace.iam.exception;

import org.springframework.http.HttpStatus;

public class DuplicateEmailException extends ApiException {
    public DuplicateEmailException(String email) {
        super(String.format("Email '%s' is already in use", email), HttpStatus.CONFLICT);
    }
}
