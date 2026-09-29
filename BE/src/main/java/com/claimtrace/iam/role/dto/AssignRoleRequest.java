package com.claimtrace.iam.role.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public class AssignRoleRequest {

    @NotBlank(message = "Role name is required")
    @JsonAlias({"roleName", "name"})
    private String role;

    public AssignRoleRequest() {
    }

    public AssignRoleRequest(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
