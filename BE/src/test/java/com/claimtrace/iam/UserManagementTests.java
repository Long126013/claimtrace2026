package com.claimtrace.iam;

import com.claimtrace.iam.role.entity.Role;
import com.claimtrace.iam.role.entity.RoleName;
import com.claimtrace.iam.role.repository.RoleRepository;
import com.claimtrace.iam.security.JwtTokenProvider;
import com.claimtrace.iam.user.dto.CreateUserRequest;
import com.claimtrace.iam.user.dto.UpdateProfileRequest;
import com.claimtrace.iam.user.dto.UpdateStatusRequest;
import com.claimtrace.iam.user.dto.UpdateUserRequest;
import com.claimtrace.iam.user.entity.User;
import com.claimtrace.iam.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserManagementTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String userToken;
    private User regularUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // Ensure roles
        Role adminRole = roleRepository.findByName(RoleName.ADMIN.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ADMIN.name())));
        Role researcherRole = roleRepository.findByName(RoleName.RESEARCHER.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.RESEARCHER.name())));

        // Create Admin
        User admin = new User("admin@test.com", passwordEncoder.encode("Password@123"), "Admin");
        admin.setRoles(new HashSet<>(Set.of(adminRole)));
        User savedAdmin = userRepository.save(admin);
        adminToken = tokenProvider.generateToken(savedAdmin.getId(), savedAdmin.getEmail(), List.of("ADMIN"));

        // Create Regular User
        regularUser = new User("user@test.com", passwordEncoder.encode("Password@123"), "Regular User");
        regularUser.setRoles(new HashSet<>(Set.of(researcherRole)));
        regularUser = userRepository.save(regularUser);
        userToken = tokenProvider.generateToken(regularUser.getId(), regularUser.getEmail(), List.of("RESEARCHER"));
    }

    @Test
    @DisplayName("1. User can view their own profile")
    void testGetOwnProfile() throws Exception {
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("user@test.com")))
                .andExpect(jsonPath("$.fullName", is("Regular User")))
                .andExpect(jsonPath("$.roles", hasItem("RESEARCHER")))
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("2. User can update their own profile name")
    void testUpdateOwnProfile() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest("Updated Name");

        mockMvc.perform(put("/api/users/me")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName", is("Updated Name")))
                .andExpect(jsonPath("$.email", is("user@test.com")));

        User updated = userRepository.findById(regularUser.getId()).orElseThrow();
        assertThat(updated.getFullName()).isEqualTo("Updated Name");
    }

    @Test
    @DisplayName("3. Admin can list all users")
    void testAdminListAllUsers() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @DisplayName("4. Admin can get user by ID")
    void testAdminGetUserById() throws Exception {
        mockMvc.perform(get("/api/admin/users/" + regularUser.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(regularUser.getId())))
                .andExpect(jsonPath("$.email", is("user@test.com")));
    }

    @Test
    @DisplayName("5. Admin can create a new user")
    void testAdminCreateUser() throws Exception {
        CreateUserRequest request = new CreateUserRequest(
                "created.by.admin@test.com",
                "Password@123",
                "Created User",
                true,
                Set.of("PRINCIPAL_INVESTIGATOR")
        );

        mockMvc.perform(post("/api/admin/users")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email", is("created.by.admin@test.com")))
                .andExpect(jsonPath("$.roles", hasItem("PRINCIPAL_INVESTIGATOR")));
    }

    @Test
    @DisplayName("6. Admin can update user details")
    void testAdminUpdateUser() throws Exception {
        UpdateUserRequest request = new UpdateUserRequest(
                "modified@test.com",
                "Modified Full Name",
                true,
                null
        );

        mockMvc.perform(put("/api/admin/users/" + regularUser.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("modified@test.com")))
                .andExpect(jsonPath("$.fullName", is("Modified Full Name")));
    }

    @Test
    @DisplayName("7. Admin can enable/disable user status")
    void testAdminUpdateStatus() throws Exception {
        UpdateStatusRequest request = new UpdateStatusRequest(false);

        mockMvc.perform(patch("/api/admin/users/" + regularUser.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled", is(false)));

        User reloaded = userRepository.findById(regularUser.getId()).orElseThrow();
        assertThat(reloaded.isEnabled()).isFalse();
    }

    @Test
    @DisplayName("8. Admin can delete user")
    void testAdminDeleteUser() throws Exception {
        mockMvc.perform(delete("/api/admin/users/" + regularUser.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        assertThat(userRepository.findById(regularUser.getId())).isEmpty();
    }
}
