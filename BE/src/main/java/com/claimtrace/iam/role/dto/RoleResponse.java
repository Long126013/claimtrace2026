package com.claimtrace.iam.role.dto;

import com.claimtrace.iam.role.entity.Role;

public class RoleResponse {

    private String id;
    private String name;

    public RoleResponse() {
    }

    public RoleResponse(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public static RoleResponse fromEntity(Role role) {
        if (role == null) {
            return null;
        }
        return new RoleResponse(role.getId(), role.getName());
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
