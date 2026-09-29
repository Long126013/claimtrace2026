package com.claimtrace.iam.role.entity;

public enum RoleName {
    ADMIN,
    PRINCIPAL_INVESTIGATOR,
    RESEARCHER;

    public static boolean isValid(String roleName) {
        if (roleName == null) {
            return false;
        }
        for (RoleName role : values()) {
            if (role.name().equalsIgnoreCase(roleName.trim())) {
                return true;
            }
        }
        return false;
    }

    public static RoleName fromString(String roleName) {
        if (roleName == null) {
            throw new IllegalArgumentException("Role name cannot be null");
        }
        String cleaned = roleName.trim().toUpperCase();
        if (cleaned.startsWith("ROLE_")) {
            cleaned = cleaned.substring(5);
        }
        return RoleName.valueOf(cleaned);
    }
}
