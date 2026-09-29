package com.claimtrace.iam.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {

    private static final Logger log = LoggerFactory.getLogger(TokenBlacklistService.class);
    private static final String REDIS_PREFIX = "jwt:blacklist:";

    private final StringRedisTemplate redisTemplate;
    // Local fallback cache in case Redis is temporarily unreachable or for isolated slice tests
    private final ConcurrentHashMap<String, Long> localBlacklist = new ConcurrentHashMap<>();

    public TokenBlacklistService(@Autowired(required = false) StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void blacklistToken(String token, Duration ttl) {
        if (token == null || token.isBlank()) {
            return;
        }

        long ttlSeconds = ttl.getSeconds();
        if (ttlSeconds <= 0) {
            ttlSeconds = 1800; // default 30 min if token already near expiry
        }

        // Store in local cache
        localBlacklist.put(token, System.currentTimeMillis() + (ttlSeconds * 1000));

        // Store in Redis with TTL
        if (redisTemplate != null) {
            try {
                redisTemplate.opsForValue().set(
                        REDIS_PREFIX + token,
                        "revoked",
                        ttlSeconds,
                        TimeUnit.SECONDS
                );
                log.info("Token successfully blacklisted in Redis with TTL {} seconds", ttlSeconds);
            } catch (Exception e) {
                log.warn("Failed to blacklist token in Redis, local cache fallback applied: {}", e.getMessage());
            }
        }
    }

    public boolean isBlacklisted(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        // 1. Check Redis if available
        if (redisTemplate != null) {
            try {
                Boolean hasKey = redisTemplate.hasKey(REDIS_PREFIX + token);
                if (Boolean.TRUE.equals(hasKey)) {
                    return true;
                }
            } catch (Exception e) {
                log.warn("Redis check failed, falling back to local blacklist: {}", e.getMessage());
            }
        }

        // 2. Check local fallback cache
        Long expiryTime = localBlacklist.get(token);
        if (expiryTime != null) {
            if (System.currentTimeMillis() < expiryTime) {
                return true;
            } else {
                localBlacklist.remove(token);
            }
        }

        return false;
    }
}
