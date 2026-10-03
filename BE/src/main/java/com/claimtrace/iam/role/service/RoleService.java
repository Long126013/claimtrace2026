package com.claimtrace.iam.role.service;

import com.claimtrace.iam.exception.InvalidRoleException;
import com.claimtrace.iam.exception.ResourceNotFoundException;
import com.claimtrace.iam.role.entity.Role;
import com.claimtrace.iam.role.entity.RoleName;
import com.claimtrace.iam.role.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Role getRoleByName(String roleName) {
        if (roleName == null || roleName.isBlank()) {
            throw new InvalidRoleException("Role name cannot be empty");
        }

        String normalizedName = normalizeRoleName(roleName);
        return roleRepository.findByName(normalizedName)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", normalizedName));
    }

    @Transactional
    public Role findOrCreateRole(String roleName) {
        String normalized = normalizeRoleName(roleName);
        return roleRepository.findByName(normalized)
                .orElseGet(() -> roleRepository.save(new Role(normalized)));
    }

    public String normalizeRoleName(String roleName) {
        String cleaned = roleName.trim().toUpperCase();
        if (cleaned.startsWith("ROLE_")) {
            cleaned = cleaned.substring(5);
        }
        if (!RoleName.isValid(cleaned)) {
            throw new InvalidRoleException(String.format("Invalid role: '%s'. Allowed roles are ADMIN, PRINCIPAL_INVESTIGATOR, RESEARCHER, REVIEWER, AUDITOR", roleName));
        }
        return cleaned;
    }
}
