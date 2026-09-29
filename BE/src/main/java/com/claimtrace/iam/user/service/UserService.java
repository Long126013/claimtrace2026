package com.claimtrace.iam.user.service;

import com.claimtrace.iam.exception.DuplicateEmailException;
import com.claimtrace.iam.exception.ResourceNotFoundException;
import com.claimtrace.iam.role.entity.Role;
import com.claimtrace.iam.role.entity.RoleName;
import com.claimtrace.iam.role.service.RoleService;
import com.claimtrace.iam.user.dto.CreateUserRequest;
import com.claimtrace.iam.user.dto.UpdateProfileRequest;
import com.claimtrace.iam.user.dto.UpdateUserRequest;
import com.claimtrace.iam.user.dto.UserResponse;
import com.claimtrace.iam.user.entity.User;
import com.claimtrace.iam.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleService roleService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public User getUserEntityById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Transactional(readOnly = true)
    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        return UserResponse.fromEntity(getUserEntityById(id));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        return UserResponse.fromEntity(getUserEntityByEmail(email));
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateEmailException(normalizedEmail);
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setFullName(request.getFullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(request.getEnabled() == null || request.getEnabled());

        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String roleName : request.getRoles()) {
                roles.add(roleService.getRoleByName(roleName));
            }
        } else {
            // Default role is RESEARCHER
            roles.add(roleService.getRoleByName(RoleName.RESEARCHER.name()));
        }
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        log.info("User created successfully with id {} and email {}", savedUser.getId(), savedUser.getEmail());
        return UserResponse.fromEntity(savedUser);
    }

    @Transactional
    public UserResponse updateUser(String id, UpdateUserRequest request) {
        User user = getUserEntityById(id);

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String normalizedEmail = request.getEmail().trim().toLowerCase();
            if (!normalizedEmail.equalsIgnoreCase(user.getEmail()) &&
                    userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                throw new DuplicateEmailException(normalizedEmail);
            }
            user.setEmail(normalizedEmail);
        }

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }

        if (request.getRoles() != null) {
            Set<Role> newRoles = new HashSet<>();
            for (String roleName : request.getRoles()) {
                newRoles.add(roleService.getRoleByName(roleName));
            }
            user.setRoles(newRoles);
        }

        User updatedUser = userRepository.save(user);
        log.info("User updated successfully with id {}", updatedUser.getId());
        return UserResponse.fromEntity(updatedUser);
    }

    @Transactional
    public UserResponse updateUserStatus(String id, boolean enabled) {
        User user = getUserEntityById(id);
        user.setEnabled(enabled);
        User updatedUser = userRepository.save(user);
        log.info("User status updated for id {}: enabled={}", id, enabled);
        return UserResponse.fromEntity(updatedUser);
    }

    @Transactional
    public UserResponse updateProfile(String userEmail, UpdateProfileRequest request) {
        User user = getUserEntityByEmail(userEmail);
        user.setFullName(request.getFullName().trim());
        User updatedUser = userRepository.save(user);
        log.info("User profile updated for email {}", user.getEmail());
        return UserResponse.fromEntity(updatedUser);
    }

    @Transactional
    public void deleteUser(String id) {
        User user = getUserEntityById(id);
        userRepository.delete(user);
        log.info("User deleted successfully with id {}", id);
    }

    @Transactional
    public UserResponse assignRoleToUser(String userId, String roleName) {
        User user = getUserEntityById(userId);
        Role role = roleService.getRoleByName(roleName);

        user.addRole(role);
        User updatedUser = userRepository.save(user);
        log.info("Assigned role '{}' to user id '{}'", role.getName(), userId);
        return UserResponse.fromEntity(updatedUser);
    }

    @Transactional
    public UserResponse removeRoleFromUser(String userId, String roleName) {
        User user = getUserEntityById(userId);
        Role role = roleService.getRoleByName(roleName);

        user.removeRole(role);
        User updatedUser = userRepository.save(user);
        log.info("Removed role '{}' from user id '{}'", role.getName(), userId);
        return UserResponse.fromEntity(updatedUser);
    }
}
