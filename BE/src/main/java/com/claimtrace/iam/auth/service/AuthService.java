package com.claimtrace.iam.auth.service;

import com.claimtrace.iam.auth.dto.AuthResponse;
import com.claimtrace.iam.auth.dto.LoginRequest;
import com.claimtrace.iam.auth.dto.RegisterRequest;
import com.claimtrace.iam.exception.AccountDisabledException;
import com.claimtrace.iam.exception.DuplicateEmailException;
import com.claimtrace.iam.exception.InvalidCredentialsException;
import com.claimtrace.iam.role.entity.Role;
import com.claimtrace.iam.role.entity.RoleName;
import com.claimtrace.iam.role.service.RoleService;
import com.claimtrace.iam.security.JwtTokenProvider;
import com.claimtrace.iam.service.TokenBlacklistService;
import com.claimtrace.iam.user.dto.UserResponse;
import com.claimtrace.iam.user.entity.User;
import com.claimtrace.iam.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthService(UserRepository userRepository,
                       RoleService roleService,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       TokenBlacklistService tokenBlacklistService) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateEmailException(normalizedEmail);
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setFullName(request.getFullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);

        // Assign default role: RESEARCHER
        Role defaultRole = roleService.getRoleByName(RoleName.RESEARCHER.name());
        Set<Role> roles = new HashSet<>();
        roles.add(defaultRole);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        log.info("Registered new user with email: {}", savedUser.getEmail());

        List<String> roleNames = roles.stream().map(Role::getName).collect(Collectors.toList());
        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), roleNames);
        long expiresInSeconds = jwtTokenProvider.getExpirationMs() / 1000;

        return new AuthResponse(token, expiresInSeconds, UserResponse.fromEntity(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> {
                    log.warn("Login failed: User with email '{}' not found", normalizedEmail);
                    return new InvalidCredentialsException();
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Login failed: Password mismatch for email '{}'", normalizedEmail);
            throw new InvalidCredentialsException();
        }

        if (!user.isEnabled()) {
            log.warn("Login rejected: Account is disabled for email '{}'", normalizedEmail);
            throw new AccountDisabledException("User account is disabled");
        }

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), roleNames);
        long expiresInSeconds = jwtTokenProvider.getExpirationMs() / 1000;

        log.info("User logged in successfully: {}", normalizedEmail);
        return new AuthResponse(token, expiresInSeconds, UserResponse.fromEntity(user));
    }

    public void logout(String bearerToken) {
        if (bearerToken == null || bearerToken.isBlank()) {
            return;
        }

        String token = bearerToken;
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            if (jwtTokenProvider.validateToken(token)) {
                Date expiration = jwtTokenProvider.getExpirationDateFromToken(token);
                long remainingMillis = expiration.getTime() - System.currentTimeMillis();
                long remainingSeconds = Math.max(1, remainingMillis / 1000);

                tokenBlacklistService.blacklistToken(token, Duration.ofSeconds(remainingSeconds));
                log.info("Token blacklisted upon logout for {} seconds", remainingSeconds);
            }
        } catch (Exception e) {
            log.warn("Error during token revocation: {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        return UserResponse.fromEntity(user);
    }
}
