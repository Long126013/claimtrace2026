package com.claimtrace.iam.controller;

import com.claimtrace.iam.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestAuthorizationController {

    @GetMapping("/public")
    public ResponseEntity<ApiResponse> publicEndpoint() {
        return ResponseEntity.ok(ApiResponse.ok("Public endpoint accessible without authentication"));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> adminEndpoint() {
        return ResponseEntity.ok(ApiResponse.ok("Access granted: ADMIN endpoint"));
    }

    @GetMapping("/pi")
    @PreAuthorize("hasRole('PRINCIPAL_INVESTIGATOR')")
    public ResponseEntity<ApiResponse> piEndpoint() {
        return ResponseEntity.ok(ApiResponse.ok("Access granted: PRINCIPAL_INVESTIGATOR endpoint"));
    }

    @GetMapping("/researcher")
    @PreAuthorize("hasRole('RESEARCHER')")
    public ResponseEntity<ApiResponse> researcherEndpoint() {
        return ResponseEntity.ok(ApiResponse.ok("Access granted: RESEARCHER endpoint"));
    }

    @GetMapping("/authenticated")
    public ResponseEntity<ApiResponse> authenticatedEndpoint() {
        return ResponseEntity.ok(ApiResponse.ok("Access granted: Authenticated user endpoint"));
    }
}
