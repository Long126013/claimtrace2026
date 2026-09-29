# ==============================================================================
# Stage 1: Build Application
# ==============================================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build package
COPY src ./src
RUN mvn clean package -DskipTests

# ==============================================================================
# Stage 2: Lightweight Runtime Image
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Run as non-root user for security
RUN addgroup -S claimtrace && adduser -S claimtrace -G claimtrace
USER claimtrace:claimtrace

# Copy built artifact
COPY --from=builder /app/target/claimtrace-iam-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
