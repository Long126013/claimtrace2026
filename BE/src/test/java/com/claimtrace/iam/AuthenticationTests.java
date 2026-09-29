package com.claimtrace.iam;

import com.claimtrace.iam.auth.dto.LoginRequest;
import com.claimtrace.iam.auth.dto.RegisterRequest;
import com.claimtrace.iam.role.entity.Role;
import com.claimtrace.iam.role.entity.RoleName;
import com.claimtrace.iam.role.repository.RoleRepository;
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
import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthenticationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // Ensure default roles exist
        for (RoleName roleName : RoleName.values()) {
            if (!roleRepository.existsByName(roleName.name())) {
                roleRepository.save(new Role(roleName.name()));
            }
        }
    }

    @Test
    @DisplayName("1. Successful user registration")
    void testSuccessfulRegistration() throws Exception {
        RegisterRequest request = new RegisterRequest("newuser@example.com", "Secret@123", "New User");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.expiresIn", is(1800)))
                .andExpect(jsonPath("$.user.email", is("newuser@example.com")))
                .andExpect(jsonPath("$.user.fullName", is("New User")))
                .andExpect(jsonPath("$.user.roles", hasItem("RESEARCHER")))
                .andExpect(jsonPath("$.user.password").doesNotExist())
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("2. Registration fails with duplicate email")
    void testDuplicateEmailRegistration() throws Exception {
        // Pre-create user
        User user = new User("duplicate@example.com", passwordEncoder.encode("Secret@123"), "Original User");
        userRepository.save(user);

        RegisterRequest request = new RegisterRequest("duplicate@example.com", "Another@123", "Duplicate User");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("Conflict")))
                .andExpect(jsonPath("$.message", containsString("is already in use")));
    }

    @Test
    @DisplayName("3. Successful login returns JWT access token")
    void testSuccessfulLogin() throws Exception {
        User user = new User("loginuser@example.com", passwordEncoder.encode("Password@123"), "Login User");
        Role researcher = roleRepository.findByName(RoleName.RESEARCHER.name()).orElseThrow();
        Set<Role> roles = new HashSet<>();
        roles.add(researcher);
        user.setRoles(roles);
        userRepository.save(user);

        LoginRequest request = new LoginRequest("loginuser@example.com", "Password@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.expiresIn", is(1800)))
                .andExpect(jsonPath("$.user.email", is("loginuser@example.com")))
                .andExpect(jsonPath("$.user.password").doesNotExist())
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("4. Login fails with wrong password")
    void testWrongPasswordLogin() throws Exception {
        User user = new User("testuser@example.com", passwordEncoder.encode("CorrectPassword"), "Test User");
        userRepository.save(user);

        LoginRequest request = new LoginRequest("testuser@example.com", "WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.error", is("Unauthorized")))
                .andExpect(jsonPath("$.message", is("Invalid email or password")));
    }

    @Test
    @DisplayName("5. Disabled user cannot login")
    void testDisabledUserCannotLogin() throws Exception {
        User user = new User("disabled@example.com", passwordEncoder.encode("Password@123"), "Disabled User");
        user.setEnabled(false);
        userRepository.save(user);

        LoginRequest request = new LoginRequest("disabled@example.com", "Password@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)))
                .andExpect(jsonPath("$.error", is("Forbidden")))
                .andExpect(jsonPath("$.message", containsString("disabled")));
    }
}
