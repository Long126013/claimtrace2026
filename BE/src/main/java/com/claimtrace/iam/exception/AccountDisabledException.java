package com.claimtrace.iam.exception;

import org.springframework.http.HttpStatus;

public class AccountDisabledException extends ApiException {
    public AccountDisabledException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }

    public AccountDisabledException() {
        super("User account is disabled", HttpStatus.FORBIDDEN);
    }
}
