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
        String adminEmail = "admin@claimtrace.com";
        Optional<User> existingAdmin = userRepository.findByEmailIgnoreCase(adminEmail);

        Role adminRole = roleRepository.findByName(RoleName.ADMIN.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ADMIN.name())));

        if (existingAdmin.isEmpty()) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setFullName("System Administrator");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setEnabled(true);

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
            log.info("Seeded default admin user: email={}, password=Admin@123", adminEmail);
        } else {
            User admin = existingAdmin.get();
            // Ensure admin role is assigned
            if (admin.getRoles() == null || admin.getRoles().stream().noneMatch(r -> r.getName().equals(RoleName.ADMIN.name()))) {
                admin.addRole(adminRole);
            }
            // Ensure admin has valid password hash for Admin@123 so demonstration works reliably
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setEnabled(true);
            userRepository.save(admin);
            log.info("Verified and updated default admin user: email={}, password=Admin@123", adminEmail);
        }
    }
}
