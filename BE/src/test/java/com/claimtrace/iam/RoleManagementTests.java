package com.claimtrace.iam;

import com.claimtrace.iam.role.dto.AssignRoleRequest;
import com.claimtrace.iam.role.entity.Role;
import com.claimtrace.iam.role.entity.RoleName;
import com.claimtrace.iam.role.repository.RoleRepository;
import com.claimtrace.iam.security.JwtTokenProvider;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RoleManagementTests {

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
    private User targetUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // Ensure roles
        Role adminRole = roleRepository.findByName(RoleName.ADMIN.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ADMIN.name())));
        roleRepository.findByName(RoleName.PRINCIPAL_INVESTIGATOR.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.PRINCIPAL_INVESTIGATOR.name())));
        Role researcherRole = roleRepository.findByName(RoleName.RESEARCHER.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.RESEARCHER.name())));

        // Admin User
        User admin = new User("admin.roles@example.com", passwordEncoder.encode("Password@123"), "Admin");
        admin.setRoles(new HashSet<>(Set.of(adminRole)));
        User savedAdmin = userRepository.save(admin);
        adminToken = tokenProvider.generateToken(savedAdmin.getId(), savedAdmin.getEmail(), List.of("ADMIN"));

        // Target User
        targetUser = new User("target@example.com", passwordEncoder.encode("Password@123"), "Target User");
        targetUser.setRoles(new HashSet<>(Set.of(researcherRole)));
        targetUser = userRepository.save(targetUser);
    }

    @Test
    @DisplayName("1. Admin assigns PRINCIPAL_INVESTIGATOR role and verifies persistence")
    void testAssignRoleAndVerifyPersistence() throws Exception {
        AssignRoleRequest request = new AssignRoleRequest("PRINCIPAL_INVESTIGATOR");

        mockMvc.perform(post("/api/admin/users/" + targetUser.getId() + "/roles")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roles", hasItems("RESEARCHER", "PRINCIPAL_INVESTIGATOR")));

        // Verify persistence in PostgreSQL repository
        User reloadedUser = userRepository.findById(targetUser.getId()).orElseThrow();
        Set<String> persistedRoleNames = reloadedUser.getRoles().stream()
                .map(Role::getName)
                .collect(java.util.stream.Collectors.toSet());

        assertThat(persistedRoleNames).contains("RESEARCHER", "PRINCIPAL_INVESTIGATOR");
    }

    @Test
    @DisplayName("2. Admin removes role and verifies persistence")
    void testRemoveRoleAndVerifyPersistence() throws Exception {
        // Pre-assign role
        Role piRole = roleRepository.findByName(RoleName.PRINCIPAL_INVESTIGATOR.name()).orElseThrow();
        targetUser.addRole(piRole);
        targetUser = userRepository.save(targetUser);

        assertThat(targetUser.getRoles()).hasSize(2);

        // Remove RESEARCHER role
        mockMvc.perform(delete("/api/admin/users/" + targetUser.getId() + "/roles/RESEARCHER")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roles", not(hasItem("RESEARCHER"))))
                .andExpect(jsonPath("$.roles", hasItem("PRINCIPAL_INVESTIGATOR")));

        // Verify persistence in repository
        User reloadedUser = userRepository.findById(targetUser.getId()).orElseThrow();
        Set<String> persistedRoleNames = reloadedUser.getRoles().stream()
                .map(Role::getName)
                .collect(java.util.stream.Collectors.toSet());

        assertThat(persistedRoleNames).doesNotContain("RESEARCHER");
        assertThat(persistedRoleNames).contains("PRINCIPAL_INVESTIGATOR");
    }
}
