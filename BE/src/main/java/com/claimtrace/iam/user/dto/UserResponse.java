package com.claimtrace.iam.user.dto;

import com.claimtrace.iam.role.entity.Role;
import com.claimtrace.iam.user.entity.User;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class UserResponse {

    private String id;
    private String email;
    private String fullName;
    private boolean enabled;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private Set<String> roles;

    public UserResponse() {
    }

    public UserResponse(String id, String email, String fullName, boolean enabled,
                        OffsetDateTime createdAt, OffsetDateTime updatedAt, Set<String> roles) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.roles = roles;
    }

    public static UserResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        Set<String> roleNames = user.getRoles() == null ? Set.of() :
                user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet());

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.isEnabled(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                roleNames
        );
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
