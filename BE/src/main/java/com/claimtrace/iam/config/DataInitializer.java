package com.claimtrace.iam.config;

import com.claimtrace.iam.role.entity.Role;
import com.claimtrace.iam.role.entity.RoleName;
import com.claimtrace.iam.role.repository.RoleRepository;
import com.claimtrace.iam.user.entity.User;
import com.claimtrace.iam.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        initRoles();
        initDefaultAdmin();
        initDemoUsers();
    }

    private void initRoles() {
        for (RoleName roleName : RoleName.values()) {
            if (!roleRepository.existsByName(roleName.name())) {
                Role role = new Role(roleName.name());
                roleRepository.save(role);
                log.info("Initialized default role: {}", roleName.name());
            }
        }
    }

    private void initDefaultAdmin() {
        seedUser("admin@claimtrace.com", "System Administrator", "Admin@123", RoleName.ADMIN);
    }

    private void initDemoUsers() {
        seedUser("alice.vance@mit.edu", "Dr. Alice Vance", "Password@123", RoleName.RESEARCHER);
        seedUser("pi.smith@stanford.edu", "Prof. Robert Smith (PI)", "Password@123", RoleName.PRINCIPAL_INVESTIGATOR);
        seedUser("reviewer@nature.org", "Dr. Helena Chen (Auditor)", "Password@123", RoleName.REVIEWER);
    }

    private void seedUser(String email, String fullName, String rawPassword, RoleName roleName) {
        String normalizedEmail = email.trim().toLowerCase();
        Optional<User> existing = userRepository.findByEmailIgnoreCase(normalizedEmail);

        Role role = roleRepository.findByName(roleName.name())
                .orElseGet(() -> roleRepository.save(new Role(roleName.name())));

        if (existing.isEmpty()) {
            User user = new User();
            user.setEmail(normalizedEmail);
            user.setFullName(fullName);
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            user.setEnabled(true);

            Set<Role> roles = new HashSet<>();
            roles.add(role);
            user.setRoles(roles);

            userRepository.save(user);
            log.info("Seeded demo user: email={}, role={}, password={}", normalizedEmail, roleName.name(), rawPassword);
        } else {
            User user = existing.get();
            if (user.getRoles() == null || user.getRoles().stream().noneMatch(r -> r.getName().equals(roleName.name()))) {
                user.addRole(role);
            }
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            user.setEnabled(true);
            userRepository.save(user);
            log.info("Verified demo user: email={}, role={}, password={}", normalizedEmail, roleName.name(), rawPassword);
        }
    }
}
