package com.claimtrace.iam;

import com.claimtrace.iam.role.entity.Role;
import com.claimtrace.iam.role.entity.RoleName;
import com.claimtrace.iam.role.repository.RoleRepository;
import com.claimtrace.iam.security.JwtTokenProvider;
import com.claimtrace.iam.user.entity.User;
import com.claimtrace.iam.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthorizationTests {

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

    private String adminToken;
    private String piToken;
    private String researcherToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // Ensure roles
        Role adminRole = roleRepository.findByName(RoleName.ADMIN.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ADMIN.name())));
        Role piRole = roleRepository.findByName(RoleName.PRINCIPAL_INVESTIGATOR.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.PRINCIPAL_INVESTIGATOR.name())));
        Role researcherRole = roleRepository.findByName(RoleName.RESEARCHER.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.RESEARCHER.name())));

        // Create Admin
        User admin = new User("admin.test@example.com", passwordEncoder.encode("Password@123"), "Admin Test");
        admin.setRoles(new HashSet<>(Set.of(adminRole)));
        User savedAdmin = userRepository.save(admin);
        adminToken = tokenProvider.generateToken(savedAdmin.getId(), savedAdmin.getEmail(), List.of("ADMIN"));

        // Create PI
        User pi = new User("pi.test@example.com", passwordEncoder.encode("Password@123"), "PI Test");
        pi.setRoles(new HashSet<>(Set.of(piRole)));
        User savedPi = userRepository.save(pi);
        piToken = tokenProvider.generateToken(savedPi.getId(), savedPi.getEmail(), List.of("PRINCIPAL_INVESTIGATOR"));

        // Create Researcher
        User researcher = new User("researcher.test@example.com", passwordEncoder.encode("Password@123"), "Researcher Test");
        researcher.setRoles(new HashSet<>(Set.of(researcherRole)));
        User savedResearcher = userRepository.save(researcher);
        researcherToken = tokenProvider.generateToken(savedResearcher.getId(), savedResearcher.getEmail(), List.of("RESEARCHER"));
    }

    @Test
    @DisplayName("1. Unauthenticated request to protected endpoint is rejected (401)")
    void testUnauthenticatedRequestRejected() throws Exception {
        mockMvc.perform(get("/api/test/admin"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.error", is("Unauthorized")));
    }

    @Test
    @DisplayName("2. ADMIN can access admin endpoint (200)")
    void testAdminCanAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/test/admin")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("ADMIN endpoint")));
    }

    @Test
    @DisplayName("3. RESEARCHER cannot access admin endpoint (403)")
    void testResearcherCannotAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/test/admin")
                        .header("Authorization", "Bearer " + researcherToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)))
                .andExpect(jsonPath("$.error", is("Forbidden")));
    }

    @Test
    @DisplayName("4. PI can access PI endpoint (200)")
    void testPiCanAccessPiEndpoint() throws Exception {
        mockMvc.perform(get("/api/test/pi")
                        .header("Authorization", "Bearer " + piToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("PRINCIPAL_INVESTIGATOR endpoint")));
    }

    @Test
    @DisplayName("5. RESEARCHER can access researcher endpoint (200)")
    void testResearcherCanAccessResearcherEndpoint() throws Exception {
        mockMvc.perform(get("/api/test/researcher")
                        .header("Authorization", "Bearer " + researcherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("RESEARCHER endpoint")));
    }

    @Test
    @DisplayName("6. Revoked JWT cannot access protected endpoints after logout")
    void testRevokedTokenCannotAccessProtectedEndpoint() throws Exception {
        // First verify token works
        mockMvc.perform(get("/api/test/researcher")
                        .header("Authorization", "Bearer " + researcherToken))
                .andExpect(status().isOk());

        // Perform logout to revoke token
        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Bearer " + researcherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        // Now attempt to access protected endpoint with the revoked token -> should be 401
        mockMvc.perform(get("/api/test/researcher")
                        .header("Authorization", "Bearer " + researcherToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }
}
